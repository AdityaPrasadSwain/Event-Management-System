package com.sems.service;

import com.sems.dto.EventRequest;
import com.sems.dto.EventResponse;
import com.sems.dto.OrganizerDashboardDTO;
import com.sems.dto.OrganizerStatusDTO;
import com.sems.entity.Event;
import com.sems.entity.Ticket;

import java.util.List;

public interface OrganizerService {
    EventResponse createEvent(EventRequest request, String organizerEmail);

    EventResponse updateEvent(Long eventId, EventRequest request, String organizerEmail);

    void cancelEvent(Long eventId, String cancelReason, String organizerEmail);

    List<EventResponse> getMyEvents(String organizerEmail);

    List<Ticket> getEventAttendees(Long eventId, String organizerEmail);

    OrganizerDashboardDTO getDashboardStats(String email);

    OrganizerStatusDTO getOrganizerStatus(String email);

    List<com.sems.entity.Feedback> getFeedbacks(String email);

    List<com.sems.entity.Category> getAllCategories();

    com.sems.dto.OrganizerAnalyticsDTO getAnalytics(String email);

    List<String> uploadEventImages(Long eventId, List<String> imageUrls, String email);

    String updateUserProfilePhoto(String photoPath, String email);
}
