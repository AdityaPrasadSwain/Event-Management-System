import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, TextField, InputAdornment } from '@mui/material';
import { Search, CheckCircle, Cancel, Print } from '@mui/icons-material';
import api from '../../services/api'; // Assuming you have an API service

const AttendeeCheckin = ({ eventId }) => {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock API call to fetch attendees
        // In real app: api.get(`/organizer/events/${eventId}/attendees`)
        setTimeout(() => {
            setAttendees([
                { id: 1, name: 'John Doe', email: 'john@example.com', ticketId: 'TKT-001', status: 'CHECKED_IN' },
                { id: 2, name: 'Alice Smith', email: 'alice@example.com', ticketId: 'TKT-002', status: 'PENDING' },
                { id: 3, name: 'Bob Johnson', email: 'bob@example.com', ticketId: 'TKT-003', status: 'PENDING' },
            ]);
            setLoading(false);
        }, 1000);
    }, [eventId]);

    const handleCheckIn = (id) => {
        setAttendees(prev => prev.map(a =>
            a.id === id ? { ...a, status: a.status === 'CHECKED_IN' ? 'PENDING' : 'CHECKED_IN' } : a
        ));
        // api.post(`/organizer/attendees/${id}/check-in`)
    };

    const filteredAttendees = attendees.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Attendee List</Typography>
                <Button startIcon={<Print />} variant="outlined" size="small">Export CSV</Button>
            </Box>

            <TextField
                fullWidth
                placeholder="Search by name or ticket ID"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                }}
                sx={{ mb: 3 }}
            />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Ticket ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAttendees.map((attendee) => (
                            <TableRow key={attendee.id}>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{attendee.name}</Typography>
                                    <Typography variant="caption" color="textSecondary">{attendee.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={attendee.ticketId} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={attendee.status === 'CHECKED_IN' ? 'Checked In' : 'Pending'}
                                        color={attendee.status === 'CHECKED_IN' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant={attendee.status === 'CHECKED_IN' ? 'outlined' : 'contained'}
                                        color={attendee.status === 'CHECKED_IN' ? 'warning' : 'success'}
                                        onClick={() => handleCheckIn(attendee.id)}
                                        startIcon={attendee.status === 'CHECKED_IN' ? <Cancel /> : <CheckCircle />}
                                    >
                                        {attendee.status === 'CHECKED_IN' ? 'Undo' : 'Check In'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AttendeeCheckin;
