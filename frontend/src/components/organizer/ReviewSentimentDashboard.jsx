import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Chip,
    CircularProgress,
    Avatar,
    useTheme,
    alpha,
    Card,
    Stack,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    SentimentSatisfiedAlt,
    SentimentNeutral,
    SentimentVeryDissatisfied,
    AutoAwesome,
    TrendingUp,
    MoreVert,
    Star,
    EmojiEvents,
    Psychology,
    Message
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip } from 'recharts';
import api from '../../services/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const ReviewSentimentDashboard = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [sentimentStats, setSentimentStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const feedbackRes = await api.get('/organizer/feedbacks');
                let data = feedbackRes.data;

                // Mock data for demo if empty
                if (!data || data.length === 0) {
                    data = [
                        { id: 1, user: { name: 'Alice Johnson' }, comment: 'Absolutely loved the venue and the speakers were top-notch! Highly recommend.', sentiment: 'POSITIVE', rating: 5, aiSummary: 'User highly satisfied with venue and speakers.' },
                        { id: 2, user: { name: 'Michael Smith' }, comment: 'Great execution, but the registration queue was a bit long.', sentiment: 'POSITIVE', rating: 4, aiSummary: 'Generally positive, needs queue optimization.' },
                        { id: 3, user: { name: 'Sarah Wilson' }, comment: 'It was okay, but I expected more interaction during the workshops.', sentiment: 'NEUTRAL', rating: 3, aiSummary: 'User expected higher engagement.' },
                        { id: 4, user: { name: 'David Brown' }, comment: 'The sound system failed multiple times. Very disappointing experience.', sentiment: 'NEGATIVE', rating: 1, aiSummary: 'Critical technical failure mentioned.' },
                        { id: 5, user: { name: 'Emma Davis' }, comment: 'Food was excellent but seats were uncomfortable.', sentiment: 'NEUTRAL', rating: 3, aiSummary: 'Mixed review on catering vs comfort.' },
                    ];
                }
                setFeedbacks(data);

                const positive = data.filter(f => f.sentiment === 'POSITIVE').length;
                const neutral = data.filter(f => f.sentiment === 'NEUTRAL').length;
                const negative = data.filter(f => f.sentiment === 'NEGATIVE').length;

                setSentimentStats([
                    { name: 'Positive', value: positive, color: '#10b981' }, // Emerald
                    { name: 'Neutral', value: neutral, color: '#f59e0b' }, // Amber
                    { name: 'Negative', value: negative, color: '#ef4444' }  // Rose
                ]);

            } catch (error) {
                console.error("Error fetching feedback data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const ratingDistribution = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        feedbacks.forEach(f => {
            if (counts[f.rating] !== undefined) counts[f.rating]++;
        });
        return Object.keys(counts).sort((a, b) => b - a).map(rating => ({
            rating: `${rating} Stars`,
            count: counts[rating],
            percentage: feedbacks.length ? (counts[rating] / feedbacks.length) * 100 : 0
        }));
    }, [feedbacks]);

    const averageRating = useMemo(() => {
        if (!feedbacks.length) return 0;
        return (feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / feedbacks.length).toFixed(1);
    }, [feedbacks]);

    const getSentimentStyles = (sentiment) => {
        switch (sentiment) {
            case 'POSITIVE': return { icon: <SentimentSatisfiedAlt />, color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) };
            case 'NEUTRAL': return { icon: <SentimentNeutral />, color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) };
            case 'NEGATIVE': return { icon: <SentimentVeryDissatisfied />, color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) };
            default: return { icon: <SentimentNeutral />, color: theme.palette.grey[500], bg: alpha(theme.palette.grey[500], 0.1) };
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <CircularProgress color="secondary" size={60} thickness={4} />
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', background: 'transparent' }}>
            {/* Header Section */}
            <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ mb: 4 }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex',
                            mr: 2,
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Psychology sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -0.5 }}>
                            AI Review <span style={{ color: theme.palette.secondary.main }}>Sentiment</span>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            Deep analysis of attendee feedback using neural language processing
                        </Typography>
                    </Box>
                </Box>
            </MotionBox>

            {/* Summary Scorecards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <SummaryCard
                        title="Total Reviews"
                        value={feedbacks.length}
                        icon={<Message />}
                        color={theme.palette.primary.main}
                        trend="+12% from last event"
                        index={0}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <SummaryCard
                        title="Average Rating"
                        value={`${averageRating}/5.0`}
                        icon={<Star />}
                        color="#f59e0b"
                        trend="Top 10% of organizers"
                        index={1}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <SummaryCard
                        title="AI Favorability"
                        value={`${Math.round((sentimentStats[0]?.value / feedbacks.length) * 100 || 0)}%`}
                        icon={<EmojiEvents />}
                        color="#10b981"
                        trend="Strong positive sentiment"
                        index={2}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Visual Analysis Panel */}
                <Grid item xs={12} xl={5}>
                    <MotionCard
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>Sentiment Distribution</Typography>

                        <Box sx={{ height: 300, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sentimentStats}
                                        innerRadius={85}
                                        outerRadius={110}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {sentimentStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ReTooltip
                                        contentStyle={{ borderRadius: 12, border: 'none', background: '#1e293b', color: 'white' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="800" color="primary">{averageRating}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight="700">AVG RATING</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 2 }}>Rating Breakdown</Typography>
                        <Stack spacing={2}>
                            {ratingDistribution.map((item, idx) => (
                                <Box key={idx}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" fontWeight="600">{item.rating}</Typography>
                                        <Typography variant="caption" fontWeight="700">{item.count} reviews</Typography>
                                    </Box>
                                    <Box sx={{ height: 6, width: '100%', bgcolor: alpha(theme.palette.divider, 0.05), borderRadius: 3, overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                            style={{
                                                height: '100%',
                                                backgroundColor: idx === 0 ? '#10b981' : idx === 1 ? '#34d399' : idx === 2 ? '#f59e0b' : '#ef4444',
                                                borderRadius: 3
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </MotionCard>
                </Grid>

                {/* Feedbacks Panel */}
                <Grid item xs={12} xl={7}>
                    <MotionCard
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="700">Attendee Insights</Typography>
                            <IconButton size="small"><MoreVert /></IconButton>
                        </Box>

                        <Stack spacing={2} sx={{ maxHeight: 650, overflow: 'auto', pr: 1 }}>
                            <AnimatePresence>
                                {feedbacks.map((item, index) => (
                                    <ReviewItem key={item.id} feedback={item} index={index} styles={getSentimentStyles(item.sentiment)} />
                                ))}
                            </AnimatePresence>
                        </Stack>
                    </MotionCard>
                </Grid>
            </Grid>
        </Box>
    );
};

const SummaryCard = ({ title, value, icon, color, trend, index }) => {
    const theme = useTheme();
    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            sx={{
                p: 2.5,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: alpha(color, 0.1),
                    color: color,
                    mr: 2
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="700">{title.toUpperCase()}</Typography>
                <Typography variant="h5" fontWeight="800">{value}</Typography>
                <Typography variant="caption" color="success.main" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} /> {trend}
                </Typography>
            </Box>
            {/* Subtle background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    opacity: 0.05,
                    transform: 'rotate(15deg)',
                    fontSize: 80,
                    color: color
                }}
            >
                {icon}
            </Box>
        </MotionCard>
    );
};

const ReviewItem = ({ feedback, index, styles }) => {
    const theme = useTheme();
    return (
        <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.default, 0.4),
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.05),
                position: 'relative',
                transition: 'all 0.2s ease',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ width: 44, height: 44, fontSize: 18, fontWeight: 'bold', bgcolor: theme.palette.primary.main }}>
                    {feedback.user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="700">{feedback.user?.name || 'Anonymous'}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} sx={{ fontSize: 16, color: i < feedback.rating ? '#f59e0b' : theme.palette.divider }} />
                                ))}
                            </Box>
                            <Chip
                                icon={React.cloneElement(styles.icon, { sx: { fontSize: '14px !important' } })}
                                label={feedback.sentiment}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.65rem',
                                    fontWeight: '800',
                                    bgcolor: styles.bg,
                                    color: styles.color,
                                    border: `1px solid ${alpha(styles.color, 0.2)}`,
                                    '& .MuiChip-icon': { color: 'inherit' }
                                }}
                            />
                        </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary', lineWeight: 1.6 }}>
                        "{feedback.comment}"
                    </Typography>

                    {feedback.aiSummary && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                borderLeft: `3px solid ${theme.palette.secondary.main}`
                            }}
                        >
                            <AutoAwesome sx={{ color: theme.palette.secondary.main, fontSize: 14, mt: 0.3 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                <span style={{ fontWeight: 700, color: theme.palette.secondary.main }}>AI INSIGHT:</span> {feedback.aiSummary}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </MotionBox>
    );
};

export default ReviewSentimentDashboard;
