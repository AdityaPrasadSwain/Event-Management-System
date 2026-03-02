package com.sems.controller;

import com.sems.dto.BookingDTO;
import com.sems.dto.BookingRequest;
import com.sems.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // USER Endpoints
    @PostMapping("/bookings/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingDTO> createBooking(@jakarta.validation.Valid @RequestBody BookingRequest request,
            Principal principal) {
        return ResponseEntity.ok(bookingService.createBooking(request, principal.getName()));
    }

    @GetMapping("/user/bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BookingDTO>> getUserBookings(Principal principal) {
        return ResponseEntity.ok(bookingService.getUserBookings(principal.getName()));
    }

    @DeleteMapping("/bookings/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id, Principal principal) {
        bookingService.cancelBooking(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // ORGANIZER Endpoints
    @GetMapping("/organizer/bookings")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<BookingDTO>> getOrganizerBookings(Principal principal) {
        return ResponseEntity.ok(bookingService.getOrganizerBookings(principal.getName()));
    }

    @PutMapping("/bookings/{id}/approve")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<BookingDTO> approveBooking(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(bookingService.approveBooking(id, principal.getName()));
    }

    @PutMapping("/bookings/{id}/reject")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<BookingDTO> rejectBooking(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, principal.getName()));
    }
}
