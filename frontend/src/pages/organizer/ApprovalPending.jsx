import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ApprovalPending = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(false);

    const checkStatus = async () => {
        setLoading(true);
        try {
            const response = await api.get('/organizer/status');
            const currentStatus = response.data.status;
            setStatus(currentStatus);

            if (currentStatus === 'APPROVED') {
                // Determine redirect based on role, though usually organizer
                navigate('/organizer/dashboard');
            }
        } catch (error) {
            console.error("Error checking status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial check
        checkStatus();
    }, []);

    return (
        <Container component="main" maxWidth="md" sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Paper elevation={3} sx={{
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2
            }}>
                {status === 'APPROVED' ? (
                    <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                ) : status === 'REJECTED' ? (
                    <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
                ) : (
                    <AccessTimeIcon color="warning" sx={{ fontSize: 80, mb: 2 }} />
                )}

                <Typography component="h1" variant="h4" gutterBottom>
                    {status === 'APPROVED' ? 'Application Approved!' :
                        status === 'REJECTED' ? 'Application Rejected' :
                            'Approval Pending'}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    {status === 'APPROVED' ? (
                        "Your organizer account has been approved. You can now access the dashboard and create events."
                    ) : status === 'REJECTED' ? (
                        "We're sorry, but your organizer application has been rejected. Please contact support for more information."
                    ) : (
                        "Your application is under process by admin. Please wait 12–48 hours for approval."
                    )}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={logout}
                    >
                        Logout
                    </Button>

                    {status === 'APPROVED' && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => navigate('/organizer/dashboard')}
                        >
                            Go to Dashboard
                        </Button>
                    )}

                    {status === 'PENDING' && (
                        <Button
                            variant="contained"
                            onClick={checkStatus}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            Check Status
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ApprovalPending;
