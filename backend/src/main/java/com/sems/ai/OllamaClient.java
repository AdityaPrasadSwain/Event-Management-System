package com.sems.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
@Slf4j
public class OllamaClient {

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String MODEL = "llama3";
    private final HttpClient httpClient;

    public OllamaClient() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String generate(String prompt) {
        try {
            // Escape quotes and newlines in prompt to avoid JSON errors
            String escapedPrompt = prompt.replace("\"", "\\\"").replace("\n", "\\n");

            String requestBody = String.format(
                    "{\"model\": \"%s\", \"prompt\": \"%s\", \"stream\": false}",
                    MODEL, escapedPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OLLAMA_URL))
                    .timeout(Duration.ofMinutes(2)) // LLMs can take time
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Ollama Error: " + response.body());
                throw new RuntimeException("Failed to generate response from Ollama: " + response.statusCode());
            }

            // Simple parsing to avoid extra dependencies for now, or assume Jackson is
            // available
            // standard Ollama response: {"model":..., "response":"ACTUAL TEXT",
            // "done":true...}
            String body = response.body();
            int responseIndex = body.indexOf("\"response\":\"");
            if (responseIndex == -1) {
                throw new RuntimeException("Invalid response format from Ollama");
            }

            // Extract content after "response":"
            String content = body.substring(responseIndex + 12);
            // Find the closing quote, keeping in mind escaped quotes might exist
            // (simplified for now)
            // A more robust way is finding the next ","done": field usually follows.
            int doneIndex = content.indexOf("\",\"done\""); // heuristic check
            if (doneIndex != -1) {
                content = content.substring(0, doneIndex);
            }

            // Unescape JSON string
            return content.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\");

        } catch (Exception e) {
            log.error("Ollama Exception", e);
            throw new RuntimeException("AI processing failed: " + e.getMessage());
        }
    }
}
