package com.sems.controller;

import com.sems.entity.EntryStatus;
import com.sems.entity.Ticket;
import com.sems.repository.TicketRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/entry")
@RequiredArgsConstructor
public class EntryController {

    private final com.sems.repository.BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    @PostMapping("/scan")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> scanEntry(@RequestBody ScanRequest request) {
        String ticketIdentifier = request.getTicketIdentifier();
        if (ticketIdentifier == null || ticketIdentifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ticket identifier is missing"));
        }

        // Try to find in Bookings first
        return bookingRepository.findByTicketNumber(ticketIdentifier)
                .map(booking -> {
                    if (booking.getEntryStatus() == EntryStatus.ENTERED) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Already used"));
                    }
                    booking.setEntryStatus(EntryStatus.ENTERED);
                    booking.setEntryTime(LocalDateTime.now());
                    bookingRepository.save(booking);
                    return ResponseEntity.ok(Map.of(
                            "message", "Entry successful",
                            "eventTitle", booking.getEvent().getTitle(),
                            "userName", booking.getUser().getName(),
                            "entryTime", booking.getEntryTime()));
                })
                .orElseGet(() -> {
                    // Fallback to Ticket entity
                    return ticketRepository.findByTicketNumber(ticketIdentifier)
                            .map(ticket -> {
                                if (ticket.getEntryStatus() == EntryStatus.ENTERED) {
                                    return ResponseEntity.badRequest().body(Map.of("message", "Already used"));
                                }
                                ticket.setEntryStatus(EntryStatus.ENTERED);
                                ticket.setEntryTime(LocalDateTime.now());
                                ticketRepository.save(ticket);
                                return ResponseEntity.ok(Map.of(
                                        "message", "Entry successful",
                                        "eventTitle", ticket.getEvent().getTitle(),
                                        "userName", ticket.getUser().getName(),
                                        "entryTime", ticket.getEntryTime()));
                            })
                            .orElse(ResponseEntity.status(404).body(Map.of("message", "Ticket not found")));
                });
    }

    @Data
    public static class ScanRequest {
        private String ticketIdentifier;
    }
}
