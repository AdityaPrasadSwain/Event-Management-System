// Analytics Page (Admin)
// System analytics and insights dashboard

import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    LinearProgress,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Event as EventIcon,
    AttachMoney as RevenueIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/common/StatsCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorDisplay from '../../components/common/ErrorDisplay';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <LoadingScreen message="Loading analytics..." />;
    }

    if (error) {
        return <ErrorDisplay title="Analytics Error" message={error} />;
    }

    return (
        <Box>
            {/* Page Header */}
            <PageHeader
                title="Analytics & Insights"
                subtitle="Monitor system performance and user engagement"
            />

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Total Revenue"
                        value="₹45,230"
                        icon={RevenueIcon}
                        color="success"
                        trend={15}
                        trendLabel="vs last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Active Users"
                        value="3,245"
                        icon={PeopleIcon}
                        color="primary"
                        trend={8}
                        trendLabel="vs last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Events Created"
                        value="156"
                        icon={EventIcon}
                        color="secondary"
                        trend={-3}
                        trendLabel="vs last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Completion Rate"
                        value="94.2%"
                        icon={CheckCircleIcon}
                        color="info"
                        trend={2}
                        trendLabel="vs last month"
                    />
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                {/* User Growth */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            User Growth
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">
                                Chart placeholder - Integration with charting library needed
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Event Categories */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Top Event Categories
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {[
                                { name: 'Conferences', value: 45, color: 'primary' },
                                { name: 'Workshops', value: 30, color: 'secondary' },
                                { name: 'Webinars', value: 15, color: 'success' },
                                { name: 'Others', value: 10, color: 'warning' },
                            ].map((category) => (
                                <Box key={category.name} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2">{category.name}</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {category.value}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={category.value}
                                        color={category.color}
                                        sx={{ height: 8, borderRadius: 1 }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Revenue Breakdown */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Revenue Breakdown
                        </Typography>
                        <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">
                                Revenue chart placeholder
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            System Activity
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Card variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="body2">
                                        <strong>Peak Hours:</strong> 2 PM - 5 PM
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="body2">
                                        <strong>Avg Session Time:</strong> 8.5 minutes
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body2">
                                        <strong>Bounce Rate:</strong> 12.3%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
