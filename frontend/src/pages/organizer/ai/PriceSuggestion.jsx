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
    Grid,
    Slider,
} from '@mui/material';
import {
    LocalOffer as PriceIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const PriceSuggestion = () => {
    const [eventType, setEventType] = useState('');
    const [duration, setDuration] = useState(2);
    const [capacity, setCapacity] = useState(100);
    const [loading, setLoading] = useState(false);
    const [suggestedPrice, setSuggestedPrice] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        // TODO: Integrate with Ollama AI
        setTimeout(() => {
            const basePrice = duration * 500 + (capacity / 10);
            setSuggestedPrice({
                min: Math.round(basePrice * 0.8),
                recommended: Math.round(basePrice),
                max: Math.round(basePrice * 1.2),
            });
            setLoading(false);
        }, 2000);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    AI Price Suggestion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Get optimal ticket pricing recommendations based on market data
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Event Parameters
                        </Typography>
                        <TextField
                            fullWidth
                            label="Event Type"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            placeholder="e.g., Workshop, Conference"
                            sx={{ mb: 3 }}
                        />
                        <Typography gutterBottom>
                            Duration: {duration} hours
                        </Typography>
                        <Slider
                            value={duration}
                            onChange={(e, newValue) => setDuration(newValue)}
                            min={1}
                            max={24}
                            marks
                            sx={{ mb: 3 }}
                        />
                        <Typography gutterBottom>
                            Capacity: {capacity} attendees
                        </Typography>
                        <Slider
                            value={capacity}
                            onChange={(e, newValue) => setCapacity(newValue)}
                            min={10}
                            max={1000}
                            step={10}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PriceIcon />}
                            onClick={handleGenerate}
                            disabled={!eventType || loading}
                        >
                            {loading ? 'Analyzing...' : 'Get Price Suggestion'}
                        </Button>
                    </Paper>

                    <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                        <CardContent>
                            <Typography variant="body2" color="white">
                                <strong>Note:</strong> AI-powered pricing with Ollama coming soon!
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    {suggestedPrice ? (
                        <Box>
                            <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Recommended Price
                                    </Typography>
                                    <Typography variant="h2" fontWeight="bold">
                                        ₹{suggestedPrice.recommended}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                        Per ticket
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Paper sx={{ p: 3, mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Price Range
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Minimum
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            ₹{suggestedPrice.min}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Maximum
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            ₹{suggestedPrice.max}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            <Paper sx={{ p: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                                    Based on similar events and market analysis
                                </Typography>
                            </Paper>
                        </Box>
                    ) : (
                        <Paper sx={{ p: 3, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <PriceIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Price suggestions will appear here
                                </Typography>
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default PriceSuggestion;
