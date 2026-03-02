import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, useTheme } from '@mui/material';
import api from '../../services/api';

const AdminDashboardSafe = () => {
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            console.log('🔄 Fetching admin dashboard data...');
            const response = await api.get('/admin/dashboard');
            console.log('✅ Dashboard data received:', response.data);
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching dashboard data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: theme.palette.background.default
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="h6">Error Loading Dashboard</Typography>
                    <Typography>{error}</Typography>
                </Alert>
            </Box>
        );
    }

    if (!stats) {
        return (
            <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
                <Alert severity="warning">No data available</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0, minHeight: '100%' }}>
            <Typography variant="h4" sx={{
                mb: 4,
                fontWeight: 'bold',
                color: theme.palette.text.primary
            }}>
                🎯 Admin Dashboard
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                            {stats.totalUsers || 0}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                            Total Users
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                            {stats.totalOrganizers || 0}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                            Organizers
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Typography variant="h3" sx={{ color: '#00C853', fontWeight: 'bold' }}>
                            {stats.totalEvents || 0}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                            Total Events
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Typography variant="h3" sx={{ color: '#FFAB00', fontWeight: 'bold' }}>
                            {stats.pendingEvents || 0}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                            Pending Approval
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Additional Content Area */}
            <Box sx={{ mt: 4 }}>
                <Paper sx={{
                    p: 3,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 3
                }}>
                    <Typography variant="h6" gutterBottom>
                        📊 System Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Dashboard loaded successfully. All systems operational.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminDashboardSafe;
