import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, TextField, InputAdornment, IconButton, Chip, CircularProgress, Container, useTheme, useMediaQuery, Drawer, Fab } from '@mui/material';
import { Search, AutoAwesome, Refresh, FilterList } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import EventCard from '../../components/user/EventCard';
import EventFilterSidebar from '../../components/user/EventFilterSidebar';
import AiChatbot from '../../components/AiChatbot';
import api from '../../services/api';
import { motion } from 'framer-motion';

const BrowseEvents = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAiSearch, setIsAiSearch] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: [0, 1000],
        date: ''
    });

    const categories = ['Music', 'Technology', 'Art', 'Business', 'Food', 'Sports', 'Education', 'Entertainment'];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/events'); // Fixed: Changed from /user/events to /events (public API)
            if (Array.isArray(response.data)) {
                setEvents(response.data);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error("Error fetching events", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (isAiSearch) {
                const response = await api.get('/ai/search-events', { params: { query: searchQuery } });
                if (Array.isArray(response.data)) setEvents(response.data);
            } else {
                // Determine if we need to re-fetch or just filter existing
                // For simplicity, we'll re-fetch to reset and then clientside filter if needed
                // But better to implementation actual API search. 
                // Since user didn't request backend changes, we stick to client-side filtering for basic search 
                // OR re-using the logic from before.
                // Re-fetching establishes a baseline.
                const response = await api.get('/events'); // Fixed: Changed from /user/events
                let allEvents = Array.isArray(response.data) ? response.data : [];

                if (searchQuery) {
                    allEvents = allEvents.filter(e =>
                        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (e.categoryName && e.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) // Fixed: category -> categoryName
                    );
                }
                setEvents(allEvents);
            }
        } catch (error) {
            console.error("Search error", error);
        } finally {
            setLoading(false);
        }
    };

    // Apply Client-Side Filters
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Category Filter
            if (filters.categories.length > 0 && !filters.categories.includes(event.categoryName)) {
                return false;
            }
            // Price Filter
            if (event.pricePerPerson < filters.priceRange[0] || event.pricePerPerson > filters.priceRange[1]) {
                return false;
            }
            // Date Filter (Simple string match or date comparison)
            if (filters.date) {
                const eventDate = new Date(event.startDateTime).toISOString().split('T')[0];
                if (eventDate !== filters.date) return false;
            }
            return true;
        });
    }, [events, filters]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <AiChatbot />

            {/* Header / Search Section */}
            <Box sx={{
                bgcolor: 'background.paper',
                pt: 6,
                pb: 6,
                px: 2,
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                mb: 4
            }}>
                <Container maxWidth="md">
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Discover <span style={{ color: '#bb86fc' }}>Amazing</span> Events
                    </Typography>

                    <Box sx={{ position: 'relative', maxWidth: 600, mx: 'auto', mt: 4 }}>
                        <TextField
                            fullWidth
                            placeholder={isAiSearch ? "Try 'Tech events next week'..." : "Search for events..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {isAiSearch ? <AutoAwesome color="secondary" /> : <Search />}
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSearch}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 8, bgcolor: 'background.default', pr: 1 }
                            }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Chip
                                icon={<AutoAwesome />}
                                label="AI Search"
                                color={isAiSearch ? "secondary" : "default"}
                                onClick={() => setIsAiSearch(!isAiSearch)}
                                variant={isAiSearch ? "filled" : "outlined"}
                                clickable
                            />
                            <Chip
                                icon={<Refresh />}
                                label="Reset"
                                onClick={() => { setSearchQuery(''); setFilters({ categories: [], priceRange: [0, 1000], date: '' }); fetchEvents(); }}
                                clickable
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ pb: 8 }}>
                <Grid container spacing={4}>
                    {/* Filter Sidebar (Desktop) */}
                    {!isMobile && (
                        <Grid item md={3} lg={2.5}>
                            <Box sx={{ position: 'sticky', top: 100 }}>
                                <EventFilterSidebar
                                    filters={filters}
                                    setFilters={setFilters}
                                    categories={categories}
                                    onApply={() => { }} // Filters are applied instantly via useMemo, but button gives user feedback feeling
                                    onReset={() => setFilters({ categories: [], priceRange: [0, 1000], date: '' })}
                                />
                            </Box>
                        </Grid>
                    )}

                    {/* Events Grid */}
                    <Grid item xs={12} md={9} lg={9.5}>
                        {/* Recommended Section (Only show if no search/filters active for cleaner look) */}
                        {!searchQuery && filters.categories.length === 0 && events.length > 0 && (
                            <Box sx={{ mb: 6 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Recommended for You</Typography>
                                <Grid container spacing={3}>
                                    {events.slice(0, 4).map((event, index) => (
                                        <Grid item key={`rec-${event.id}`} xs={12} sm={6} md={4} lg={3}>
                                            <EventCard event={event} delay={index * 0.1} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {loading ? 'Loading...' : `${filteredEvents.length} Events Found`}
                            </Typography>
                            {isMobile && (
                                <IconButton onClick={handleDrawerToggle} sx={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <FilterList />
                                </IconButton>
                            )}
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                                <CircularProgress color="secondary" />
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredEvents.map((event, index) => (
                                    <Grid item key={event.id} xs={12} sm={6} md={4} lg={4}>
                                        <EventCard event={event} delay={index * 0.05} />
                                    </Grid>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <Grid item xs={12}>
                                        <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.7 }}>
                                            <Search sx={{ fontSize: 60, mb: 2 }} />
                                            <Typography variant="h6">No events match your filters.</Typography>
                                            <Typography variant="body2" color="textSecondary">Try adjusting your search or filters.</Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile Filter Drawer */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, bgcolor: 'background.paper' } }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
                    <EventFilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        categories={categories}
                        onApply={handleDrawerToggle}
                        onReset={() => setFilters({ categories: [], priceRange: [0, 1000], date: '' })}
                    />
                </Box>
            </Drawer>
        </Box>
    );
};

export default BrowseEvents;
