package com.sems.service;

import com.sems.dto.EventRequest;
import com.sems.dto.EventResponse;

import java.util.List;

public interface EventService {
    EventResponse createEvent(EventRequest request);

    List<EventResponse> getAllEvents();

    List<EventResponse> getUpcomingEvents();

    EventResponse getEventById(Long id);

    void deleteEvent(Long id);
}
