import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Fab, Avatar, CircularProgress, useTheme } from '@mui/material';
import { Send, Close, SmartToy, SupportAgent } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
// ... existing imports ...
// I will just replace the specific lines in the next chunk to be safe.
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AiChatbot = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI assistant. Ask me anything about events or your bookings.", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        try {
            // Using the /ai/chat endpoint
            // If user is logged in, pass their email for context (though backend extracts from token usually, 
            // the current AiServiceImpl.chat takes (message, userEmail). 
            // The controller might be extracting email from Principal.
            // Let's assume the controller handles it or we send it if needed.
            // Looking at AiController: chat(@RequestParam String message, Principal principal)

            const response = await api.get('/ai/chat', {
                params: {
                    message: userMsg.text
                }
            });

            const aiMsg = { text: response.data, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my brain right now.", sender: 'ai', error: true }]);
        } finally {
            setTyping(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        style={{
                            position: 'fixed',
                            bottom: 100,
                            right: 30,
                            zIndex: 1300,
                            width: 350,
                            maxWidth: '90vw'
                        }}
                    >
                        <Paper
                            elevation={12}
                            sx={{
                                height: 500,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                borderRadius: 4,
                                background: isDark
                                    ? 'rgba(30,30,30,0.95)'
                                    : 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${isDark ? 'rgba(187, 134, 252, 0.3)' : 'rgba(124, 77, 255, 0.3)'}`
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ p: 2, background: 'linear-gradient(45deg, #7c4dff, #18ffff)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'white', color: '#7c4dff', mr: 1 }}>
                                        <SmartToy />
                                    </Avatar>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>Event AI Assistant</Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'black' }}>
                                    <Close />
                                </IconButton>
                            </Box>

                            {/* Messages */}
                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {messages.map((msg, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            maxWidth: '80%',
                                            p: 1.5,
                                            borderRadius: 2,
                                            borderBottomRightRadius: msg.sender === 'user' ? 0 : 2,
                                            borderBottomLeftRadius: msg.sender === 'ai' ? 0 : 2,
                                            bgcolor: msg.sender === 'user'
                                                ? theme.palette.primary.main
                                                : isDark ? '#424242' : '#f5f5f5',
                                            color: msg.sender === 'user'
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.primary,
                                            boxShadow: 1
                                        }}
                                    >
                                        <Typography variant="body2">{msg.text}</Typography>
                                    </Box>
                                ))}
                                {typing && (
                                    <Box sx={{ alignSelf: 'flex-start', p: 1.5, bgcolor: '#424242', borderRadius: 2 }}>
                                        <CircularProgress size={16} color="inherit" />
                                    </Box>
                                )}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input */}
                            <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={typing}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,0.2)' } }}
                                />
                                <IconButton
                                    color="secondary"
                                    onClick={handleSend}
                                    disabled={!input.trim() || typing}
                                    sx={{ bgcolor: 'rgba(3, 218, 198, 0.1)' }}
                                >
                                    <Send />
                                </IconButton>
                            </Box>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            <Fab
                color="primary"
                aria-label="chat"
                sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1200 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <Close /> : <SupportAgent />}
            </Fab>
        </>
    );
};

export default AiChatbot;
