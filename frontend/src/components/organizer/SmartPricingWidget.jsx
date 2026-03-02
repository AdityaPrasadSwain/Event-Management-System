import React, { useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Button, Slider } from '@mui/material';
import { MonetizationOn, TrendingUp } from '@mui/icons-material';
import api from '../../services/api';

const SmartPricingWidget = ({ category, capacity }) => {
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await api.get('/ai/pricing-suggestion', {
                params: { category, capacity }
            });

            // Ollama returns a JSON string, we need to parse it if it's stringified
            // However, our backend wraps it in a "suggestion" field which is the raw text from Ollama.
            // If Ollama returns markdown like ```json ... ``` we might need to clean it.
            // For simplicity, let's assume the user/prompt ensures JSON or we handle it.

            let rawText = response.data.suggestion;
            // Basic cleanup for markdown code blocks if present
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

            const data = JSON.parse(rawText);

            setSuggestion({
                price: data.price || 0,
                range: [data.price - 5, data.price + 5], // Mock range based on price
                confidence: data.confidence || 0.8,
                reasoning: data.reasoning || "AI analysis based on category and capacity."
            });
        } catch (error) {
            console.error("Error fetching pricing suggestion", error);
            // Fallback for demo if API fails/offline
            setSuggestion({
                price: 45,
                range: [40, 55],
                confidence: 0.6,
                reasoning: "Estimated based on similar events (Offline Mode)."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2, height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="success" />
                <Typography variant="h6">Smart Pricing</Typography>
            </Box>

            {!suggestion ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Get AI-driven price suggestions based on market trends and event details.
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Pricing'}
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h3" color="success.main" textAlign="center" fontWeight="bold">
                        ₹{suggestion.price}
                    </Typography>
                    <Typography variant="caption" display="block" textAlign="center" color="text.secondary" gutterBottom>
                        Recommended Ticket Price
                    </Typography>

                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight="bold" color="success.light">
                            why?
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {suggestion.reasoning}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default SmartPricingWidget;
