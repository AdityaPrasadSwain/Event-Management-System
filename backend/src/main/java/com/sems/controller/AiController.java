package com.sems.controller;

import com.sems.service.OllamaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final OllamaService ollamaService;

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String category = payload.get("category");
        String keywords = payload.get("keywords");

        String description = ollamaService.generateEventDescription(title, category, keywords);
        return ResponseEntity.ok(Map.of("description", description));
    }

    @PostMapping("/analyze-sentiment")
    public ResponseEntity<Map<String, String>> analyzeSentiment(@RequestBody Map<String, String> payload) {
        String review = payload.get("review");
        String analysis = ollamaService.analyzeSentiment(review);
        return ResponseEntity.ok(Map.of("analysis", analysis));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String response = ollamaService.generateChatResponse(message);
        return ResponseEntity.ok(Map.of("response", response));
    }

    @GetMapping("/pricing-suggestion")
    public ResponseEntity<Map<String, String>> getPricingSuggestion(
            @RequestParam String category,
            @RequestParam Integer capacity) {
        String suggestion = ollamaService.getPricingSuggestion(category, capacity);
        return ResponseEntity.ok(Map.of("suggestion", suggestion));
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarizeEvent(@RequestBody Map<String, String> payload) {
        String description = payload.get("description");
        String summaryJson = ollamaService.generateEventSummary(description);
        return ResponseEntity.ok(Map.of("summary", summaryJson));
    }

    @PostMapping("/analytics-insights")
    public ResponseEntity<Map<String, String>> getAnalyticsInsights(@RequestBody Map<String, Object> stats) {
        String insights = ollamaService.generateAnalyticsInsights(stats);
        return ResponseEntity.ok(Map.of("insights", insights));
    }

    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok(ollamaService.generateText("Hello! Are you working?"));
    }
}
