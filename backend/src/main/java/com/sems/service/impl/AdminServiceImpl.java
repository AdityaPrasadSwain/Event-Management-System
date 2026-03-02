package com.sems.service.impl;

import com.sems.dto.AdminDashboardDTO;
import com.sems.entity.Event;
import com.sems.entity.EventStatus;
import com.sems.entity.Role;
import com.sems.entity.User;
import com.sems.repository.EventRepository;
import com.sems.repository.UserRepository;
import com.sems.service.AdminService;
import com.sems.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

        private final UserRepository userRepository;
        private final EventRepository eventRepository;
        private final com.sems.service.NotificationService notificationService;
        private final com.sems.service.EmailService emailService;

        @Override
        public List<User> getAllUsers() {
                return userRepository.findAll();
        }

        @Override
        @Transactional
        public void blockUser(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
                user.setEnabled(false);
                userRepository.save(user);
        }

        @Override
        @Transactional
        public void unblockUser(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
                user.setEnabled(true);
                userRepository.save(user);
        }

        @Override
        @Transactional
        public void changeUserRole(Long id, Role role) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
                user.setRole(role);
                userRepository.save(user);
        }

        @Override
        @Transactional(readOnly = true)
        public List<com.sems.dto.AdminEventDto> getPendingEvents() {
                return eventRepository.findByStatusWithDetails(EventStatus.PENDING).stream()
                                .map(com.sems.util.DTOMapper::toAdminEventDto)
                                .collect(java.util.stream.Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public List<com.sems.dto.AdminEventDto> getAllEvents() {
                return eventRepository.findAllWithDetails().stream()
                                .map(com.sems.util.DTOMapper::toAdminEventDto)
                                .collect(java.util.stream.Collectors.toList());
        }

        @Override
        @Transactional
        @org.springframework.cache.annotation.Caching(evict = {
                        @org.springframework.cache.annotation.CacheEvict(value = "adminDashboard", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "organizerDashboard", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "events", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "upcomingEvents", allEntries = true)
        })
        public void approveEvent(Long id) {
                Event event = eventRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
                event.setStatus(EventStatus.APPROVED);
                eventRepository.save(event);

                // Notify Organizer (In-app)
                if (event.getOrganizer() != null) {
                        String email = event.getOrganizer().getEmail();
                        notificationService.createNotification(
                                        email,
                                        "Event Approved",
                                        "Your event '" + event.getTitle() + "' has been approved and is now LIVE.",
                                        Notification.NotificationType.SUCCESS);

                        // Send Email
                        try {
                                java.util.Map<String, Object> vars = new java.util.HashMap<>();
                                vars.put("organizerName", event.getOrganizer().getName());
                                vars.put("eventTitle", event.getTitle());
                                vars.put("eventDate", event.getStartDateTime().toString());
                                vars.put("eventLocation", event.getLocation());
                                vars.put("eventLink", "http://localhost:5181/events/" + event.getId()); // Adjust URL as
                                                                                                        // needed

                                emailService.sendHtmlEmail(
                                                event.getOrganizer().getEmail(),
                                                "Event Approved: " + event.getTitle(),
                                                "event-approved",
                                                vars);
                        } catch (Exception e) {
                                // Log or handle email failure silently to avoid blocking transaction
                                System.err.println("Failed to send approval email: " + e.getMessage());
                        }
                }
        }

        @Override
        @Transactional
        @org.springframework.cache.annotation.Caching(evict = {
                        @org.springframework.cache.annotation.CacheEvict(value = "adminDashboard", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "organizerDashboard", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "events", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "upcomingEvents", allEntries = true)
        })
        public void rejectEvent(Long id, String reason) {
                Event event = eventRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
                event.setStatus(EventStatus.REJECTED);
                event.setRejectionReason(reason);
                eventRepository.save(event);

                // Notify Organizer (In-app)
                if (event.getOrganizer() != null) {
                        String email = event.getOrganizer().getEmail();
                        notificationService.createNotification(
                                        email,
                                        "Event Rejected",
                                        "Your event '" + event.getTitle() + "' has been rejected. Reason: " + reason,
                                        Notification.NotificationType.ERROR);

                        // Send Email
                        try {
                                java.util.Map<String, Object> vars = new java.util.HashMap<>();
                                vars.put("organizerName", event.getOrganizer().getName());
                                vars.put("eventTitle", event.getTitle());
                                vars.put("rejectionReason", reason);

                                emailService.sendHtmlEmail(
                                                event.getOrganizer().getEmail(),
                                                "Event Not Approved: " + event.getTitle(),
                                                "event-rejected",
                                                vars);
                        } catch (Exception e) {
                                System.err.println("Failed to send rejection email: " + e.getMessage());
                        }
                }
        }

        @Override
        @Transactional
        @org.springframework.cache.annotation.Caching(evict = {
                        @org.springframework.cache.annotation.CacheEvict(value = "adminDashboard", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "organizerDashboard", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "events", allEntries = true),
                        @org.springframework.cache.annotation.CacheEvict(value = "upcomingEvents", allEntries = true)
        })
        public void cancelEvent(Long id) {
                Event event = eventRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
                event.setStatus(EventStatus.CANCELLED);
                eventRepository.save(event);

                // Notify Organizer
                if (event.getOrganizer() != null) {
                        String email = event.getOrganizer().getEmail();
                        notificationService.createNotification(
                                        email,
                                        "Event Cancelled",
                                        "Your event '" + event.getTitle() + "' has been cancelled by Admin.",
                                        Notification.NotificationType.WARNING);
                }
        }

        private final com.sems.repository.OrganizerProfileRepository organizerProfileRepository;

        @Override
        public List<com.sems.dto.PendingOrganizerDto> getPendingOrganizers() {
                return organizerProfileRepository.findByApprovalStatus(com.sems.entity.OrganizerStatus.PENDING)
                                .stream()
                                .map(com.sems.util.DTOMapper::toPendingOrganizerDto)
                                .toList();
        }

        @Override
        public List<User> getApprovedOrganizers() {
                return organizerProfileRepository.findByApprovalStatus(com.sems.entity.OrganizerStatus.APPROVED)
                                .stream()
                                .map(com.sems.entity.OrganizerProfile::getUser)
                                .toList();
        }

        @Override
        @Transactional
        public void approveOrganizer(Long id) {
                // Here 'id' is currently passed as User ID from frontend usually.
                // We need to find the profile by User ID or change frontend to pass Profile ID.
                // Keeping it as User ID requires finding profile by User ID.

                // Let's check how 'getPendingOrganizers' returns data. It returns Users.
                // The frontend displays User.id. So 'id' here is User ID.

                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

                com.sems.entity.OrganizerProfile profile = user.getOrganizerProfile();
                if (profile == null) {
                        throw new RuntimeException("Organizer profile not found for user: " + id);
                }

                profile.setApprovalStatus(com.sems.entity.OrganizerStatus.APPROVED);
                // No need to explicit save if linked correctly and transactional, but good for
                // clarity
                // userRepository.save(user) cascades, or
                // organizerProfileRepository.save(profile);
                userRepository.save(user);

                String email = user.getEmail();
                notificationService.createNotification(
                                email,
                                "Account Approved",
                                "Your organizer account has been approved! You can now create events.",
                                Notification.NotificationType.SUCCESS);
        }

        @Override
        @Transactional
        public void rejectOrganizer(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

                com.sems.entity.OrganizerProfile profile = user.getOrganizerProfile();
                if (profile == null) {
                        throw new RuntimeException("Organizer profile not found for user: " + id);
                }

                profile.setApprovalStatus(com.sems.entity.OrganizerStatus.REJECTED);
                userRepository.save(user);

                String email = user.getEmail();
                notificationService.createNotification(
                                email,
                                "Account Rejected",
                                "Your organizer account application has been rejected.",
                                Notification.NotificationType.ERROR);
        }

        @Override
        @Cacheable("adminDashboard")
        public AdminDashboardDTO getDashboardStats() {
                long totalUsers = userRepository.count();
                long totalOrganizers = userRepository.findAll().stream()
                                .filter(u -> u.getRole() == Role.ORGANIZER)
                                .count();
                long totalEvents = eventRepository.count();
                long pendingEvents = eventRepository.findAll().stream()
                                .filter(e -> e.getStatus() == EventStatus.PENDING)
                                .count();
                // Assuming active events are APPROVED, UPCOMING, LIVE
                long activeEvents = eventRepository.findAll().stream()
                                .filter(e -> e.getStatus() == EventStatus.APPROVED ||
                                                e.getStatus() == EventStatus.UPCOMING ||
                                                e.getStatus() == EventStatus.LIVE)
                                .count();
                long cancelledEvents = eventRepository.findAll().stream()
                                .filter(e -> e.getStatus() == EventStatus.CANCELLED)
                                .count();

                return AdminDashboardDTO.builder()
                                .totalUsers(totalUsers)
                                .totalOrganizers(totalOrganizers)
                                .totalEvents(totalEvents)
                                .pendingEvents(pendingEvents)
                                .activeEvents(activeEvents)
                                .cancelledEvents(cancelledEvents)
                                .build();
        }
}
