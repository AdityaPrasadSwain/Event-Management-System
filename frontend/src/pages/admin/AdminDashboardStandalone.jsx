import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, AppBar, Toolbar, IconButton } from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboardStandalone = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            console.log('🔄 Fetching admin dashboard data...');
            console.log('🔑 Auth token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
            console.log('👤 User role:', localStorage.getItem('role'));

            const response = await api.get('/admin/dashboard');
            console.log('✅ Dashboard data received:', response.data);
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching dashboard data:', err);
            console.error('Response:', err.response?.data);
            console.error('Status:', err.response?.status);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            console.log('Loading complete');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#ffffff' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, bgcolor: '#ffffff', minHeight: '100vh' }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="h6">Error Loading Dashboard</Typography>
                    <Typography>{error}</Typography>
                </Alert>
            </Box>
        );
    }

    if (!stats) {
        return (
            <Box sx={{ p: 3, bgcolor: '#ffffff', minHeight: '100vh' }}>
                <Alert severity="warning">No data available</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Simple Navbar */}
            <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        SEMS - Admin Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={logout}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Dashboard Content */}
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#000000' }}>
                    Welcome, Admin!
                </Typography>

                {/* Stats Cards */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffffff', borderRadius: 2 }}>
                            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                                {stats.totalUsers || 0}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                Total Users
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffffff', borderRadius: 2 }}>
                            <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                                {stats.totalOrganizers || 0}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                Organizers
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffffff', borderRadius: 2 }}>
                            <Typography variant="h3" sx={{ color: '#00C853', fontWeight: 'bold' }}>
                                {stats.totalEvents || 0}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                Total Events
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffffff', borderRadius: 2 }}>
                            <Typography variant="h3" sx={{ color: '#FFAB00', fontWeight: 'bold' }}>
                                {stats.pendingEvents || 0}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                Pending Approval
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#000000' }}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Paper
                                sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: '#e3f2fd' } }}
                                onClick={() => navigate('/admin/users')}
                            >
                                <Typography>Manage Users</Typography>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper
                                sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: '#e3f2fd' } }}
                                onClick={() => navigate('/admin/events')}
                            >
                                <Typography>Manage Events</Typography>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper
                                sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: '#e3f2fd' } }}
                                onClick={() => navigate('/admin/categories')}
                            >
                                <Typography>Manage Categories</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Debug Info */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#000000' }}>
                        Debug Information
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto', color: '#000000' }}>
                            {JSON.stringify(stats, null, 2)}
                        </pre>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboardStandalone;
