import React from 'react';
import { Box, Typography, Button, IconButton, Chip, useTheme } from '@mui/material';
import { Favorite, FavoriteBorder, CalendarToday, LocationOn, CurrencyRupee } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AnimatedCard from '../AnimatedCard';
import { useWishlist } from '../../context/WishlistContext';

const EventCard = ({ event, delay = 0 }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const isWishlisted = isInWishlist(event.id);

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(event.id);
        } else {
            addToWishlist(event);
        }
    };

    return (
        <AnimatedCard delay={delay} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
            {/* Image Placeholder */}
            <Box
                sx={{
                    height: 160,
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    mb: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {event.imageUrls && event.imageUrls.length > 0 ? (
                    <Box
                        component="img"
                        src={event.imageUrls[0]}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Typography variant="h1" sx={{ opacity: 0.1 }}>📅</Typography>
                )}

                <Chip
                    label={event.categoryName || 'General'}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        color: theme.palette.common.white
                    }}
                />
            </Box>

            {/* Wishlist Button */}
            <IconButton
                onClick={handleWishlistToggle}
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'rgba(30,30,30,0.6)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'rgba(30,30,30,0.8)' }
                }}
            >
                {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder color="primary" />}
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, flexGrow: 1, lineHeight: 1.3 }}>
                {event.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <CalendarToday sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="textSecondary">
                    {new Date(event.startDateTime).toLocaleDateString()}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="textSecondary" noWrap>
                    {event.location}
                </Typography>
            </Box>

            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <CurrencyRupee sx={{ fontSize: 20 }} />{event.pricePerPerson}
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/user/events/${event.id}`)}
                    sx={{ borderRadius: 6, textTransform: 'none', px: 3 }}
                >
                    Details
                </Button>
            </Box>
        </AnimatedCard>
    );
};

export default EventCard;
