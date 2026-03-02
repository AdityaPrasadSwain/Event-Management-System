import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, Button, Paper, Chip, Divider, CircularProgress, IconButton, Avatar, Rating } from '@mui/material';
import { CalendarToday, LocationOn, CurrencyRupee, People, ArrowBack, Share, Favorite, FavoriteBorder, Star, AutoAwesome } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { useWishlist } from '../../context/WishlistContext';
import BookingModal from '../../components/user/BookingModal';


const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();


    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Use public endpoint matching BrowseEvents
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details", error);

                let errorMessage = "Event not found";
                if (error.response) {
                    errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
                }

                Swal.fire("Error", errorMessage, "error");
                navigate('/user/browse');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    const handleConfirmBooking = async (seatCount, paidAmount) => {
        setBookingLoading(true);
        try {
            const payload = {
                eventId: parseInt(id),
                numberOfPersons: seatCount,
                advancePaid: paidAmount
            };

            await api.post('/bookings/create', payload);

            Swal.fire({
                icon: 'success',
                title: 'Booking Confirmed!',
                text: seatCount > 1
                    ? `Successfully booked ${seatCount} tickets.`
                    : 'Your ticket has been booked successfully.',
                background: '#1e1e1e',
                color: '#fff'
            });
            setIsModalOpen(false);
            navigate('/user/bookings');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Booking Failed',
                text: error.response?.data?.message || 'Could not book ticket',
                background: '#1e1e1e',
                color: '#fff'
            });
        } finally {
            setBookingLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        Swal.fire({
            icon: 'info',
            title: 'Link Copied',
            text: 'Event link copied to clipboard',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const isWishlisted = event ? isInWishlist(event.id) : false;

    const handleWishlistToggle = () => {
        if (isWishlisted) {
            removeFromWishlist(event.id);
            // Notification handled by backend or optional UI toast
        } else {
            addToWishlist(event);
            // Notification handled by backend or optional UI toast
        }
    };

    // Mock Reviews
    const reviews = [
        { id: 1, user: 'Alice M.', rating: 5, comment: 'Absolutely amazing event! Well organized.', date: '2 days ago' },
        { id: 2, user: 'John D.', rating: 4, comment: 'Great speakers, but venue was a bit crowded.', date: '1 week ago' },
    ];

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center', bgcolor: '#121212' }}><CircularProgress /></Box>;
    if (!event) return null;

    return (
        <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }} color="secondary">
                Back to Events
            </Button>

            <Grid container spacing={4}>
                {/* Left Column: Image & Details */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 0,
                            borderRadius: 4,
                            overflow: 'hidden',
                            bgcolor: 'background.paper',
                            mb: 4
                        }}
                    >
                        <Box sx={{ height: 400, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {event.imageUrls && event.imageUrls.length > 0 ? (
                                <Box
                                    component="img"
                                    src={event.imageUrls[0]}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Typography variant="h1" sx={{ opacity: 0.1 }}>📸</Typography>
                            )}
                        </Box>

                        {event.imageUrls && event.imageUrls.length > 1 && (
                            <Box sx={{ p: 2, display: 'flex', gap: 2, overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                {event.imageUrls.map((url, idx) => (
                                    <Box
                                        key={idx}
                                        component="img"
                                        src={url}
                                        sx={{
                                            width: 100,
                                            height: 80,
                                            borderRadius: 2,
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: idx === 0 ? '2px solid' : 'none',
                                            borderColor: 'primary.main'
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                        <Box sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Chip label={event.categoryName || 'General'} color="secondary" size="small" sx={{ mb: 1 }} />
                                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton onClick={handleShare} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                        <Share />
                                    </IconButton>
                                    <IconButton onClick={handleWishlistToggle} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                        {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder color="primary" />}
                                    </IconButton>
                                </Box>
                            </Box>

                            <Box sx={{ my: 4 }}>
                                <Typography variant="h6" gutterBottom>About this event</Typography>
                                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                    {event.description || 'Join us for an unforgettable experience. Use the "Book Ticket" button to secure your spot now!'}
                                </Typography>
                            </Box>

                            {/* AI Summary Section */}
                            {event.aiSummary && (
                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(187, 134, 252, 0.08)', borderRadius: 2, mb: 4, border: '1px dashed rgba(187, 134, 252, 0.3)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <AutoAwesome fontSize="small" color="secondary" sx={{ mr: 1 }} />
                                        <Typography variant="subtitle2" color="secondary" fontWeight="bold">AI Summary</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.aiSummary}
                                    </Typography>
                                </Paper>
                            )}

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="h5" gutterBottom>Reviews</Typography>
                            <Box sx={{ mt: 2 }}>
                                {reviews.map((review) => (
                                    <Paper key={review.id} elevation={0} sx={{ p: 2, bgcolor: 'action.hover', mb: 2, borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography fontWeight="bold">{review.user}</Typography>
                                            <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                                        </Box>
                                        <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                                        <Typography variant="body2">{review.comment}</Typography>
                                    </Paper>
                                ))}
                            </Box>

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="h5" gutterBottom>You might also like</Typography>
                            <Grid container spacing={2}>
                                {event.categoryName && [1, 2, 3].map((val) => (
                                    <Grid item xs={12} sm={4} key={val}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                bgcolor: 'rgba(255,255,255,0.03)',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                                            }}
                                            onClick={() => navigate('/user/browse')}
                                        >
                                            <Box sx={{ height: 100, bgcolor: 'rgba(255,255,255,0.1)', mb: 1, borderRadius: 1 }} />
                                            <Typography variant="subtitle2" align="center">Similar Event {val}</Typography>
                                            <Typography variant="caption" display="block" align="center" color="text.secondary">
                                                In {event.categoryName}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column: Sticky Booking Card */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 100, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="h5" gutterBottom sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1, mb: 3 }}>
                            Event Details
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: 'primary.main', mr: 2 }}>
                                    <CalendarToday />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Date & Time</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {new Date(event.startDateTime).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: 'primary.main', mr: 2 }}>
                                    <LocationOn />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Location</Typography>
                                    <Typography variant="body1" fontWeight="bold">{event.location}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: 'primary.main', mr: 2 }}>
                                    <People />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Availability</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {event.remainingSeats} / {event.capacity} seats left
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><CurrencyRupee fontSize="large" />{event.pricePerPerson}</Typography>
                                <Typography variant="caption" color="text.secondary">per person</Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={() => setIsModalOpen(true)}
                                disabled={bookingLoading || event.remainingSeats <= 0}
                                sx={{ height: 56, fontSize: '1.2rem', borderRadius: 3, textTransform: 'none' }}
                            >
                                {bookingLoading ? <CircularProgress size={24} color="inherit" /> : (event.remainingSeats > 0 ? 'Book Ticket' : 'Sold Out')}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <BookingModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={event}
                onConfirm={handleConfirmBooking}
                loading={bookingLoading}
            />
        </Container>
    );
};

export default EventDetails;
