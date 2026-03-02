package com.sems.service;

import com.sems.entity.Event;

import java.util.List;
import java.util.Map;

public interface AiService {
    String generateEventDescription(String idea);

    List<Event> searchEvents(String query);

    String chat(String message, String userEmail);

    Map<String, Object> analyzeFeedback(Long eventId);

    Map<String, Object> detectSpam(Long eventId);
}
