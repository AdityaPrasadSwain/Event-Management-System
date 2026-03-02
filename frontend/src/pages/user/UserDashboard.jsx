import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    CircularProgress,
    Avatar,
    LinearProgress,
    useTheme,
    alpha
} from '@mui/material';
import {
    Event as EventIcon,
    BookOnline as BookingIcon,
    Favorite as FavoriteIcon,
    ConfirmationNumber as TicketIcon,
    TrendingUp as TrendingIcon,
    CalendarToday as CalendarIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingEvents: 0,
        wishlistCount: 0
    });
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch bookings
            const bookingsRes = await api.get('/user/bookings');
            const bookings = bookingsRes.data || [];

            // Calculate stats
            const now = new Date();
            const upcoming = bookings.filter(b =>
                b.event && new Date(b.event.startDateTime) > now
            );

            setStats({
                totalBookings: bookings.length,
                upcomingEvents: upcoming.length,
                wishlistCount: 0 // Will be updated when wishlist endpoint is called
            });

            // Set recent bookings (last 5)
            setRecentBookings(bookings.slice(0, 5));

            // Set upcoming events (booked)
            setUpcomingEvents(upcoming.slice(0, 3));

            // Fetch generic upcoming events for recommendations
            try {
                const publicEventsRes = await api.get('/events');
                if (Array.isArray(publicEventsRes.data)) {
                    setRecommendedEvents(publicEventsRes.data.slice(0, 4));
                }
            } catch (err) {
                console.error("Failed to fetch recommended events", err);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                background: gradient,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" fontWeight="700" color="white">
                        {value}
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)', width: 56, height: 56 }}>
                    <Icon sx={{ color: 'white', fontSize: 30 }} />
                </Avatar>
            </Box>
        </Paper>
    );

    const EventCard = ({ booking, event: propEvent }) => {
        const event = propEvent || booking?.event;
        if (!event) return null;

        return (
            <Card
                elevation={0}
                sx={{
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4]
                    }
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight="600">
                            {event.title}
                        </Typography>
                        {booking && (
                            <Chip
                                label={booking.checkIn ? "Checked In" : "Booked"}
                                size="small"
                                color={booking.checkIn ? "success" : "primary"}
                            />
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {new Date(event.startDateTime).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {new Date(event.startDateTime).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {event.location}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        onClick={() => navigate(`/user/events/${event.id}`)}
                    >
                        View Details
                    </Button>
                    <Button
                        size="small"
                        color="secondary"
                        onClick={() => navigate('/user/bookings')}
                    >
                        My Tickets
                    </Button>
                </CardActions>
            </Card>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl">
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                    Welcome back, {user?.name || 'User'}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's what's happening with your events
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Bookings"
                        value={stats.totalBookings}
                        icon={BookingIcon}
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Upcoming Events"
                        value={stats.upcomingEvents}
                        icon={EventIcon}
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Wishlist Items"
                        value={stats.wishlistCount}
                        icon={FavoriteIcon}
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    />
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Upcoming Events */}
                <Grid item xs={12} lg={8}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="600">
                                Upcoming Events
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate('/user/bookings')}
                            >
                                View All
                            </Button>
                        </Box>

                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map((booking) => (
                                <EventCard key={booking.id} booking={booking} />
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <TicketIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No Upcoming Events
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Explore and book exciting events happening near you
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/user/browse')}
                                >
                                    Browse Events
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    {/* Recommended Events Section (New) */}
                    {recommendedEvents.length > 0 && (
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="600">
                                    Recommended For You
                                </Typography>
                                <Button size="small" onClick={() => navigate('/user/browse')}>
                                    Browse All
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {recommendedEvents.map((event) => (
                                    <Grid item xs={12} key={event.id}>
                                        <EventCard event={event} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    )}
                </Grid>

                {/* Quick Actions & Info */}
                <Grid item xs={12} lg={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                        }}
                    >
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<EventIcon />}
                                onClick={() => navigate('/user/browse')}
                            >
                                Browse Events
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<BookingIcon />}
                                onClick={() => navigate('/user/bookings')}
                            >
                                My Bookings
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<FavoriteIcon />}
                                onClick={() => navigate('/user/wishlist')}
                            >
                                View Wishlist
                            </Button>
                        </Box>
                    </Paper>

                    {/* Recent Activity */}
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Recent Activity
                        </Typography>
                        {recentBookings.length > 0 ? (
                            <Box sx={{ mt: 2 }}>
                                {recentBookings.map((booking) => (
                                    <Box
                                        key={booking.id}
                                        sx={{
                                            py: 2,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            '&:last-child': { borderBottom: 'none' }
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="500">
                                            {booking.event?.title || 'Event'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                No recent activity
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default UserDashboard;
