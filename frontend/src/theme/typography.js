// Typography System
// Modern, readable font stack with proper scaling

const typography = {
    fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
    ].join(','),

    // Headings
    h1: {
        fontSize: '2.5rem', // 40px
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
    },
    h2: {
        fontSize: '2rem', // 32px
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
    },
    h3: {
        fontSize: '1.75rem', // 28px
        fontWeight: 600,
        lineHeight: 1.4,
    },
    h4: {
        fontSize: '1.5rem', // 24px
        fontWeight: 600,
        lineHeight: 1.4,
    },
    h5: {
        fontSize: '1.25rem', // 20px
        fontWeight: 600,
        lineHeight: 1.5,
    },
    h6: {
        fontSize: '1rem', // 16px
        fontWeight: 600,
        lineHeight: 1.5,
    },

    // Body text
    body1: {
        fontSize: '1rem', // 16px
        lineHeight: 1.6,
        letterSpacing: '0.00938em',
    },
    body2: {
        fontSize: '0.875rem', // 14px
        lineHeight: 1.57,
        letterSpacing: '0.01071em',
    },

    // Buttons
    button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'none', // No uppercase
    },

    // Captions
    caption: {
        fontSize: '0.75rem', // 12px
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
    },
    overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
    },

    // Subtitle
    subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
    },
    subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
    },
};

export default typography;
