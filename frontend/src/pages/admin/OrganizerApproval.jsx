// Organizer Approval Page (Admin)
// Approve or reject organizer applications

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import Swal from 'sweetalert2';
import PageHeader from '../../components/common/PageHeader';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import EmptyState from '../../components/common/EmptyState';

const OrganizerApproval = () => {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrganizer, setSelectedOrganizer] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchPendingOrganizers();
    }, []);

    const fetchPendingOrganizers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/admin/organizers/pending');
            setOrganizers(response.data);
        } catch (err) {
            console.error('Error fetching organizers:', err);
            setError(err.response?.data?.message || 'Failed to load organizer applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (organizerId) => {
        try {
            // Updated to use POST endpoint as per AdminController
            await api.post(`/admin/organizers/${organizerId}/approve`);

            // Success message
            Swal.fire({
                icon: 'success',
                title: 'Organizer Approved',
                text: 'The organizer has been approved successfully',
                background: '#1e1e1e',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });

            // Remove from list
            setOrganizers((prev) => prev.filter((org) => org.id !== organizerId));

            setDialogOpen(false);
            setSelectedOrganizer(null);
        } catch (err) {
            console.error('Error approving organizer:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Approve Organizer',
                text: err.response?.data?.message || 'The approval endpoint is not yet implemented on the backend. Please check the network tab for details.',
                background: '#1e1e1e',
                color: '#fff'
            });
        }
    };

    const handleReject = async (organizerId) => {
        try {
            // Updated to use POST endpoint as per AdminController
            await api.post(`/admin/organizers/${organizerId}/reject`);

            // Success message
            Swal.fire({
                icon: 'success',
                title: 'Organizer Rejected',
                text: 'The organizer application has been rejected',
                background: '#1e1e1e',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });

            // Remove from list
            setOrganizers((prev) => prev.filter((org) => org.id !== organizerId));

            setDialogOpen(false);
            setSelectedOrganizer(null);
        } catch (err) {
            console.error('Error rejecting organizer:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Reject Organizer',
                text: err.response?.data?.message || 'The rejection endpoint is not yet implemented on the backend. Please check the network tab for details.',
                background: '#1e1e1e',
                color: '#fff'
            });
        }
    };

    const handleViewDetails = (organizer) => {
        setSelectedOrganizer(organizer);
        setDialogOpen(true);
    };

    if (loading) {
        return <LoadingScreen message="Loading organizer applications..." />;
    }

    if (error) {
        return (
            <ErrorDisplay
                title="Error Loading Organizers"
                message={error}
                onRetry={fetchPendingOrganizers}
            />
        );
    }

    return (
        <Box>
            {/* Page Header */}
            <PageHeader
                title="Organizer Approval"
                subtitle="Review and approve organizer applications"
            />

            {/* Alert */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Review organizer applications carefully before approval. Approved organizers can create and manage events.
            </Alert>

            {/* Organizers Table */}
            {organizers.length > 0 ? (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Organizer</TableCell>
                                    <TableCell>Organization</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Applied Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {organizers.map((organizer) => (
                                    <TableRow key={organizer.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                    {organizer.name[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {organizer.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {organizer.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{organizer.organizerProfile?.organizationName || 'N/A'}</TableCell>
                                        <TableCell>{organizer.organizerProfile?.contactNumber || 'N/A'}</TableCell>
                                        <TableCell>
                                            {organizer.organizerProfile?.applyDate
                                                ? new Date(organizer.organizerProfile.applyDate).toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={organizer.organizerProfile?.approvalStatus || 'PENDING'} size="small" color="warning" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                color="info"
                                                onClick={() => handleViewDetails(organizer)}
                                            >
                                                <InfoIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => handleApprove(organizer.id)}
                                            >
                                                <ApproveIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleReject(organizer.id)}
                                            >
                                                <RejectIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ) : (
                <EmptyState
                    title="No Pending Applications"
                    description="There are no organizer applications waiting for approval."
                />
            )}

            {/* Details Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Organizer Details</DialogTitle>
                <DialogContent>
                    {selectedOrganizer && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Name
                                </Typography>
                                <Typography variant="body1">{selectedOrganizer.name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography variant="body1">{selectedOrganizer.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Phone
                                </Typography>
                                <Typography variant="body1">{selectedOrganizer.organizerProfile?.contactNumber || 'N/A'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Organization
                                </Typography>
                                <Typography variant="body1">{selectedOrganizer.organizerProfile?.organizationName || 'N/A'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Applied Date
                                </Typography>
                                <Typography variant="body1">
                                    {selectedOrganizer.organizerProfile?.applyDate
                                        ? new Date(selectedOrganizer.organizerProfile.applyDate).toLocaleString()
                                        : 'N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    {selectedOrganizer && (
                        <>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<RejectIcon />}
                                onClick={() => handleReject(selectedOrganizer.id)}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleApprove(selectedOrganizer.id)}
                            >
                                Approve
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrganizerApproval;
