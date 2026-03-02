import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Button,
    CircularProgress,
    alpha,
    useTheme,
    Tooltip,
    Avatar,
    Stack
} from '@mui/material';
import {
    Edit,
    Delete,
    Visibility,
    Add,
    CalendarMonth,
    LocationOn,
    People,
    CurrencyRupee,
    Event as EventIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const MyEvents = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyEvents = async () => {
        try {
            const response = await api.get('/organizer/events');
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events", error);
            Swal.fire({
                title: "Error",
                text: "Could not load your events",
                icon: "error",
                background: isDark ? '#1a1a2e' : '#fff',
                color: isDark ? '#fff' : '#000'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            background: isDark ? '#1a1a2e' : '#fff',
            color: isDark ? '#fff' : '#000'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/organizer/events/${id}`);
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your event has been cancelled.',
                    icon: 'success',
                    background: isDark ? '#1a1a2e' : '#fff',
                    color: isDark ? '#fff' : '#000'
                });
                fetchMyEvents(); // Refresh list
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to cancel event',
                    icon: 'error',
                    background: isDark ? '#1a1a2e' : '#fff',
                    color: isDark ? '#fff' : '#000'
                });
            }
        }
    };

    const getStatusChip = (status) => {
        const colors = {
            'APPROVED': 'success',
            'PENDING': 'warning',
            'REJECTED': 'error',
            'CANCELLED': 'default',
            'UPCOMING': 'info',
            'LIVE': 'primary'
        };
        return (
            <Chip
                label={status}
                sx={{
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    borderRadius: '6px'
                }}
                color={colors[status] || 'default'}
                size="small"
                variant="outlined"
            />
        );
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Fetching your events...
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 4,
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            width: 56,
                            height: 56
                        }}>
                            <EventIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="800" sx={{
                                background: 'linear-gradient(45deg, #6366f1 30%, #a855f7 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                My Events
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Manage and track all your published events
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/organizer/create-event')}
                        sx={{
                            borderRadius: '14px',
                            px: 3,
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: '600',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Create New Event
                    </Button>
                </Box>

                {/* Table Container */}
                <Paper
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        bgcolor: theme.palette.background.paper
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead sx={{
                                bgcolor: isDark
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : alpha(theme.palette.primary.main, 0.02)
                            }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Event Details</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Pricing</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Availability</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow
                                        key={event.id}
                                        hover
                                        sx={{
                                            transition: 'background-color 0.2s',
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar
                                                    src={event.imageUrls?.[0]}
                                                    variant="rounded"
                                                    sx={{ width: 45, height: 45, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                                                >
                                                    {event.title?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="700">
                                                        {event.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {event.categoryName}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                                                <CalendarMonth fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                                <Typography variant="body2">
                                                    {new Date(event.startDateTime).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                                                <LocationOn fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body2" fontWeight="700" color="primary.main">
                                                    ₹{event.pricePerPerson}
                                                </Typography>
                                                {event.minimumAdvancePercent < 100 && (
                                                    <Typography variant="caption" color="warning.main" fontWeight="600">
                                                        Min: {event.minimumAdvancePercent}%
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                                <People fontSize="small" />
                                                <Typography variant="body2" fontWeight="500">
                                                    {event.remainingSeats} / {event.capacity}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusChip(event.status)}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                <Tooltip title="View Event">
                                                    <IconButton size="small" onClick={() => navigate(`/user/events/${event.id}`)}>
                                                        <Visibility fontSize="small" sx={{ color: theme.palette.info.main }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Cancel Event">
                                                    <IconButton size="small" onClick={() => handleDelete(event.id)}>
                                                        <Delete fontSize="small" sx={{ color: theme.palette.error.main }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {events.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 10 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ width: 64, height: 64, bgcolor: alpha(theme.palette.action.disabled, 0.1), color: theme.palette.text.disabled }}>
                                                    <EventIcon fontSize="large" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="600" color="text.secondary">
                                                        No Events Found
                                                    </Typography>
                                                    <Typography variant="body2" color="text.disabled">
                                                        You haven't created any events yet. Start now!
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => navigate('/organizer/create-event')}
                                                    sx={{ mt: 1, borderRadius: 2 }}
                                                >
                                                    Create First Event
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default MyEvents;
