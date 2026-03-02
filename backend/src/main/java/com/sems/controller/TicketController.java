package com.sems.controller;

import com.sems.entity.Ticket;
import com.sems.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ✅ SECURED: Only authenticated users can book tickets
    @PostMapping("/book/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Ticket> bookTicket(@PathVariable Long eventId) {
        return ResponseEntity.ok(ticketService.bookTicket(eventId));
    }

    // ✅ SECURED: Only authenticated users can view their own tickets
    @GetMapping("/my-tickets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Ticket>> getUserTickets() {
        return ResponseEntity.ok(ticketService.getUserTickets());
    }
}
