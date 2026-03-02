import React, { useMemo } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { AutoAwesome, Psychology, TrendingUp, Security } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

import CustomLineChart from '../charts/LineChart';
import CustomBarChart from '../charts/BarChart';
import CustomPieChart from '../charts/PieChart';
import CustomAreaChart from '../charts/AreaChart';
import SkeletonLoader from '../SkeletonLoader';
import useDashboardData from '../../hooks/useDashboardData';

const ENDPOINTS = {
    analytics: '/admin/ai-analytics' // Assuming a consolidated endpoint or we can mock/fetch multiple
};

const MetricCard = React.memo(({ icon, title, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay, duration: 0.5 }}
    >
        <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%', border: `1px solid ${color + '40'}`, background: 'rgba(255,255,255,0.03)' }}>
            <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: color + '20', mr: 2, color: color }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="textSecondary">{title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
            </Box>
        </Paper>
    </motion.div>
));

const AiAnalytics = () => {
    const theme = useTheme();
    // Using the hook, but since we don't have a real endpoint for all this yet, we might need to mock inside the hook or here if the hook fails. 
    // For now, let's assume the hook returns null and we handle loading, or we use the hook to simulate delay.
    // In a real app, `useDashboardData` would call the backend. Here I'll mock the data response structure if it's empty to keep the UI working.

    // Simulating hook usage even if endpoint 404s, to show pattern. 
    // In reality, we'd fallback to the mock data we had before if API fails, or better, move the mock to the hook/service level.
    // For this demonstration of "Optimization", I will use the hook but provide the mock data as fallback if data is null.

    const { data, loading } = useDashboardData(ENDPOINTS, 'aiAnalytics');

    const analyticsData = useMemo(() => {
        if (data?.analytics) return data.analytics;

        // Fallback Mock Data (preserved from previous version for demo)
        return {
            sentimentDistribution: [
                { name: 'Positive', value: 65 },
                { name: 'Neutral', value: 25 },
                { name: 'Negative', value: 10 },
            ],
            recommendationEffectiveness: [
                { name: 'Impressions', value: 5000 },
                { name: 'Clicks', value: 1200 },
                { name: 'Conversions', value: 350 },
            ],
            searchTrends: [
                { name: 'Mon', count: 120 },
                { name: 'Tue', count: 180 },
                { name: 'Wed', count: 240 },
                { name: 'Thu', count: 300 },
                { name: 'Fri', count: 450 },
                { name: 'Sat', count: 600 },
                { name: 'Sun', count: 550 },
            ],
            fraudDetection: [
                { name: 'Wk 1', value: 5 },
                { name: 'Wk 2', value: 8 },
                { name: 'Wk 3', value: 2 },
                { name: 'Wk 4', value: 0 },
            ]
        };
    }, [data]);

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3, 4].map(i => <Grid item xs={12} sm={6} md={3} key={i}><SkeletonLoader type="stat" /></Grid>)}
                </Grid>
                <Grid container spacing={4}>
                    {[1, 2, 3, 4].map(i => <Grid item xs={12} md={6} key={i}><SkeletonLoader /></Grid>)}
                </Grid>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <AutoAwesome sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 40 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    AI Intelligence Center
                </Typography>
            </Box>

            {/* AI Metrics Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        icon={<Psychology />}
                        title="AI Queries Processed"
                        value="12,450"
                        color={theme.palette.secondary.main}
                        delay={0.1}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        icon={<TrendingUp />}
                        title="Recommendation CTR"
                        value="8.4%"
                        color={theme.palette.success.main}
                        delay={0.2}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        icon={<Security />}
                        title="Fraud Prev."
                        value="99.9%"
                        color={theme.palette.info.main}
                        delay={0.3}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        icon={<AutoAwesome />}
                        title="Descriptions Gen."
                        value="850"
                        color={theme.palette.primary.main}
                        delay={0.4}
                    />
                </Grid>
            </Grid>

            {/* AI Charts */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <CustomAreaChart
                        title="AI Search Usage Trends"
                        data={analyticsData.searchTrends}
                        dataKey="count"
                        colorStart={theme.palette.secondary.main}
                        colorEnd={theme.palette.secondary.dark}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <CustomPieChart
                        title="Global Sentiment Analysis"
                        data={analyticsData.sentimentDistribution}
                        colors={[theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main]}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomBarChart
                        title="Recommendation Effectiveness"
                        data={analyticsData.recommendationEffectiveness}
                        dataKey="value"
                        color={theme.palette.primary.light}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomLineChart
                        title="Fraud Detection Alerts"
                        data={analyticsData.fraudDetection}
                        dataKey="value"
                        color={theme.palette.error.main}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default React.memo(AiAnalytics);
