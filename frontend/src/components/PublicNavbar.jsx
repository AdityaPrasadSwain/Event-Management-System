import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const PublicNavbar = () => {
    const theme = useTheme();
    const { mode, toggleTheme } = useCustomTheme();

    return (
        <AppBar position="sticky" elevation={0} sx={{ zIndex: 1200, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src="/logo.svg" alt="SEMS Logo" style={{ height: 40, marginRight: 10 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        SEMS
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <Button component={RouterLink} to="/login" variant="outlined" color="primary">
                        Login
                    </Button>
                    <Button component={RouterLink} to="/register" variant="contained" color="primary">
                        Register
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default PublicNavbar;
