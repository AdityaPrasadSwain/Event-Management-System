import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Paper, Chip } from '@mui/material';
import { AutoAwesome, ContentCopy } from '@mui/icons-material';
import api from '../../services/api';

const AiDescriptionGenerator = ({ title, category, onApply }) => {
    const [keywords, setKeywords] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!title || !category) return;

        setLoading(true);
        try {
            const response = await api.post('/ai/generate-description', {
                title,
                category,
                keywords
            });
            setGeneratedText(response.data.description);
        } catch (error) {
            console.error("Error generating description", error);
            setGeneratedText("Error creating description. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2, border: '1px border rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AutoAwesome color="secondary" />
                <Typography variant="h6">AI Description Generator</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Enter keywords/vibes and let AI write a compelling description for "{title || 'your event'}".
            </Typography>

            <TextField
                fullWidth
                label="Keywords (e.g., formal, music, networking, cozy)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
            />

            <Button
                variant="outlined"
                color="secondary"
                onClick={handleGenerate}
                disabled={loading || !title}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                fullWidth
                sx={{ mb: 2 }}
            >
                {loading ? 'Thinking...' : 'Generate Description'}
            </Button>

            {generatedText && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                        {generatedText}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => onApply(generatedText)}
                        >
                            Use This
                        </Button>
                        <Button
                            size="small"
                            startIcon={<ContentCopy />}
                            onClick={() => navigator.clipboard.writeText(generatedText)}
                        >
                            Copy
                        </Button>
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default AiDescriptionGenerator;
