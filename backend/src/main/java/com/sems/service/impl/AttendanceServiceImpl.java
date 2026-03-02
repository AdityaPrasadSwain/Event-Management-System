package com.sems.service.impl;

import com.sems.dto.AttendanceDTO;
import com.sems.dto.AttendanceRequest;
import com.sems.dto.AttendanceRequest;
import com.sems.entity.Attendance; // Explicit import for clarity
import com.sems.entity.Booking; // Explicit import to fix resolution error
import com.sems.entity.Event;
import com.sems.entity.User;
import com.sems.entity.BookingStatus;
import com.sems.entity.Notification;
import com.sems.repository.AttendanceRepository;
import com.sems.repository.BookingRepository;
import com.sems.repository.EventRepository;
import com.sems.repository.UserRepository;
import com.sems.service.AttendanceService;
import com.sems.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public AttendanceDTO markAttendance(AttendanceRequest request, String organizerEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Event event = booking.getEvent();

        // 1. Verify Organizer
        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new RuntimeException("Unauthorized: Only event organizer can mark attendance.");
        }

        // 2. Verify Booking Status
        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Cannot mark attendance for unconfirmed booking.");
        }

        // 3. Check for existing record
        Optional<Attendance> existing = attendanceRepository.findByBookingId(booking.getId());
        Attendance attendance;

        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(request.getStatus());
            attendance.setCheckInTime(LocalDateTime.now());
        } else {
            attendance = Attendance.builder()
                    .event(event)
                    .user(booking.getUser())
                    .booking(booking)
                    .status(request.getStatus())
                    .checkInTime(LocalDateTime.now())
                    .build();
        }

        Attendance saved = attendanceRepository.save(attendance);

        if (request.getStatus() == Attendance.Status.PRESENT) {
            notificationService.createNotification(attendance.getUser().getEmail(), "Attendance Marked",
                    "You have been marked PRESENT for " + event.getTitle(), Notification.NotificationType.SUCCESS);
        }

        return mapToDTO(saved);
    }

    @Override
    public List<AttendanceDTO> getEventAttendance(Long eventId, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        return attendanceRepository.findByEventId(eventId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getUserAttendance(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AttendanceDTO mapToDTO(Attendance attendance) {
        return AttendanceDTO.builder()
                .id(attendance.getId())
                .eventId(attendance.getEvent().getId())
                .eventTitle(attendance.getEvent().getTitle())
                .userId(attendance.getUser().getId())
                .userName(attendance.getUser().getName())
                .userEmail(attendance.getUser().getEmail())
                .bookingId(attendance.getBooking().getId())
                .ticketNumber(attendance.getBooking().getTicketNumber())
                .status(attendance.getStatus())
                .checkInTime(attendance.getCheckInTime())
                .build();
    }
}
