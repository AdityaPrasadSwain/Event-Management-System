import React from 'react';
import { Box, useTheme } from '@mui/material';
import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = ({ children }) => {
    const theme = useTheme();
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.default }}>
            <PublicNavbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
};

export default PublicLayout;
