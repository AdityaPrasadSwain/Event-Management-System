package com.sems.service;

import com.sems.dto.BookingDTO;
import com.sems.dto.BookingRequest;
import java.util.List;

public interface BookingService {
    BookingDTO createBooking(BookingRequest request, String userEmail);

    List<BookingDTO> getUserBookings(String userEmail);

    List<BookingDTO> getOrganizerBookings(String organizerEmail);

    BookingDTO approveBooking(Long bookingId, String organizerEmail);

    BookingDTO rejectBooking(Long bookingId, String organizerEmail);

    void cancelBooking(Long bookingId, String userEmail);
}
