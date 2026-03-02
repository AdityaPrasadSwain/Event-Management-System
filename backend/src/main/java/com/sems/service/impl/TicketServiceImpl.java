package com.sems.service.impl;

import com.sems.entity.Event;
import com.sems.entity.Ticket;
import com.sems.entity.User;
import com.sems.repository.EventRepository;
import com.sems.repository.TicketRepository;
import com.sems.repository.UserRepository;
import com.sems.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final com.sems.service.QRCodeService qrCodeService;

    @Override
    @Transactional
    public Ticket bookTicket(Long eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getRemainingSeats() <= 0) {
            throw new RuntimeException("Event is sold out");
        }

        if (event.getStatus() != com.sems.entity.EventStatus.UPCOMING
                && event.getStatus() != com.sems.entity.EventStatus.LIVE) {
            throw new RuntimeException("Event is not open for booking");
        }

        if (ticketRepository.existsByEventIdAndUserId(eventId, user.getId())) {
            throw new RuntimeException("User already booked this event");
        }

        // Decrement seats
        event.setRemainingSeats(event.getRemainingSeats() - 1);
        eventRepository.save(event);

        String ticketNumber = UUID.randomUUID().toString();
        String qrCodeBase64 = qrCodeService.generateQRCode(ticketNumber);

        Ticket ticket = Ticket.builder()
                .user(user)
                .event(event)
                .ticketNumber(ticketNumber)
                .qrCode(qrCodeBase64)
                .entryStatus(com.sems.entity.EntryStatus.NOT_ENTERED)
                .numberOfPersons(1)
                .ticketTotal(event.getPricePerPerson() != null ? event.getPricePerPerson() : 0.0)
                .bookingDate(LocalDateTime.now())
                .checkIn(false)
                .build();

        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getUserTickets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findTicketsWithUserAndEvent(user.getId());
    }
}
