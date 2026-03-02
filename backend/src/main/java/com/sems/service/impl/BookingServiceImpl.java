package com.sems.service.impl;

import com.sems.dto.BookingDTO;
import com.sems.dto.BookingRequest;
import com.sems.entity.*;
import com.sems.repository.BookingRepository;
import com.sems.repository.AttendanceRepository;
import com.sems.repository.EventRepository;
import com.sems.repository.UserRepository;
import com.sems.service.BookingService;
import com.sems.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationService notificationService;
    private final com.sems.service.EmailService emailService;
    private final com.sems.repository.GlobalSettingRepository globalSettingRepository;
    private final com.sems.service.RevenueService revenueService;
    private final com.sems.service.QRCodeService qrCodeService;

    @Override
    @Transactional
    public BookingDTO createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use Pessimistic Lock to ensure seat availability in concurrent scenarios
        Event event = eventRepository.findByIdWithLock(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Validation 1: Event Status
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException("Event is not available for booking");
        }

        // Validation 2: Seat Availability
        if (event.getRemainingSeats() < request.getNumberOfPersons()) {
            throw new RuntimeException("Not enough seats available. Remaining: " + event.getRemainingSeats());
        }

        // Validation 3: Duplicate Booking Check (Only block if there's an active
        // booking)
        if (bookingRepository.existsActiveBooking(event.getId(), user.getId())) {
            throw new RuntimeException("You already have an active booking for this event. Check 'My Bookings'.");
        }

        // Delegate Financial Calculations to TaxCalculator
        com.sems.util.TaxCalculator.FinancialBreakdown breakdown = revenueService.getEventFinancialBreakdown(event,
                request.getNumberOfPersons());

        double ticketTotal = breakdown.baseTotal;
        double adminCommission = breakdown.adminCommission;
        double gstOnCommission = breakdown.gstOnCommission;
        double organizerEarning = breakdown.organizerEarning;
        double totalUserPayable = breakdown.finalTotal;

        double minimumAdvancePercent = event.getMinimumAdvancePercent() != null ? event.getMinimumAdvancePercent()
                : 100.0;
        double minAdvanceRequired = revenueService.round(totalUserPayable * (minimumAdvancePercent / 100.0));

        // Validation 4: Payment Amount
        double advancePaid = request.getAdvancePaid() != null ? request.getAdvancePaid() : 0.0;
        if (advancePaid < minAdvanceRequired) {
            throw new RuntimeException("Insufficient payment. Minimum required: " + minAdvanceRequired);
        }

        double remainingAmount = revenueService.round(totalUserPayable - advancePaid);
        double finalAmountPaid = advancePaid; // At booking time, what they paid

        // Determine Status
        PaymentStatus paymentStatus;
        if (advancePaid >= totalUserPayable) {
            paymentStatus = PaymentStatus.PAID;
        } else {
            paymentStatus = PaymentStatus.PARTIAL;
        }

        BookingStatus bookingStatus;
        if (event.isApprovalRequired()) {
            bookingStatus = BookingStatus.PENDING;
        } else {
            bookingStatus = BookingStatus.CONFIRMED;
        }

        String bookingReference = "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String ticketNumber = UUID.randomUUID().toString(); // Individual ticket ID

        // Create Booking
        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .ticketNumber(ticketNumber)
                .numberOfPersons(request.getNumberOfPersons())
                .baseTotal(ticketTotal)
                .adminCommission(adminCommission)
                .gstOnCommission(gstOnCommission)
                .organizerEarning(organizerEarning)
                .advancePaid(advancePaid)
                .remainingAmount(remainingAmount)
                .finalAmount(totalUserPayable)
                .finalAmountPaid(finalAmountPaid)
                .bookingStatus(bookingStatus)
                .paymentStatus(paymentStatus)
                .approvalRequired(event.isApprovalRequired())
                .expiryTime(java.time.LocalDateTime.now().plusMinutes(15)) // 15-minute expiry
                .event(event)
                .user(user)
                .build();

        // Generate Individual Tickets for Multi-Ticket support
        for (int i = 0; i < request.getNumberOfPersons(); i++) {
            String tNum = UUID.randomUUID().toString();
            Ticket ticket = Ticket.builder()
                    .ticketNumber(tNum)
                    .qrCode(qrCodeService.generateQRCode(tNum))
                    .entryStatus(EntryStatus.NOT_ENTERED)
                    .numberOfPersons(1)
                    .ticketTotal(ticketTotal / request.getNumberOfPersons())
                    .event(event)
                    .user(user)
                    .build();
            booking.addTicket(ticket);
        }

        // Initial save to get ID
        booking = bookingRepository.save(booking);

        // Generate QR code using the ticketNumber (UUID string)
        String qrCodeBase64 = qrCodeService.generateQRCode(booking.getTicketNumber());
        booking.setQrCode(qrCodeBase64);

        // Final save with QR code
        Booking savedBooking = bookingRepository.save(booking);

        // Update Event Seats
        // Reserve seats immediately for both PENDING (approval needed) and CONFIRMED
        event.setRemainingSeats(event.getRemainingSeats() - request.getNumberOfPersons());
        eventRepository.save(event);

        // Notifications
        if (bookingStatus == BookingStatus.PENDING) {
            notificationService.createNotification(user.getEmail(), "Booking Requested",
                    "Your booking for " + event.getTitle() + " is pending approval.",
                    Notification.NotificationType.INFO);

            if (event.getOrganizer() != null) {
                notificationService.createNotification(event.getOrganizer().getEmail(), "New Booking Request",
                        user.getName() + " requested " + request.getNumberOfPersons() + " seats for "
                                + event.getTitle(),
                        Notification.NotificationType.INFO);
            }
        } else {
            notificationService.createNotification(user.getEmail(), "Booking Confirmed",
                    "Your booking for " + event.getTitle() + " is confirmed!", Notification.NotificationType.SUCCESS);

            // Send HTML Emails
            try {
                // Booking Confirmation
                java.util.Map<String, Object> bookingVars = new java.util.HashMap<>();
                bookingVars.put("userName", user.getName());
                bookingVars.put("eventTitle", event.getTitle());
                bookingVars.put("eventDate", event.getStartDateTime().toString());
                bookingVars.put("seatCount", request.getNumberOfPersons());
                bookingVars.put("bookingId", savedBooking.getTicketNumber());

                emailService.sendHtmlEmail(user.getEmail(), "Booking Confirmed: " + event.getTitle(),
                        "booking-confirmed",
                        bookingVars);

                // Payment Receipt
                java.util.Map<String, Object> receiptVars = new java.util.HashMap<>();
                receiptVars.put("userName", user.getName());
                receiptVars.put("eventTitle", event.getTitle());
                receiptVars.put("amountPaid", advancePaid);
                receiptVars.put("paymentId", UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                receiptVars.put("paymentDate", java.time.LocalDateTime.now().toString());

                emailService.sendHtmlEmail(user.getEmail(), "Payment Receipt: " + event.getTitle(), "payment-receipt",
                        receiptVars);

            } catch (Exception e) {
                System.err.println("Failed to send booking emails: " + e.getMessage());
            }
        }

        return mapToDTO(savedBooking);
    }

    @Override
    public List<BookingDTO> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getOrganizerBookings(String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        return bookingRepository.findByEventOrganizerId(organizer.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingDTO approveBooking(Long bookingId, String organizerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify Organizer ownership
        if (!booking.getEvent().getOrganizer().getEmail().equals(organizerEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not pending");
        }

        booking.setBookingStatus(BookingStatus.CONFIRMED);
        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(booking.getUser().getEmail(), "Booking Approved",
                "Your booking for " + booking.getEvent().getTitle() + " has been approved.",
                Notification.NotificationType.SUCCESS);

        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public BookingDTO rejectBooking(Long bookingId, String organizerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getEvent().getOrganizer().getEmail().equals(organizerEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not pending");
        }

        booking.setBookingStatus(BookingStatus.REJECTED);
        Booking saved = bookingRepository.save(booking);

        // Release seats
        Event event = booking.getEvent();
        event.setRemainingSeats(event.getRemainingSeats() + booking.getNumberOfPersons());
        eventRepository.save(event);

        notificationService.createNotification(booking.getUser().getEmail(), "Booking Rejected",
                "Your booking for " + booking.getEvent().getTitle() + " has been rejected.",
                Notification.NotificationType.ERROR);

        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED
                || booking.getBookingStatus() == BookingStatus.REJECTED) {
            throw new RuntimeException("Booking already cancelled/rejected");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // Release seats
        Event event = booking.getEvent();
        event.setRemainingSeats(event.getRemainingSeats() + booking.getNumberOfPersons());
        eventRepository.save(event);

        notificationService.createNotification(booking.getUser().getEmail(), "Booking Cancelled",
                "You cancelled your booking for " + event.getTitle(), Notification.NotificationType.WARNING);
    }

    // Constructor handled by Lombok @RequiredArgsConstructor

    // ... (existing methods) ...

    private BookingDTO mapToDTO(Booking booking) {
        String attendanceStatus = attendanceRepository.findByBookingId(booking.getId())
                .map(a -> a.getStatus().name())
                .orElse(null);

        List<com.sems.dto.TicketDTO> ticketDTOs = booking.getTickets().stream()
                .map(t -> com.sems.dto.TicketDTO.builder()
                        .id(t.getId())
                        .ticketNumber(t.getTicketNumber())
                        .qrCode(t.getQrCode())
                        .entryStatus(t.getEntryStatus())
                        .entryTime(t.getEntryTime())
                        .ticketTotal(t.getTicketTotal())
                        .build())
                .collect(Collectors.toList());

        return BookingDTO.builder()
                .id(booking.getId())
                .ticketNumber(booking.getTicketNumber())
                .qrCode(booking.getQrCode())
                .numberOfPersons(booking.getNumberOfPersons())
                .ticketTotal(booking.getTicketTotal())
                .userFee(booking.getUserFee())
                .gstOnUserFee(booking.getGstOnUserFee())
                .adminCommission(booking.getAdminCommission())
                .gstOnCommission(booking.getGstOnCommission())
                .organizerEarning(booking.getOrganizerEarning())
                .advancePaid(booking.getAdvancePaid())
                .remainingAmount(booking.getRemainingAmount())
                .finalAmountPaid(booking.getFinalAmountPaid())
                .bookingStatus(booking.getBookingStatus())
                .paymentStatus(booking.getPaymentStatus())
                .createdAt(booking.getCreatedAt())
                .attendanceStatus(attendanceStatus)
                .eventId(booking.getEvent().getId())
                .eventTitle(booking.getEvent().getTitle())
                .eventStartDateTime(booking.getEvent().getStartDateTime())
                .eventLocation(booking.getEvent().getLocation())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .bookingReference(booking.getBookingReference())
                .tickets(ticketDTOs)
                .build();
    }
}
