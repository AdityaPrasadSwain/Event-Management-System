// Professional Color Palette for Light & Dark Modes
// Designed for Event Management System

const palette = {
    light: {
        primary: {
            main: '#6366F1', // Indigo - Modern, professional
            light: '#818CF8',
            dark: '#4F46E5',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#8B5CF6', // Purple - Creative, engaging
            light: '#A78BFA',
            dark: '#7C3AED',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#10B981', // Green
            light: '#34D399',
            dark: '#059669',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#EF4444', // Red
            light: '#F87171',
            dark: '#DC2626',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#F59E0B', // Amber
            light: '#FBBF24',
            dark: '#D97706',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#3B82F6', // Blue
            light: '#60A5FA',
            dark: '#2563EB',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F9FAFB', // Very light gray
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111827', // Almost black
            secondary: '#6B7280', // Medium gray
            disabled: '#9CA3AF',
        },
        divider: '#E5E7EB',

        // Role-specific colors
        roles: {
            admin: '#EF4444', // Red
            organizer: '#8B5CF6', // Purple
            user: '#3B82F6', // Blue
        },
    },

    dark: {
        primary: {
            main: '#818CF8', // Lighter indigo for dark mode
            light: '#A5B4FC',
            dark: '#6366F1',
            contrastText: '#000000',
        },
        secondary: {
            main: '#A78BFA', // Lighter purple
            light: '#C4B5FD',
            dark: '#8B5CF6',
            contrastText: '#000000',
        },
        success: {
            main: '#34D399',
            light: '#6EE7B7',
            dark: '#10B981',
            contrastText: '#000000',
        },
        error: {
            main: '#F87171',
            light: '#FCA5A5',
            dark: '#EF4444',
            contrastText: '#000000',
        },
        warning: {
            main: '#FBBF24',
            light: '#FCD34D',
            dark: '#F59E0B',
            contrastText: '#000000',
        },
        info: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
            contrastText: '#000000',
        },
        background: {
            default: '#0F172A', // Dark slate
            paper: '#1E293B', // Lighter slate
        },
        text: {
            primary: '#F1F5F9', // Almost white
            secondary: '#94A3B8', // Light slate
            disabled: '#64748B',
        },
        divider: '#334155',

        // Role-specific colors (brighter for dark mode)
        roles: {
            admin: '#F87171',
            organizer: '#A78BFA',
            user: '#60A5FA',
        },
    },
};

export default palette;
