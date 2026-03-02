// Professional Navbar Component
// Theme toggle, notifications, user menu

import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Badge,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    ListItemIcon,
    useTheme,
    useMediaQuery,
    alpha,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationMenu from './common/NotificationMenu';

const Navbar = ({ onMenuClick }) => {
    const theme = useTheme();
    const { mode, toggleTheme } = useCustomTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/login');
    };

    const handleProfile = () => {
        handleMenuClose();
        let role = 'user';
        if (user?.role) {
            const roles = Array.isArray(user.role) ? user.role : [user.role];
            if (roles.includes('ADMIN')) role = 'admin';
            else if (roles.includes('ORGANIZER')) role = 'organizer';
        }
        navigate(`/${role}/profile`);
    };

    // Get user initials
    const getUserInitials = () => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isMobile && (
                        <IconButton edge="start" onClick={onMenuClick}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img src="/logo.svg" alt="SEMS Logo" style={{ height: 32 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            SEMS
                        </Typography>
                    </Box>
                </Box>

                {/* Right Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Theme Toggle */}
                    <IconButton onClick={toggleTheme} color="inherit">
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    {/* Notifications */}
                    <NotificationMenu />

                    {/* User Menu */}
                    <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {getUserInitials()}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 2,
                            },
                        }}
                    >
                        {/* User Info */}
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {user?.name || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email || 'email@example.com'}
                            </Typography>
                        </Box>

                        <Divider />

                        <MenuItem onClick={handleProfile}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>

                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
