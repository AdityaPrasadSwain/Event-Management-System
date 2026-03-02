import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Container,
    Button,
    Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Block as BlockIcon,
    Home as HomeIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    }}
                >
                    <BlockIcon sx={{ fontSize: 100, mb: 3, opacity: 0.9 }} />

                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        403
                    </Typography>

                    <Typography variant="h4" gutterBottom>
                        Access Denied
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                        You don't have permission to access this page.
                        <br />
                        Please contact your administrator if you believe this is an error.
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                },
                            }}
                        >
                            Go Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/')}
                            sx={{
                                bgcolor: 'white',
                                color: '#667eea',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                },
                            }}
                        >
                            Go Home
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
};

export default AccessDenied;
