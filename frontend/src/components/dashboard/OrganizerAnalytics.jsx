import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import CustomBarChart from '../charts/BarChart';
import CustomAreaChart from '../charts/AreaChart';
import CustomPieChart from '../charts/PieChart';
import { useTheme } from '@mui/material/styles';
import { AutoAwesome } from '@mui/icons-material';
import api from '../../services/api';

const OrganizerAnalytics = ({ stats, loading }) => {
    const theme = useTheme();

    // Constructing data from backend response
    const revenueChartData = stats?.revenueChart ?
        stats.revenueChart.labels.map((label, index) => ({
            name: label,
            value: stats.revenueChart.data[index]
        })) : [];

    const categoryChartData = stats?.categoryChart ?
        stats.categoryChart.labels.map((label, index) => ({
            name: label,
            count: stats.categoryChart.data[index]
        })) : [];

    const sentimentData = stats?.sentimentData || [
        { name: 'Positive', value: 70 }, // Mock fallback
        { name: 'Neutral', value: 20 },
        { name: 'Negative', value: 10 },
    ];

    const attendanceData = [
        { name: 'Registered', value: stats?.totalBookings || 0 },
        { name: 'Attended', value: Math.round((stats?.totalBookings || 0) * 0.8) }, // Mock attendance rate
    ];

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress color="secondary" />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <AutoAwesome sx={{ color: theme.palette.secondary.main, mr: 1, fontSize: 32 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Event Insights
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <CustomBarChart
                        title="Registrations per Category"
                        data={categoryChartData}
                        dataKey="count"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <CustomPieChart
                        title="Feedback Sentiment (AI)"
                        data={sentimentData}
                        colors={[theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main]}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomAreaChart
                        title="Revenue Trend"
                        data={revenueChartData}
                        dataKey="value"
                        colorStart={theme.palette.primary.main}
                        colorEnd={theme.palette.primary.dark}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomPieChart
                        title="Overall Attendance Rate"
                        data={attendanceData}
                        colors={[theme.palette.info.main, theme.palette.success.main]}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrganizerAnalytics;
