package com.sems.service.impl;

import com.sems.dto.*;
import com.sems.entity.*;
import com.sems.repository.*;
import com.sems.security.JwtUtils;
import com.sems.service.UserService;
import com.sems.service.NotificationService;
import com.sems.service.EmailService;
import com.sems.util.DTOMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;
        private final com.sems.repository.OrganizerProfileRepository organizerProfileRepository;
        private final com.sems.repository.EventRepository eventRepository;
        private final com.sems.repository.BookingRepository bookingRepository;
        private final com.sems.repository.AttendanceRepository attendanceRepository;
        private final com.sems.service.NotificationService notificationService;
        private final com.sems.service.EmailService emailService;

        @Override
        public AuthResponse register(RegisterRequest request) {

                // Validate passwords match
                if (request.getConfirmPassword() != null &&
                                !request.getPassword().equals(request.getConfirmPassword())) {
                        throw new RuntimeException("Passwords do not match");
                }

                // Explicitly check if email already exists
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists: " + request.getEmail());
                }

                var role = request.getRole() != null ? request.getRole() : Role.USER;

                // Profile image is not handled in initial registration
                String profileImagePath = null;

                var user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(role)
                                .profileImage(profileImagePath)
                                .enabled(true)
                                .build();

                if (role == Role.ORGANIZER) {
                        if (request.getOrganizationName() == null || request.getOrganizationName().isBlank()) {
                                throw new RuntimeException("Organization Name is required for Organizers");
                        }
                        if (request.getContactNumber() == null || request.getContactNumber().isBlank()) {
                                throw new RuntimeException("Contact Number is required for Organizers");
                        }

                        com.sems.entity.OrganizerProfile profile = com.sems.entity.OrganizerProfile.builder()
                                        .user(user)
                                        .organizationName(request.getOrganizationName())
                                        .contactNumber(request.getContactNumber())
                                        .applyDate(java.time.LocalDateTime.now())
                                        .approvalStatus(com.sems.entity.OrganizerStatus.PENDING)
                                        .build();

                        user.setOrganizerProfile(profile);
                }

                userRepository.save(user);

                // If organizer, send "Application Under Review" email
                if (user.getRole() == Role.ORGANIZER) {
                        try {
                                java.util.Map<String, Object> vars = new java.util.HashMap<>();
                                vars.put("organizerName", user.getName());
                                vars.put("applyDate", java.time.LocalDateTime.now().toString());

                                emailService.sendHtmlEmail(
                                                user.getEmail(),
                                                "Organizer Application Under Review",
                                                "organizer-review",
                                                vars);
                        } catch (Exception e) {
                                System.err.println("Failed to send review email: " + e.getMessage());
                        }
                }

                // Add role to claims
                java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                extraClaims.put("roles", java.util.List.of("ROLE_" + user.getRole().name()));

                if (user.getOrganizerProfile() != null) {
                        extraClaims.put("organizerStatus",
                                        user.getOrganizerProfile().getApprovalStatus().toString());
                }
                extraClaims.put("profileImage", user.getProfileImage());

                var jwtToken = jwtUtils.generateToken(extraClaims, user);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .build();
        }

        @Override
        public AuthResponse login(AuthRequest request) {
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));
                        var user = userRepository.findByEmail(request.getEmail())
                                        .orElseThrow();

                        // Add role to claims
                        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                        extraClaims.put("roles", java.util.List.of("ROLE_" + user.getRole().name()));

                        if (user.getOrganizerProfile() != null) {
                                extraClaims.put("organizerStatus",
                                                user.getOrganizerProfile().getApprovalStatus().toString());
                        }
                        extraClaims.put("profileImage", user.getProfileImage());

                        var jwtToken = jwtUtils.generateToken(extraClaims, user);
                        return AuthResponse.builder()
                                        .token(jwtToken)
                                        .name(user.getName())
                                        .email(user.getEmail())
                                        .role(user.getRole())
                                        .build();
                } catch (Exception e) {
                        System.err.println("Error in login: " + e.getMessage());
                        e.printStackTrace();
                        throw e;
                }
        }

        @Override
        public List<UserDTO> getAllUsers() {
                return userRepository.findAll().stream()
                                .map(DTOMapper::toUserDTO)
                                .collect(java.util.stream.Collectors.toList());
        }

        @Override
        public User getUserByEmail(String email) {
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        @Override
        public List<UserDTO> getPendingOrganizers() {
                return organizerProfileRepository.findByApprovalStatus(com.sems.entity.OrganizerStatus.PENDING).stream()
                                .map(profile -> DTOMapper.toUserDTO(profile.getUser()))
                                .collect(java.util.stream.Collectors.toList());
        }

        @Override
        public void approveOrganizer(Long organizerId) {
                User user = userRepository.findById(organizerId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getRole() != Role.ORGANIZER || user.getOrganizerProfile() == null) {
                        throw new RuntimeException("User is not an organizer");
                }

                user.getOrganizerProfile().setApprovalStatus(com.sems.entity.OrganizerStatus.APPROVED);
                userRepository.save(user);

                notificationService.createNotification(
                                user.getEmail(),
                                "Account Approved",
                                "Your organizer account has been approved. You can now create events.",
                                Notification.NotificationType.SUCCESS);

                try {
                        java.util.Map<String, Object> vars = new java.util.HashMap<>();
                        vars.put("organizerName", user.getName());
                        emailService.sendHtmlEmail(
                                        user.getEmail(),
                                        "Organizer Account Approved",
                                        "organizer-approved",
                                        vars);
                } catch (Exception e) {
                        System.err.println("Failed to send organizer approval email: " + e.getMessage());
                }
        }

        @Override
        public void rejectOrganizer(Long organizerId) {
                User user = userRepository.findById(organizerId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getRole() != Role.ORGANIZER || user.getOrganizerProfile() == null) {
                        throw new RuntimeException("User is not an organizer");
                }

                user.getOrganizerProfile().setApprovalStatus(com.sems.entity.OrganizerStatus.REJECTED);
                userRepository.save(user);

                notificationService.createNotification(
                                user.getEmail(),
                                "Account Rejected",
                                "Your organizer account application has been rejected.",
                                Notification.NotificationType.ERROR);
        }

        @Override
        public List<EventDTO> getApprovedEvents(String category, String location) {
                List<com.sems.entity.Event> events;
                if (category != null && !category.isBlank()) {
                        events = eventRepository.findByStatusAndCategory_NameContainingIgnoreCase(
                                        com.sems.entity.EventStatus.APPROVED, category);
                } else if (location != null && !location.isBlank()) {
                        events = eventRepository.findByStatusAndLocationContainingIgnoreCase(
                                        com.sems.entity.EventStatus.APPROVED, location);
                } else {
                        events = eventRepository.findByStatus(com.sems.entity.EventStatus.APPROVED);
                }

                return events.stream()
                                .map(DTOMapper::toEventDTO)
                                .collect(java.util.stream.Collectors.toList());
        }

        @Override
        public EventDTO getEventDetails(Long eventId) {
                com.sems.entity.Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new RuntimeException("Event not found"));
                return DTOMapper.toEventDTO(event);
        }

        @Override
        @org.springframework.transaction.annotation.Transactional
        public TicketDTO bookEvent(Long eventId, String userEmail) {
                throw new RuntimeException("This endpoint is deprecated. Please use the Booking API.");
        }

        @Override
        public List<TicketDTO> getMyBookings(String userEmail) {
                throw new RuntimeException("This endpoint is deprecated. Please use the Booking API.");
        }

        @Override
        @org.springframework.transaction.annotation.Transactional
        public void cancelBooking(Long bookingId, String userEmail) {
                throw new RuntimeException("This endpoint is deprecated. Please use the Booking API.");
        }

        @Override
        @org.springframework.transaction.annotation.Transactional
        public void checkIn(Long eventId, String ticketCode, String userEmail) {
                Booking booking = bookingRepository.findByTicketNumber(ticketCode)
                                .orElseThrow(() -> new RuntimeException("Invalid Ticket Code"));

                if (!booking.getEvent().getId().equals(eventId)) {
                        throw new RuntimeException("Ticket does not belong to this event");
                }

                if (attendanceRepository.existsByEventIdAndUserId(eventId, booking.getUser().getId())) {
                        throw new RuntimeException("Already Checked-In");
                }

                if (!booking.getUser().getEmail().equals(userEmail)) {
                        throw new RuntimeException("Unauthorized: Ticket belongs to another user");
                }

                com.sems.entity.Attendance attendance = com.sems.entity.Attendance.builder()
                                .event(booking.getEvent())
                                .user(booking.getUser())
                                .booking(booking)
                                .checkInTime(java.time.LocalDateTime.now())
                                .status(com.sems.entity.Attendance.Status.PRESENT)
                                .build();

                attendanceRepository.save(attendance);
        }

        @Override
        @org.springframework.transaction.annotation.Transactional
        public String updateProfileImage(String email, String imagePath) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found: " + email));
                user.setProfileImage(imagePath);
                userRepository.save(user);
                return imagePath;
        }

        @Override
        public UserDTO getUserProfile(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return DTOMapper.toUserDTO(user);
        }

        @Override
        @org.springframework.transaction.annotation.Transactional
        public UserDTO updateProfile(String email, UserDTO profileData) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setName(profileData.getName());
                user.setPhone(profileData.getPhone());
                user.setBio(profileData.getBio());

                if (user.getRole() == Role.ORGANIZER && user.getOrganizerProfile() != null) {
                        user.getOrganizerProfile().setOrganizationName(profileData.getOrganizationName());
                        user.getOrganizerProfile().setContactNumber(profileData.getPhone());
                }

                User savedUser = userRepository.save(user);
                return DTOMapper.toUserDTO(savedUser);
        }

}
