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
    SearchOff as SearchOffIcon,
    Home as HomeIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const NotFound = () => {
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
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                    }}
                >
                    <SearchOffIcon sx={{ fontSize: 100, mb: 3, opacity: 0.9 }} />

                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        404
                    </Typography>

                    <Typography variant="h4" gutterBottom>
                        Page Not Found
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                        The page you're looking for doesn't exist.
                        <br />
                        It might have been moved or deleted.
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
                                color: '#f5576c',
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

export default NotFound;
