import React, { useState, useEffect, useMemo } from 'react';
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
    Button,
    Chip,
    alpha,
    useTheme,
    Avatar,
    Stack,
    Grid,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    CircularProgress
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Search,
    FilterList,
    ReceiptLong,
    People,
    PendingActions,
    CurrencyRupee,
    EventNote,
    DeleteOutline
} from '@mui/icons-material';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/common/PageHeader';
import AnimatedCard from '../../components/AnimatedCard';

const OrganizerBookings = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTab, setCurrentTab] = useState(0); // 0: All, 1: Pending, 2: Confirmed, 3: Rejected/Cancelled

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/organizer/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings", error);
            Swal.fire({
                title: 'Error',
                text: 'Could not load bookings',
                icon: 'error',
                background: isDark ? '#1a1a2e' : '#fff',
                color: isDark ? '#fff' : '#000'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const stats = useMemo(() => {
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.bookingStatus === 'PENDING').length,
            confirmed: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length,
            revenue: bookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0)
        };
    }, [bookings]);

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch =
                booking.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (currentTab === 0) return true;
            if (currentTab === 1) return booking.bookingStatus === 'PENDING';
            if (currentTab === 2) return booking.bookingStatus === 'CONFIRMED';
            if (currentTab === 3) return booking.bookingStatus === 'REJECTED' || booking.bookingStatus === 'CANCELLED';
            return true;
        });
    }, [bookings, searchTerm, currentTab]);

    const handleAction = async (id, action) => {
        const result = await Swal.fire({
            title: `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}?`,
            text: `Are you sure you want to ${action} this booking?`,
            icon: action === 'approve' ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'approve' ? theme.palette.success.main : theme.palette.error.main,
            cancelButtonColor: theme.palette.grey[500],
            confirmButtonText: `Yes, ${action}!`,
            background: isDark ? '#1a1a2e' : '#fff',
            color: isDark ? '#fff' : '#000'
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/bookings/${id}/${action}`);
                Swal.fire({
                    title: 'Updated!',
                    text: `Booking ${action}ed successfully`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: isDark ? '#1a1a2e' : '#fff',
                    color: isDark ? '#fff' : '#000'
                });
                fetchBookings();
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to update booking status',
                    icon: 'error',
                    background: isDark ? '#1a1a2e' : '#fff',
                    color: isDark ? '#fff' : '#000'
                });
            }
        }
    };

    const getStatusChip = (status) => {
        const colors = {
            CONFIRMED: 'success',
            PENDING: 'warning',
            REJECTED: 'error',
            CANCELLED: 'default'
        };
        return (
            <Chip
                label={status}
                size="small"
                variant="outlined"
                color={colors[status] || 'default'}
                sx={{ fontWeight: 'bold', borderRadius: '6px' }}
            />
        );
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    if (loading && bookings.length === 0) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">Loading bookings...</Typography>
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <PageHeader
                    title="Manage Bookings"
                    subtitle="Track and validate attendee bookings for your events"
                    icon={<ReceiptLong sx={{ fontSize: 35 }} />}
                />

                {/* Summary Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AnimatedCard delay={0.1}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                                    <EventNote />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">{stats.total}</Typography>
                                    <Typography variant="caption" color="text.secondary">Total Bookings</Typography>
                                </Box>
                            </Stack>
                        </AnimatedCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AnimatedCard delay={0.2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                                    <PendingActions />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" color="warning.main">{stats.pending}</Typography>
                                    <Typography variant="caption" color="text.secondary">Awaiting Approval</Typography>
                                </Box>
                            </Stack>
                        </AnimatedCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AnimatedCard delay={0.3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                                    <CheckCircle />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" color="success.main">{stats.confirmed}</Typography>
                                    <Typography variant="caption" color="text.secondary">Confirmed Entries</Typography>
                                </Box>
                            </Stack>
                        </AnimatedCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AnimatedCard delay={0.4}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main' }}>
                                    <CurrencyRupee />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">₹{stats.revenue.toLocaleString()}</Typography>
                                    <Typography variant="caption" color="text.secondary">Total Collected</Typography>
                                </Box>
                            </Stack>
                        </AnimatedCard>
                    </Grid>
                </Grid>

                {/* Filters and Search */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 0 }}>
                        <Tab label="All" />
                        <Tab label="Pending" />
                        <Tab label="Confirmed" />
                        <Tab label="Archived" />
                    </Tabs>
                    <TextField
                        size="small"
                        placeholder="Search ticket, event or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>

                {/* Bookings Table */}
                <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: theme.shadows[4], border: `1px solid ${theme.palette.divider}` }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Attendee Details</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Event Information</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Booking Details</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Booking Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AnimatePresence>
                                    {filteredBookings.map((booking, index) => (
                                        <TableRow
                                            component={motion.tr}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            layout
                                            key={booking.id}
                                            hover
                                        >
                                            <TableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main' }}>
                                                        {booking.userName?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">{booking.userName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{booking.userEmail}</Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="600">{booking.eventTitle}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EventNote fontSize="inherit" /> {new Date(booking.eventStartDateTime).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                                        #{booking.ticketNumber?.split('-')[0]}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        {booking.numberOfPersons} {booking.numberOfPersons > 1 ? 'People' : 'Person'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2" fontWeight="700">₹{booking.advancePaid?.toLocaleString()}</Typography>
                                                    <Chip
                                                        label={booking.paymentStatus}
                                                        size="small"
                                                        variant="filled"
                                                        color={booking.paymentStatus === 'PAID' ? 'success' : 'warning'}
                                                        sx={{ fontSize: '0.6rem', height: 18 }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusChip(booking.bookingStatus)}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                    {booking.bookingStatus === 'PENDING' ? (
                                                        <>
                                                            <Tooltip title="Approve Booking">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleAction(booking.id, 'approve')}
                                                                    sx={{ color: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.1) }}
                                                                >
                                                                    <CheckCircle fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Reject Booking">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleAction(booking.id, 'reject')}
                                                                    sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) }}
                                                                >
                                                                    <Cancel fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <Typography variant="caption" color="text.disabled">No actions</Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </AnimatePresence>
                                {filteredBookings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 10 }}>
                                            <People sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="h6" color="text.disabled">No bookings found</Typography>
                                            <Typography variant="body2" color="text.disabled">Try adjusting your filters or search term</Typography>
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

export default OrganizerBookings;
