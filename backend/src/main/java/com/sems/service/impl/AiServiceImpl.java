package com.sems.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sems.ai.OllamaClient;
import com.sems.ai.PromptTemplates;
import com.sems.entity.Event;
import com.sems.entity.EventStatus;
import com.sems.entity.Feedback;
import com.sems.repository.EventRepository;
import com.sems.repository.FeedbackRepository;
import com.sems.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    private final OllamaClient ollamaClient;
    private final EventRepository eventRepository;
    private final FeedbackRepository feedbackRepository;
    private final ObjectMapper objectMapper;

    @Override
    public String generateEventDescription(String idea) {
        String prompt = String.format(PromptTemplates.EVENT_DESCRIPTION_TEMPLATE, idea);
        return ollamaClient.generate(prompt).trim();
    }

    @Override
    public List<Event> searchEvents(String query) {
        // 1. Extract filters from NL using AI
        String prompt = String.format(PromptTemplates.EVENT_SEARCH_TEMPLATE, query);
        String jsonResponse = ollamaClient.generate(prompt);

        try {
            JsonNode filters = objectMapper.readTree(extractJson(jsonResponse));
            String category = filters.has("category") && !filters.get("category").isNull()
                    ? filters.get("category").asText()
                    : null;
            String location = filters.has("location") && !filters.get("location").isNull()
                    ? filters.get("location").asText()
                    : null;
            // Date logic omitted for brevity as it requires complex parsing, just using
            // cat/loc

            // 2. Query Database
            if (category != null) {
                return eventRepository.findByStatusAndCategory_NameContainingIgnoreCase(EventStatus.APPROVED, category);
            } else if (location != null) {
                return eventRepository.findByStatusAndLocationContainingIgnoreCase(EventStatus.APPROVED, location);
            } else {
                return eventRepository.findByStatus(EventStatus.APPROVED);
            }
        } catch (Exception e) {
            log.error("AI Search Failed", e);
            // Fallback: simple text search or return all
            return eventRepository.findByStatus(EventStatus.APPROVED);
        }
    }

    @Override
    public String chat(String message, String userEmail) {
        // 1. Build Context
        // Ideally fetch recent bookings or check if user has upcoming events
        // specific context fetching logic can be added here.
        // For now, passing userEmail as identity context.

        String prompt = String.format(PromptTemplates.CHATBOT_TEMPLATE, userEmail, message);
        return ollamaClient.generate(prompt).trim();
    }

    @Override
    public Map<String, Object> analyzeFeedback(Long eventId) {
        List<Feedback> feedbacks = feedbackRepository.findByEventId(eventId);
        if (feedbacks.isEmpty()) {
            return Map.of("summary", "No feedback available yet.");
        }

        String combinedFeedback = feedbacks.stream()
                .map(f -> "- " + f.getComment() + " (Rating: " + f.getRating() + ")")
                .collect(Collectors.joining("\n"));

        String prompt = String.format(PromptTemplates.FEEDBACK_ANALYSIS_TEMPLATE, combinedFeedback);
        String jsonResponse = ollamaClient.generate(prompt);

        try {
            return objectMapper.readValue(extractJson(jsonResponse), Map.class);
        } catch (Exception e) {
            log.error("Feedback Analysis Failed", e);
            return Map.of("error", "Failed to analyze feedback");
        }
    }

    @Override
    public Map<String, Object> detectSpam(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String prompt = String.format(PromptTemplates.SPAM_DETECTION_TEMPLATE, event.getTitle(),
                event.getDescription());
        String jsonResponse = ollamaClient.generate(prompt);

        try {
            return objectMapper.readValue(extractJson(jsonResponse), Map.class);
        } catch (Exception e) {
            log.error("Spam Detection Failed", e);
            return Map.of("error", "Failed to detect spam");
        }
    }

    // Helper to clean markdown code blocks from AI response
    private String extractJson(String response) {
        response = response.trim();
        if (response.startsWith("```json")) {
            response = response.substring(7);
        } else if (response.startsWith("```")) {
            response = response.substring(3);
        }
        if (response.endsWith("```")) {
            response = response.substring(0, response.length() - 3);
        }
        return response.trim();
    }
}
