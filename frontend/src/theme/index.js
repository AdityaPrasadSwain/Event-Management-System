// Main Theme Configuration
// Combines palette, typography, and component overrides

import { createTheme } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import components from './components';

// Create light theme
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        ...palette.light,
    },
    typography,
    components,
    shape: {
        borderRadius: 8,
    },
    spacing: 8, // 8px base unit
    shadows: [
        'none',
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        ...Array(19).fill('none'), // Fill remaining shadow levels
    ],
    transitions: {
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

// Create dark theme
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        ...palette.dark,
    },
    typography,
    components: {
        ...components,
        MuiCssBaseline: {
            styleOverrides: {
                ...components.MuiCssBaseline.styleOverrides,
                body: {
                    ...components.MuiCssBaseline.styleOverrides.body,
                    backgroundColor: palette.dark.background.default,
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    shadows: [
        'none',
        '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
        '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
        '0 25px 50px -12px rgb(0 0 0 / 0.5)',
        ...Array(19).fill('none'),
    ],
    transitions: {
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

// Helper to get theme by mode
export const getTheme = (mode) => {
    return mode === 'dark' ? darkTheme : lightTheme;
};

export default { lightTheme, darkTheme, getTheme };
