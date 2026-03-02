import { useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    AccountBalance as AccountIcon,
    Receipt as ReceiptIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import AnimatedCard from '../../components/AnimatedCard';
import useDashboardData from '../../hooks/useDashboardData';

const ENDPOINTS = {
    stats: '/organizer/dashboard/stats'
};

const OrganizerRevenue = () => {
    const { data, loading, error } = useDashboardData(ENDPOINTS, 'organizerRevenueData');

    const stats = useMemo(() => data?.stats || {
        totalRevenue: 0,
        monthlyRevenue: 0,
        availableBalance: 0,
        pendingBalance: 0
    }, [data]);

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error loading revenue data. Please try again.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Revenue & Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Track earnings from your events and manage payouts
                </Typography>
                {data?.stats?.debugEmail && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Debug: Logged in as {data.stats.debugEmail} | Tickets found: {data.stats.debugTicketCount}
                    </Typography>
                )}
            </Box>

            {/* Revenue Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <AnimatedCard delay={0.1} sx={{ minHeight: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MoneyIcon sx={{ color: 'success.main', mr: 1 }} />
                            <Typography variant="caption" color="textSecondary">Total Revenue</Typography>
                        </Box>
                        <Typography variant="h4" color="primary">₹{(stats.totalRevenue || 0).toLocaleString()}</Typography>
                    </AnimatedCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <AnimatedCard delay={0.2} sx={{ minHeight: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                            <Typography variant="caption" color="textSecondary">This Month</Typography>
                        </Box>
                        <Typography variant="h4" color="secondary">₹{(stats.monthlyRevenue || 0).toLocaleString()}</Typography>
                    </AnimatedCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <AnimatedCard delay={0.3} sx={{ minHeight: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccountIcon sx={{ color: 'info.main', mr: 1 }} />
                            <Typography variant="caption" color="textSecondary">Available Balance</Typography>
                        </Box>
                        <Typography variant="h4" color="secondary">₹{(stats.availableBalance || 0).toLocaleString()}</Typography>
                    </AnimatedCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <AnimatedCard delay={0.4} sx={{ minHeight: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ReceiptIcon sx={{ color: 'warning.main', mr: 1 }} />
                            <Typography variant="caption" color="textSecondary">Pending</Typography>
                        </Box>
                        <Typography variant="h4" color="secondary">₹{(stats.pendingBalance || 0).toLocaleString()}</Typography>
                    </AnimatedCard>
                </Grid>
            </Grid>

            {/* Revenue Chart Placeholder */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Revenue Overview
                </Typography>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <MoneyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Revenue Data Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Start selling tickets to see your revenue analytics here
                    </Typography>
                </Box>
            </Paper>

            {/* Recent Transactions */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Transactions
                </Typography>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Transactions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Payment transactions will appear here
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default OrganizerRevenue;
