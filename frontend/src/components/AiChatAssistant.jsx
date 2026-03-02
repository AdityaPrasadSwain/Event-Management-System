import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Fab, Divider, CircularProgress, Avatar } from '@mui/material';
import { AutoAwesome, Send, Close, SmartToy } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const AiChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI Event Assistant. Ask me anything about events or get recommendations!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/ai/chat', { message: input });
            const aiMessage = {
                id: Date.now() + 1,
                text: response.data.response || "I'm having trouble connecting to my brain right now.",
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I'm offline at the moment (Ollama not reachable).",
                sender: 'ai'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    >
                        <Paper
                            sx={{
                                width: 350,
                                height: 500,
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32 }}>
                                        <SmartToy fontSize="small" />
                                    </Avatar>
                                    <Typography fontWeight="bold">Event AI</Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                                    <Close />
                                </IconButton>
                            </Box>

                            {/* Messages */}
                            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
                                {messages.map((msg) => (
                                    <Box
                                        key={msg.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            mb: 2
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                maxWidth: '80%',
                                                borderRadius: 2,
                                                bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                                                color: msg.sender === 'user' ? 'white' : 'text.primary',
                                                borderTopRightRadius: msg.sender === 'user' ? 0 : 2,
                                                borderTopLeftRadius: msg.sender === 'ai' ? 0 : 2
                                            }}
                                        >
                                            <Typography variant="body2">{msg.text}</Typography>
                                        </Paper>
                                    </Box>
                                ))}
                                {loading && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                                        <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper' }}>
                                            <CircularProgress size={16} />
                                        </Paper>
                                    </Box>
                                )}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input */}
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <TextField
                                    fullWidth
                                    placeholder="Ask for recommendations..."
                                    variant="outlined"
                                    size="small"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={handleSend} disabled={!input.trim() || loading} color="primary">
                                                <Send />
                                            </IconButton>
                                        ),
                                        sx: { borderRadius: 4 }
                                    }}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            <Fab
                color="primary"
                aria-label="chat"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    boxShadow: '0 4px 20px rgba(187, 134, 252, 0.4)',
                    background: 'linear-gradient(45deg, #ae00ff, #5500ff)'
                }}
            >
                {isOpen ? <Close /> : <AutoAwesome />}
            </Fab>
        </Box>
    );
};

export default AiChatAssistant;
