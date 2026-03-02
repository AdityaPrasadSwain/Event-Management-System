import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Tabs, Tab, CircularProgress, Paper, useTheme } from '@mui/material';
import BookingTicket from '../../components/user/BookingTicket';
import api from '../../services/api';
import Swal from 'sweetalert2';

const Bookings = () => {
    const theme = useTheme();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/user/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel Booking?',
            text: "Are you sure you want to cancel this booking? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            background: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/bookings/${id}/cancel`);
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your booking has been cancelled.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fff',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                });
                fetchBookings(); // Refresh list
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to cancel booking',
                    icon: 'error',
                    background: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fff',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                });
            }
        }
    };

    const filterBookings = (status) => {
        const now = new Date();
        return bookings.filter(booking => {
            if (!booking.eventId) return false;

            // const eventDate = new Date(booking.eventStartDateTime); // Logic based on status rather than date for tabs?
            // "Upcoming", "Past", "Cancelled"
            // "Upcoming" -> CONFIRMED/PENDING and Date >= Now
            // "Past" -> Date < Now and not CANCELLED
            // "Cancelled" -> CANCELLED/REJECTED

            const eventDate = new Date(booking.eventStartDateTime);

            if (status === 'UPCOMING') {
                return eventDate >= now && (booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'PENDING');
            } else if (status === 'COMPLETED') {
                return eventDate < now && booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'REJECTED';
            } else if (status === 'CANCELLED') {
                return booking.bookingStatus === 'CANCELLED' || booking.bookingStatus === 'REJECTED';
            }
            return true;
        });
    };

    const getDisplayedBookings = () => {
        switch (tabValue) {
            case 0: return filterBookings('UPCOMING');
            case 1: return filterBookings('COMPLETED');
            case 2: return filterBookings('CANCELLED');
            default: return [];
        }
    };

    const displayedBookings = getDisplayedBookings();

    return (
        <Container maxWidth="lg" sx={{ pt: 3, pb: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>My Bookings</Typography>

            <Paper sx={{ mb: 4, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Upcoming" />
                    <Tab label="Past Events" />
                    <Tab label="Cancelled" />
                </Tabs>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {displayedBookings.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', opacity: 0.7 }}>
                            <Typography variant="h6">No bookings found in this category.</Typography>
                        </Paper>
                    ) : (
                        displayedBookings.map((booking) => (
                            <BookingTicket key={booking.id} booking={booking} onCancel={handleCancel} />
                        ))
                    )}
                </Box>
            )}
        </Container>
    );
};

export default Bookings;
