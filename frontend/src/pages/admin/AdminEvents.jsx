import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Button
} from '@mui/material';
import { CheckCircle, Cancel, Pending } from '@mui/icons-material';
import Swal from 'sweetalert2';
import api from '../../services/api';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/admin/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (eventId) => {
        try {
            await api.put(`/admin/events/${eventId}/approve`);
            Swal.fire({
                icon: 'success',
                title: 'Event Approved!',
                text: 'The event has been approved successfully',
                background: '#1e1e1e',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });
            fetchEvents();
        } catch (error) {
            console.error('Error approving event:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Approve Event',
                text: error.response?.data?.message || 'An error occurred while approving the event',
                background: '#1e1e1e',
                color: '#fff'
            });
        }
    };

    const handleReject = async (eventId) => {
        try {
            await api.put(`/admin/events/${eventId}/reject`);
            Swal.fire({
                icon: 'success',
                title: 'Event Rejected',
                text: 'The event has been rejected',
                background: '#1e1e1e',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });
            fetchEvents();
        } catch (error) {
            console.error('Error rejecting event:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Reject Event',
                text: error.response?.data?.message || 'An error occurred while rejecting the event',
                background: '#1e1e1e',
                color: '#fff'
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'LIVE':
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'REJECTED':
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'LIVE':
            case 'COMPLETED':
                return <CheckCircle fontSize="small" />;
            case 'PENDING':
                return <Pending fontSize="small" />;
            case 'REJECTED':
            case 'CANCELLED':
                return <Cancel fontSize="small" />;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Event Management
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Category</strong></TableCell>
                                <TableCell><strong>Organizer</strong></TableCell>
                                <TableCell><strong>Location</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.id}</TableCell>
                                    <TableCell>{event.title}</TableCell>
                                    <TableCell>{event.categoryName || 'N/A'}</TableCell>
                                    <TableCell>{event.organizerName || 'Unknown'}</TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={getStatusIcon(event.status)}
                                            label={event.status}
                                            color={getStatusColor(event.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {event.status === 'PENDING' && (
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleApprove(event.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleReject(event.id)}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AdminEvents;
