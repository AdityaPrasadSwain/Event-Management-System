import React from 'react';
import { Box, Typography, Container, Grid, Button, Paper } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import EventCard from '../../components/user/EventCard';
import { useWishlist } from '../../context/WishlistContext';

const Wishlist = () => {
    const { wishlist } = useWishlist();
    const navigate = useNavigate();

    return (
        <Container maxWidth="xl" sx={{ pt: 3, pb: 8 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FavoriteBorder sx={{ fontSize: 32, color: 'secondary.main' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    My Wishlist
                </Typography>
            </Box>

            {wishlist.length === 0 ? (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}
                >
                    <FavoriteBorder sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>Your wishlist is empty</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                        Save events you're interested in to view them later.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/user/browse')}
                        sx={{ borderRadius: 8, px: 4 }}
                    >
                        Browse Events
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {wishlist.map((event, index) => (
                        <Grid item key={event.id} xs={12} sm={6} md={4} lg={3}>
                            <EventCard event={event} delay={index * 0.1} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Wishlist;
