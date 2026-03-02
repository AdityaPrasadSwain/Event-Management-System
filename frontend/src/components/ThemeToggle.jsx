import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = ({ sx }) => {
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeContext();

    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.2 }}
        >
            <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{
                    ...sx,
                    background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    '&:hover': {
                        background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    }
                }}
            >
                {mode === 'dark' ? <Brightness7 color="warning" /> : <Brightness4 color="secondary" />}
            </IconButton>
        </motion.div>
    );
};

export default ThemeToggle;
