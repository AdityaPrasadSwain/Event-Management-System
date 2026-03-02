import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { LockPerson, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoBack = () => {
        if (user) {
            const role = user.role;
            const roles = (Array.isArray(role) ? role : [role]).map(r => r.replace('ROLE_', ''));

            if (roles.some(r => r.toUpperCase() === 'ADMIN')) navigate('/admin/dashboard');
            else if (roles.some(r => r.toUpperCase() === 'ORGANIZER')) navigate('/organizer/dashboard');
            else navigate('/user/browse');
        } else {
            navigate('/login');
        }
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center'
                }}
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <LockPerson sx={{ fontSize: 100, color: '#f50057', mb: 2 }} />
                </motion.div>

                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1, color: '#e0e0e0' }}>
                    403
                </Typography>
                <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
                    Access Denied
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.disabled', maxWidth: 600 }}>
                    You don't have permission to view this page. If you believe this is an error, please contact your administrator.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={handleGoBack}
                    sx={{
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        background: 'linear-gradient(45deg, #7c4dff, #18ffff)',
                        color: 'black'
                    }}
                >
                    Go to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default Unauthorized;
