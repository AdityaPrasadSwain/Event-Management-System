package com.sems.controller;

import com.sems.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/organizer/dashboard")
@RequiredArgsConstructor
public class OrganizerDashboardController {

    private final DashboardService dashboardService;
    private final com.sems.repository.FeedbackRepository feedbackRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Principal principal) {
        String email = principal.getName();
        Map<String, Object> stats = dashboardService.getOrganizerStats(email);

        // Add Debug Info
        stats.put("debugEmail", email);
        stats.put("debugTicketCount", stats.get("totalBookings"));

        // Add Sentiment Stats
        long positive = feedbackRepository.countByEventOrganizerEmailAndSentiment(email, "POSITIVE");
        long neutral = feedbackRepository.countByEventOrganizerEmailAndSentiment(email, "NEUTRAL");
        long negative = feedbackRepository.countByEventOrganizerEmailAndSentiment(email, "NEGATIVE");

        // Handle case where no feedback exists for cleaner chart
        if (positive == 0 && neutral == 0 && negative == 0) {
            // Mock data if empty for demonstration
            positive = 5;
            neutral = 2;
            negative = 1;
        }

        java.util.List<Map<String, Object>> sentimentData = new java.util.ArrayList<>();
        sentimentData.add(Map.of("name", "Positive", "value", positive));
        sentimentData.add(Map.of("name", "Neutral", "value", neutral));
        sentimentData.add(Map.of("name", "Negative", "value", negative));

        stats.put("sentimentData", sentimentData); // Matched with frontend OrganizerAnalytics.jsx:26

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<java.util.List<com.sems.entity.Feedback>> getFeedbacks(Principal principal) {
        return ResponseEntity.ok(feedbackRepository.findByEventOrganizerEmail(principal.getName()));
    }
}
