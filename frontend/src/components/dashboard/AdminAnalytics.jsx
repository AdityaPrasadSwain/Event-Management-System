import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import CustomLineChart from '../charts/LineChart';
import CustomBarChart from '../charts/BarChart';
import CustomPieChart from '../charts/PieChart';
import CustomAreaChart from '../charts/AreaChart';
import api from '../../services/api';
import { useTheme } from '@mui/material/styles';

const AdminAnalytics = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        userGrowth: [],
        organizerStats: [],
        eventStatus: [],
        revenue: [],
        spamStats: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Mocking data for now as backend analytics endpoints might not be fully ready or populated
            // In a real scenario, this would be: const response = await api.get('/admin/analytics');

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            setData({
                userGrowth: [
                    { name: 'Jan', users: 400 },
                    { name: 'Feb', users: 600 },
                    { name: 'Mar', users: 1200 },
                    { name: 'Apr', users: 1800 },
                    { name: 'May', users: 2400 },
                    { name: 'Jun', users: 3200 },
                ],
                organizerStats: [
                    { name: 'Active', count: 120 },
                    { name: 'Inactive', count: 30 },
                    { name: 'Pending', count: 15 },
                ],
                eventStatus: [
                    { name: 'Approved', value: 450 },
                    { name: 'Pending', value: 50 },
                    { name: 'Rejected', value: 20 },
                    { name: 'Live', value: 80 },
                ],
                revenue: [
                    { name: 'Jan', revenue: 5000 },
                    { name: 'Feb', revenue: 8000 },
                    { name: 'Mar', revenue: 15000 },
                    { name: 'Apr', revenue: 22000 },
                    { name: 'May', revenue: 35000 },
                    { name: 'Jun', revenue: 48000 },
                ],
                spamStats: [
                    { name: 'Clean', value: 920 },
                    { name: 'Spam Detected', value: 80 },
                ]
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, background: 'linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Platform Analytics
            </Typography>

            <Grid container spacing={4}>
                {/* Row 1: Key Growth Metrics */}
                <Grid item xs={12} md={8}>
                    <CustomAreaChart
                        title="Total User Growth"
                        data={data.userGrowth}
                        dataKey="users"
                        colorStart={theme.palette.primary.main}
                        colorEnd={theme.palette.primary.dark}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <CustomPieChart
                        title="Events by Status"
                        data={data.eventStatus}
                        colors={[
                            theme.palette.success.main,
                            theme.palette.warning.main,
                            theme.palette.error.main,
                            theme.palette.info.main
                        ]}
                    />
                </Grid>

                {/* Row 2: Revenue & Organizers */}
                <Grid item xs={12} md={6}>
                    <CustomLineChart
                        title="Revenue Trends ($)"
                        data={data.revenue}
                        dataKey="revenue"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomBarChart
                        title="Organizer Activity"
                        data={data.organizerStats}
                        dataKey="count"
                        color={theme.palette.primary.light}
                    />
                </Grid>

                {/* Row 3: AI Insights */}
                <Grid item xs={12} md={4}>
                    <CustomPieChart
                        title="AI Spam Detection"
                        data={data.spamStats}
                        colors={[theme.palette.success.main, theme.palette.error.main]}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminAnalytics;
