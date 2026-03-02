import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    useTheme
} from '@mui/material';
import {
    CurrencyRupee,
    TrendingUp,
    AccountBalance,
    ReceiptLong,
    Payments,
    AccountTree
} from '@mui/icons-material';
import api from '../../services/api';

const AdminRevenue = () => {
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const response = await api.get('/admin/revenue/summary');
                setRevenue(response.data);
            } catch (error) {
                console.error("Error fetching revenue summary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRevenue();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
    );

    const stats = [
        { label: 'Total Platform Revenue', value: revenue?.netPlatformRevenue, icon: <TrendingUp />, color: '#4caf50' },
        { label: 'Commission Earned', value: revenue?.totalCommissionEarned, icon: <Payments />, color: '#2196f3' },
        { label: 'User Convenience Fees', value: revenue?.totalUserFees, icon: <ReceiptLong />, color: '#9c27b0' },
        { label: 'GST Collected', value: revenue?.totalGSTCollected, icon: <AccountBalance />, color: '#ff9800' },
        { label: 'Organizer Payouts', value: revenue?.totalOrganizerPayout, icon: <AccountTree />, color: '#f44336' },
        { label: 'Total Bookings', value: revenue?.totalBookings, icon: <Payments />, isCount: true, color: '#607d8b' },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Revenue Dashboard</Typography>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white'
                            }}
                        >
                            <Box sx={{
                                bgcolor: `${stat.color}15`,
                                color: stat.color,
                                p: 1.5,
                                borderRadius: 2,
                                display: 'flex'
                            }}>
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {stat.isCount ? stat.value : `₹${stat.value?.toFixed(2)}`}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Detailed Breakdown */}
            <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 'bold' }}>Financial Breakdown</Typography>
            <Paper sx={{ p: 4, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Platform Earnings</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="text.secondary">Total Commission (with GST)</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">₹{revenue?.totalCommissionEarned.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography color="text.secondary">Total User Fees (with GST)</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">₹{revenue?.totalUserFees.toFixed(2)}</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Gross Revenue</Typography>
                            <Typography variant="h6" color="primary">₹{(revenue?.totalCommissionEarned + revenue?.totalUserFees).toFixed(2)}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Liabilities & Payouts</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="text.secondary">GST to be Paid (18%)</Typography>
                            <Typography variant="subtitle1" fontWeight="bold" color="error">₹{revenue?.totalGSTCollected.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography color="text.secondary">Payouts to Organizers</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">₹{revenue?.totalOrganizerPayout.toFixed(2)}</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Net Platform Profit</Typography>
                            <Typography variant="h6" color="success.main">₹{revenue?.netPlatformRevenue.toFixed(2)}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminRevenue;
