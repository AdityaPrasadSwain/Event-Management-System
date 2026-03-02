// DashboardLayout Component
// Main layout wrapper with Sidebar + Navbar + Content

import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery, Alert, Collapse, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, role: propRole }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Use propRole if provided, otherwise fallback to authenticated user's role, finally default to 'USER'
    const role = propRole || user?.role || 'USER';

    useEffect(() => {
        if (location.state?.loginSuccess) {
            setShowBanner(true);
            // Clear the state so it doesn't show again on manual navigation or refresh
            navigate(location.pathname, { replace: true, state: {} });

            const timer = setTimeout(() => {
                setShowBanner(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location, navigate]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar */}
            <Sidebar
                role={role}
                mobileOpen={mobileOpen}
                onMobileClose={handleDrawerToggle}
            />

            {/* Main Content Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Navbar */}
                <Navbar onMenuClick={handleDrawerToggle} />

                {/* Login Success Banner (Top Right Floating) */}
                <Box sx={{
                    position: 'fixed',
                    top: 80,
                    right: { xs: 16, sm: 24 },
                    zIndex: 2000,
                    maxWidth: { xs: 'calc(100vw - 32px)', sm: 400 },
                    pointerEvents: 'none'
                }}>
                    <Collapse in={showBanner}>
                        <Alert
                            severity="success"
                            onClose={() => setShowBanner(false)}
                            sx={{
                                pointerEvents: 'auto',
                                borderRadius: 2,
                                bgcolor: 'rgba(232, 245, 233, 0.8)', // Light transparent green
                                color: '#1b5e20',
                                border: '1px solid rgba(46, 125, 50, 0.1)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                backdropFilter: 'blur(8px)',
                                fontWeight: 500,
                                '& .MuiAlert-icon': {
                                    color: '#2e7d32'
                                }
                            }}
                        >
                            Welcome back, <strong>{user?.name || 'User'}</strong>! Signed in successfully.
                        </Alert>
                    </Collapse>
                </Box>

                {/* Page Content */}
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        p: { xs: 2, sm: 3 },
                        bgcolor: 'background.default',
                        overflow: 'auto',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
