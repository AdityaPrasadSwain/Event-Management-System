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
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import {
    Campaign as MarketingIcon,
    ContentCopy as CopyIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
} from '@mui/icons-material';

const MarketingCopy = () => {
    const [eventName, setEventName] = useState('');
    const [eventHighlights, setEventHighlights] = useState('');
    const [platform, setPlatform] = useState('facebook');
    const [loading, setLoading] = useState(false);
    const [generatedCopy, setGeneratedCopy] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        // TODO: Integrate with Ollama AI
        setTimeout(() => {
            const copies = {
                facebook: `🎉 Exciting News! ${eventName} is here!\n\n${eventHighlights}\n\nDon't miss out on this incredible opportunity! Register now and secure your spot.\n\n#${eventName.replace(/\s+/g, '')} #Event #DontMissOut`,
                twitter: `🚀 ${eventName} is happening soon!\n\n${eventHighlights}\n\nLimited seats available! 🎟️\n\n#${eventName.replace(/\s+/g, '')}`,
                instagram: `✨ ${eventName} ✨\n\n${eventHighlights}\n\n📅 Register now!\n💫 Link in bio\n\n#${eventName.replace(/\s+/g, '')} #event #exciting`,
            };
            setGeneratedCopy(copies[platform]);
            setLoading(false);
        }, 2000);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    AI Marketing Copy Generator
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create engaging social media content for your events
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Event Information
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
                            label="Event Highlights"
                            value={eventHighlights}
                            onChange={(e) => setEventHighlights(e.target.value)}
                            multiline
                            rows={4}
                            placeholder="Key features, speakers, activities..."
                            sx={{ mb: 3 }}
                        />
                        <Typography variant="body2" gutterBottom>
                            Select Platform
                        </Typography>
                        <ToggleButtonGroup
                            value={platform}
                            exclusive
                            onChange={(e, newPlatform) => newPlatform && setPlatform(newPlatform)}
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            <ToggleButton value="facebook">
                                <FacebookIcon sx={{ mr: 1 }} /> Facebook
                            </ToggleButton>
                            <ToggleButton value="twitter">
                                <TwitterIcon sx={{ mr: 1 }} /> Twitter
                            </ToggleButton>
                            <ToggleButton value="instagram">
                                <InstagramIcon sx={{ mr: 1 }} /> Instagram
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MarketingIcon />}
                            onClick={handleGenerate}
                            disabled={!eventName || !eventHighlights || loading}
                        >
                            {loading ? 'Generating...' : 'Generate Marketing Copy'}
                        </Button>
                    </Paper>

                    <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                        <CardContent>
                            <Typography variant="body2" color="white">
                                <strong>Note:</strong> AI-powered content generation with Ollama coming soon!
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, minHeight: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                                Generated {platform.charAt(0).toUpperCase() + platform.slice(1)} Copy
                            </Typography>
                            {generatedCopy && (
                                <Button size="small" startIcon={<CopyIcon />}>
                                    Copy
                                </Button>
                            )}
                        </Box>
                        {generatedCopy ? (
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.8,
                                        p: 2,
                                        bgcolor: 'background.default',
                                        borderRadius: 1,
                                    }}
                                >
                                    {generatedCopy}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <MarketingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Your AI-generated marketing copy will appear here
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MarketingCopy;
