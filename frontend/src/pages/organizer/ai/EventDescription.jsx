import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Grid,
} from '@mui/material';
import {
    AutoAwesome as AIIcon,
    ContentCopy as CopyIcon,
} from '@mui/icons-material';

const EventDescription = () => {
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedDescription, setGeneratedDescription] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        // TODO: Integrate with Ollama AI
        setTimeout(() => {
            setGeneratedDescription(
                `Join us for ${eventName}, an exciting ${eventType} that brings together enthusiasts and professionals. This event promises to be an unforgettable experience with engaging sessions, networking opportunities, and industry insights.`
            );
            setLoading(false);
        }, 2000);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    AI Event Description Generator
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Generate compelling event descriptions using AI
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Event Details
                        </Typography>
                        <TextField
                            fullWidth
                            label="Event Name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Event Type"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            placeholder="e.g., Workshop, Conference, Concert"
                            sx={{ mb: 3 }}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AIIcon />}
                            onClick={handleGenerate}
                            disabled={!eventName || !eventType || loading}
                        >
                            {loading ? 'Generating...' : 'Generate Description'}
                        </Button>
                    </Paper>

                    <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                        <CardContent>
                            <Typography variant="body2" color="white">
                                <strong>Note:</strong> AI integration with Ollama coming soon!
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, minHeight: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                                Generated Description
                            </Typography>
                            {generatedDescription && (
                                <Button size="small" startIcon={<CopyIcon />}>
                                    Copy
                                </Button>
                            )}
                        </Box>
                        {generatedDescription ? (
                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                {generatedDescription}
                            </Typography>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <AIIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Your AI-generated description will appear here
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EventDescription;
