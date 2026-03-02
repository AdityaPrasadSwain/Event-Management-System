package com.sems.service;

import com.sems.dto.*;
import com.sems.entity.Event;
import com.sems.entity.User;

import java.util.List;

public interface UserService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(AuthRequest request);

    List<UserDTO> getAllUsers();

    List<UserDTO> getPendingOrganizers();

    void approveOrganizer(Long organizerId);

    void rejectOrganizer(Long organizerId);

    com.sems.entity.User getUserByEmail(String email);

    // User Module Methods
    List<EventDTO> getApprovedEvents(String category, String location);

    EventDTO getEventDetails(Long eventId);

    TicketDTO bookEvent(Long eventId, String userEmail);

    List<TicketDTO> getMyBookings(String userEmail);

    void cancelBooking(Long bookingId, String userEmail);

    void checkIn(Long eventId, String ticketCode, String userEmail);

    String updateProfileImage(String email, String imagePath);

    UserDTO getUserProfile(String email);

    UserDTO updateProfile(String email, UserDTO profileData);

}
