package com.sems.service;

import com.sems.dto.ai.OllamaRequest;
import com.sems.dto.ai.OllamaResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
@Slf4j
public class OllamaService {

    private final RestClient ollamaRestClient;
    private static final String DEFAULT_MODEL = "llama3"; // llama3 is better for JSON

    private String generate(String systemPrompt, String userPrompt) {
        try {
            OllamaRequest request = OllamaRequest.builder()
                    .model(DEFAULT_MODEL)
                    .system(systemPrompt)
                    .prompt(userPrompt)
                    .stream(false)
                    .build();

            OllamaResponse response = ollamaRestClient.post()
                    .uri("/api/generate")
                    .body(request)
                    .retrieve()
                    .body(OllamaResponse.class);

            return response != null ? response.getResponse() : "";
        } catch (Exception e) {
            log.error("Ollama Error: {}", e.getMessage());
            return "AI Service Unavailable";
        }
    }

    // --- UTILITIES ---
    private String cleanJson(String raw) {
        if (raw == null)
            return "{}";
        // Remove markdown code blocks
        String cleaned = raw.replaceAll("```json", "").replaceAll("```", "").trim();
        // If the cleanup left only whitespace (or was empty), return empty object
        if (cleaned.isEmpty())
            return "{}";
        return cleaned;
    }

    // --- FEATURES ---

    public String generateEventDescription(String title, String category, String keywords) {
        String system = "You are an expert event marketer. Write a compelling description (approx 150 words) using Markdown. "
                +
                "Structure: Hook, What to Expect, Who Should Attend. No preambles.";
        String prompt = String.format("Title: %s\nCategory: %s\nKeywords: %s", title, category, keywords);
        return generate(system, prompt);
    }

    public String analyzeSentiment(String reviewText) {
        String system = "Analyze the sentiment. Return JSON: { \"sentiment\": \"POSITIVE\"|\"NEUTRAL\"|\"NEGATIVE\", \"confidence\": 0.0-1.0, \"key_issues\": [], \"key_praises\": [] }. Return ONLY JSON.";
        String prompt = String.format("Review: \"%s\"", reviewText);
        return cleanJson(generate(system, prompt));
    }

    public String getPricingSuggestion(String category, Integer capacity) {
        String system = "You are a pricing analyst. Suggest an optimal ticket price. Return JSON: { \"price\": number, \"confidence\": 0.0-1.0, \"reasoning\": \"string\" }. Return ONLY JSON.";
        String prompt = String.format("Category: %s\nCapacity: %d", category, capacity);
        return cleanJson(generate(system, prompt));
    }

    public String generateChatResponse(String userMessage) {
        // In a real app, we'd inject context/RAG here.
        String system = "You are 'EventMind', a helpful AI assistant for the Event Management System. " +
                "Answer questions about event planning or finding events. Be concise and friendly.";
        return generate(system, userMessage);
    }

    // For User Recommendations
    public String getRecommendations(String userProfileJson) {
        String system = "You are a recommendation engine. context: [Event 1: Tech Talk, Event 2: Jazz Night]. " +
                "Return JSON list of IDs based on user profile. Format: [ { \"eventId\": ID, \"reason\": \"...\" } ]. Return ONLY JSON.";
        return cleanJson(generate(system, userProfileJson));
    }

    public String generateEventSummary(String description) {
        String system = "Summarize the event content. Return valid JSON: { \"summary\": \"overview\", \"highlights\": [\"b1\", \"b2\"], \"attendIf\": \"reason\" }. Return ONLY JSON.";
        return cleanJson(generate(system, description));
    }

    public String generateAnalyticsInsights(java.util.Map<String, Object> stats) {
        String system = "You are a data analyst. Interpret event statistics. Provide 3 short, actionable insights in bullet points. Focus on sales velocity and conversion.";
        String prompt = "Stats: " + stats.toString();
        return generate(system, prompt);
    }

    // Keep the old generic method for backward compatibility if needed, but mapped
    // to new structure
    public String generateText(String prompt) {
        return generate("You are a helpful assistant.", prompt);
    }
}
