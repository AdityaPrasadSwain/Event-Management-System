import React, { useMemo, useState } from 'react';
import { Box, Typography, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tabs, Tab, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Add, Visibility, Edit, Assessment, Event, People, RateReview, AutoAwesome } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import AnimatedCard from '../../components/AnimatedCard';
import OrganizerAnalytics from '../../components/dashboard/OrganizerAnalytics';
import SkeletonLoader from '../../components/SkeletonLoader';
import useDashboardData from '../../hooks/useDashboardData';
import SmartPricingWidget from '../../components/organizer/SmartPricingWidget';
import ReviewSentimentDashboard from '../../components/organizer/ReviewSentimentDashboard';
import AttendeeCheckin from '../../components/organizer/AttendeeCheckin';
import useAuth from '../../hooks/useAuth';
import { Alert, AlertTitle } from '@mui/material';

const ENDPOINTS = {
    stats: '/organizer/dashboard/stats',
    events: '/organizer/events',
    analytics: '/organizer/analytics'
};

const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data, loading } = useDashboardData(ENDPOINTS, 'organizerData');
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedEventId, setSelectedEventId] = useState('');

    const stats = useMemo(() => data?.stats || {
        totalEvents: 0,
        approvedEvents: 0,
        pendingEvents: 0,
        totalBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        availableBalance: 0,
        pendingBalance: 0
    }, [data]);
    const myEvents = useMemo(() => data?.events || [], [data]);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const getStatusChip = (status) => {
        const colors = {
            PENDING: 'warning',
            APPROVED: 'info',
            LIVE: 'success',
            REJECTED: 'error',
            CANCELLED: 'default',
            UPCOMING: 'primary'
        };
        return <Chip label={status} sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} color={colors[status] || 'default'} size="small" variant="outlined" />;
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Status Banners */}
            {user?.organizerStatus === 'PENDING' && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <AlertTitle>Account Under Review</AlertTitle>
                    Your organizer account is currently pending approval. You can prepare events, but you cannot publish them until approved.
                </Alert>
            )}
            {user?.organizerStatus === 'REJECTED' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Account Rejected</AlertTitle>
                    Your organizer account application has been rejected. Please contact support for more information.
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Organizer Dashboard</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/organizer/create-event')}
                    disabled={user?.organizerStatus !== 'APPROVED'}
                    sx={{
                        background: user?.organizerStatus === 'APPROVED' ? 'linear-gradient(45deg, #7c4dff, #18ffff)' : 'grey',
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                >
                    Create Event
                </Button>
            </Box>

            {/* Dashboard Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Overview" icon={<Assessment />} iconPosition="start" />
                    <Tab label="My Events" icon={<Event />} iconPosition="start" />
                    <Tab label="Attendees" icon={<People />} iconPosition="start" />
                    <Tab label="Reviews & AI" icon={<RateReview />} iconPosition="start" />
                </Tabs>
            </Paper>

            {/* --- TAB 0: OVERVIEW --- */}
            {currentTab === 0 && (
                <Box>
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => <Grid item xs={12} sm={2.4} key={i}><SkeletonLoader type="stat" /></Grid>)
                        ) : (
                            <>
                                <Grid item xs={12} sm={2.4}>
                                    <AnimatedCard delay={0.1} sx={{ minHeight: 120 }}>
                                        <Typography variant="h4" color="primary">{stats.totalEvents || 0}</Typography>
                                        <Typography variant="caption" color="textSecondary">Total Events</Typography>
                                    </AnimatedCard>
                                </Grid>
                                <Grid item xs={12} sm={2.4}>
                                    <AnimatedCard delay={0.2} sx={{ minHeight: 120 }}>
                                        <Typography variant="h4" color="success.main">{stats.approvedEvents || 0}</Typography>
                                        <Typography variant="caption" color="textSecondary">Approved</Typography>
                                    </AnimatedCard>
                                </Grid>
                                <Grid item xs={12} sm={2.4}>
                                    <AnimatedCard delay={0.3} sx={{ minHeight: 120 }}>
                                        <Typography variant="h4" color="warning.main">{stats.pendingEvents || 0}</Typography>
                                        <Typography variant="caption" color="textSecondary">Pending</Typography>
                                    </AnimatedCard>
                                </Grid>
                                <Grid item xs={12} sm={2.4}>
                                    <AnimatedCard delay={0.4} sx={{ minHeight: 120 }}>
                                        <Typography variant="h4" sx={{ color: '#ff9800' }}>{stats.totalBookings || 0}</Typography>
                                        <Typography variant="caption" color="textSecondary">Bookings</Typography>
                                    </AnimatedCard>
                                </Grid>
                                <Grid item xs={12} sm={2.4}>
                                    <AnimatedCard delay={0.5} sx={{ minHeight: 120 }}>
                                        <Typography variant="h4" color="secondary">₹{(stats.totalRevenue || 0).toLocaleString()}</Typography>
                                        <Typography variant="caption" color="textSecondary">Total Revenue</Typography>
                                    </AnimatedCard>
                                </Grid>
                            </>
                        )}
                    </Grid>

                    <Grid container spacing={3} sx={{ mb: 8 }}>
                        <Grid item xs={12} md={8}>
                            <OrganizerAnalytics stats={stats} loading={loading} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <SmartPricingWidget category="General" capacity={500} />
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* --- TAB 1: EVENTS --- */}
            {currentTab === 1 && (
                <Box>
                    <Typography variant="h5" sx={{ mb: 3 }}>My Events</Typography>
                    {loading ? <SkeletonLoader type="table" /> : (
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Sold / Cap</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {myEvents.map((event) => (
                                        <TableRow key={event.id} hover>
                                            <TableCell>
                                                <Typography variant="subtitle2">{event.title}</Typography>
                                                <Typography variant="caption" color="textSecondary">{event.categoryName}</Typography>
                                            </TableCell>
                                            <TableCell>{new Date(event.startDateTime).toLocaleDateString()}</TableCell>
                                            <TableCell>{getStatusChip(event.status)}
                                                {event.status === 'REJECTED' && event.rejectionReason && (
                                                    <Typography variant="caption" display="block" color="error" sx={{ mt: 0.5 }}>
                                                        Reason: {event.rejectionReason}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{event.capacity - event.remainingSeats} / {event.capacity}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" color="info"><Visibility /></IconButton>
                                                <IconButton size="small" color="primary"><Edit /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {myEvents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body1" color="textSecondary">No events found.</Typography>
                                                <Button variant="text" onClick={() => navigate('/organizer/create-event')}>Create one now</Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            {/* --- TAB 2: ATTENDEES --- */}
            {currentTab === 2 && (
                <Box>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6">Select Event:</Typography>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Choose an event</MenuItem>
                                {myEvents.map((event) => (
                                    <MenuItem key={event.id} value={event.id}>{event.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {selectedEventId ? (
                        <AttendeeCheckin eventId={selectedEventId} />
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed grey' }}>
                            <People sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography>Please select an event to manage attendees.</Typography>
                        </Paper>
                    )}
                </Box>
            )}

            {/* --- TAB 3: REVIEWS & AI --- */}
            {currentTab === 3 && (
                <Box>
                    <ReviewSentimentDashboard />
                </Box>
            )}

        </Box >
    );
};

export default React.memo(OrganizerDashboard);
