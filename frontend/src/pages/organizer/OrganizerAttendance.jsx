import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Avatar,
    Stack,
    CircularProgress,
    Alert,
    useTheme,
    alpha,
    Snackbar
} from '@mui/material';
import { CheckCircle, Cancel, Person, Event as EventIcon, People as PeopleIcon } from '@mui/icons-material';
import api from '../../services/api';
import Swal from 'sweetalert2';

const OrganizerAttendance = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [bookings, setBookings] = useState([]); // Bookings with attendance data
    const [loading, setLoading] = useState(false);
    const [marking, setMarking] = useState(null); // ID of booking being marked

    // Notification State
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            fetchEventAttendance();
        }
    }, [selectedEventId]);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/organizer/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchEventAttendance = async () => {
        setLoading(true);
        try {
            const response = await api.get('/organizer/bookings');

            // Filter by event and CONFIRMED status
            const eventBookings = response.data.filter(b =>
                b.eventId === selectedEventId && b.bookingStatus === 'CONFIRMED'
            );

            setBookings(eventBookings);

        } catch (error) {
            console.error('Error fetching bookings:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch bookings',
                icon: 'error',
                background: isDark ? '#1a1a2e' : '#fff',
                color: isDark ? '#fff' : '#000'
            });
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async (bookingId, status) => {
        setMarking(bookingId);
        try {
            const response = await api.post('/organizer/attendance/mark', {
                bookingId,
                status
            });

            // Update local state
            setBookings(prev => prev.map(b => {
                if (b.id === bookingId) {
                    return { ...b, attendanceStatus: response.data.status }; // Update attendance status
                }
                return b;
            }));

            // Show positioning-aware notification
            setSnackbar({
                open: true,
                message: `Marked attendee as ${status}`,
                severity: status === 'PRESENT' ? 'success' : 'error'
            });

        } catch (error) {
            console.error('Error marking attendance:', error);
            setSnackbar({
                open: true,
                message: 'Failed to mark attendance',
                severity: 'error'
            });
        } finally {
            setMarking(null);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Top Right Notification (Under Navbar) */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    top: '80px !important', // Position under navbar
                    right: { xs: '16px !important', sm: '24px !important' },
                    zIndex: 9999
                }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="outlined"
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
                        fontWeight: 700,
                        backdropFilter: 'blur(12px)',
                        bgcolor: alpha(theme.palette.background.paper, 0.95),
                        color: snackbar.severity === 'success'
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                        border: '2px solid',
                        borderColor: snackbar.severity === 'success'
                            ? alpha(theme.palette.success.main, 0.5)
                            : alpha(theme.palette.error.main, 0.5),
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success'
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                    <CheckCircle />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Attendee Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track and mark attendance for your events
                    </Typography>
                </Box>
            </Box>

            <Paper sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)',
                border: '1px solid',
                borderColor: theme.palette.divider,
                bgcolor: theme.palette.background.paper
            }}>
                <FormControl fullWidth>
                    <InputLabel>Select Event to Manage</InputLabel>
                    <Select
                        value={selectedEventId}
                        label="Select Event to Manage"
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        sx={{ borderRadius: 2 }}
                    >
                        {events.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventIcon fontSize="small" color="action" />
                                    {event.title}
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        ({new Date(event.startDateTime).toLocaleDateString()})
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {selectedEventId && (
                <Paper sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    bgcolor: theme.palette.background.paper
                }}>
                    {loading ? (
                        <Box sx={{ p: 8, textAlign: 'center' }}>
                            <CircularProgress size={40} thickness={4} />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Loading attendee list...
                            </Typography>
                        </Box>
                    ) : bookings.length === 0 ? (
                        <Box sx={{ p: 8, textAlign: 'center' }}>
                            <Avatar sx={{ w: 60, h: 60, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                                <PeopleIcon fontSize="large" />
                            </Avatar>
                            <Typography variant="h6" fontWeight="600">
                                No Attendees Yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Once you have confirmed bookings, they will appear here.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: isDark ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.02) }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Attendee Details</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Ticket Info</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">Seats</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Attendance Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">Mark Attendance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {booking.userName?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="700">
                                                            {booking.userName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {booking.userEmail}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'Monospace', fontWeight: 600 }}>
                                                    #{booking.ticketNumber.substring(0, 8).toUpperCase()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={booking.seatCount}
                                                    size="small"
                                                    sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {booking.attendanceStatus === 'PRESENT' ? (
                                                    <Chip
                                                        icon={<CheckCircle sx={{ fontSize: '1rem !important' }} />}
                                                        label="Present"
                                                        color="success"
                                                        size="small"
                                                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                                                    />
                                                ) : booking.attendanceStatus === 'ABSENT' ? (
                                                    <Chip
                                                        icon={<Cancel sx={{ fontSize: '1rem !important' }} />}
                                                        label="Absent"
                                                        color="error"
                                                        size="small"
                                                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Not Marked"
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ fontWeight: 500, borderRadius: 1.5, borderStyle: 'dashed' }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Button
                                                        variant={booking.attendanceStatus === 'PRESENT' ? 'contained' : 'outlined'}
                                                        color="success"
                                                        size="small"
                                                        onClick={() => markAttendance(booking.id, 'PRESENT')}
                                                        disabled={marking === booking.id || booking.attendanceStatus === 'PRESENT'}
                                                        sx={{
                                                            borderRadius: 2,
                                                            minWidth: 90,
                                                            boxShadow: booking.attendanceStatus === 'PRESENT' ? theme.shadows[2] : 'none'
                                                        }}
                                                    >
                                                        Present
                                                    </Button>
                                                    <Button
                                                        variant={booking.attendanceStatus === 'ABSENT' ? 'contained' : 'outlined'}
                                                        color="error"
                                                        size="small"
                                                        onClick={() => markAttendance(booking.id, 'ABSENT')}
                                                        disabled={marking === booking.id || booking.attendanceStatus === 'ABSENT'}
                                                        sx={{
                                                            borderRadius: 2,
                                                            minWidth: 90,
                                                            boxShadow: booking.attendanceStatus === 'ABSENT' ? theme.shadows[2] : 'none'
                                                        }}
                                                    >
                                                        Absent
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default OrganizerAttendance;
