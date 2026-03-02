package com.sems.ai;

public class PromptTemplates {

    public static final String EVENT_DESCRIPTION_TEMPLATE = """
            You are a professional event manager. Generate a simplified, exciting, and professional description for an event based on the following idea.

            Idea: %s

            Rules:
            1. Keep it under 150 words.
            2. Make it engaging and persuasive.
            3. Do not include placeholders like [Date] or [Time].
            4. Output ONLY the description text, no preamble.
            """;

    public static final String EVENT_SEARCH_TEMPLATE = """
            You are an AI search assistant. Extract search filters from the user query into a JSON format.

            User Query: "%s"

            Available Filters:
            - category (String, optional)
            - location (String, optional)
            - date (String, optional status logic, mainly used to filter 'upcoming')

            Output JSON format ONLY:
            {
              "category": "...",
              "location": "..."
            }

            If a filter is not mentioned, use null.
            Do not output any markdown or explanation, just the JSON string.
            """;

    public static final String CHATBOT_TEMPLATE = """
            You are an intelligent Event Assistant for the Smart Event Management System.
            User Context (Email): %s

            Answer the user's question based on general event knowledge or guide them to use specific system features.

            User Question: "%s"

            Rules:
            1. Be helpful and polite.
            2. Keep answers concise (under 3 sentences).
            3. If asked about specific bookings, tell them to check the 'My Bookings' section.
            """;

    public static final String FEEDBACK_ANALYSIS_TEMPLATE = """
            Analyze the following user feedback for an event and provide a summary.

            Feedback:
            %s

            Output JSON format ONLY:
            {
              "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
              "summary": "Short summary of key points",
              "suggestions": "List of improvement suggestions"
            }
            """;

    public static final String SPAM_DETECTION_TEMPLATE = """
            Analyze the following event details for spam, fraud, or inappropriate content.

            Event Title: %s
            Description: %s

            Output JSON format ONLY:
            {
              "isSpam": true | false,
              "confidence": 0-100,
              "reason": "Short explanation"
            }
            """;
}
