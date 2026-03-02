import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, IconButton } from '@mui/material';
import { AutoAwesome, ContentCopy } from '@mui/icons-material';
import api from '../services/api';
import Swal from 'sweetalert2';

const AiDescriptionGenerator = ({ onDescriptionGenerated }) => {
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    const handleGenerate = async () => {
        if (!idea.trim()) return;
        setLoading(true);
        try {
            const response = await api.post('/ai/generate-event-description', { idea });
            const desc = response.data.description;
            setGeneratedText(desc);
            if (onDescriptionGenerated) {
                onDescriptionGenerated(desc);
            }
        } catch (error) {
            console.error("AI Generation Error", error);
            Swal.fire('Error', 'Failed to generate description. Ensure AI service is running.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'rgba(187, 134, 252, 0.05)', border: '1px dashed #bb86fc' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoAwesome color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">AI Magic Writer</Typography>
            </Box>

            <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="e.g., A tech conference in Bangalore about AI and Future of Work..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                sx={{ mb: 2 }}
                disabled={loading}
            />

            <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={loading || !idea.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                fullWidth
            >
                {loading ? 'Magic in progress...' : 'Generate Professional Description'}
            </Button>

            {generatedText && (
                <Box sx={{ mt: 3, position: 'relative' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>Generated Result:</Typography>
                    <Paper sx={{ p: 2, background: 'rgba(0,0,0,0.2)' }}>
                        <Typography variant="body1">{generatedText}</Typography>
                    </Paper>
                    <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 30, right: 8 }}
                        onClick={() => {
                            navigator.clipboard.writeText(generatedText);
                            Swal.fire({
                                toast: true,
                                icon: 'success',
                                title: 'Copied!',
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }}
                    >
                        <ContentCopy fontSize="small" />
                    </IconButton>
                </Box>
            )}
        </Paper>
    );
};

export default AiDescriptionGenerator;
