// MUI Component Style Overrides
// Creates consistent, modern look across all components

const components = {
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#94A3B8',
                    borderRadius: '4px',
                    '&:hover': {
                        background: '#64748B',
                    },
                },
            },
        },
    },

    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                    boxShadow: 'none',
                },
            },
            contained: {
                '&:hover': {
                    transform: 'translateY(-1px)',
                    transition: 'transform 0.2s',
                },
            },
            sizeLarge: {
                padding: '12px 24px',
                fontSize: '1rem',
            },
            sizeSmall: {
                padding: '6px 12px',
                fontSize: '0.8125rem',
            },
        },
    },

    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
            },
        },
    },

    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
            },
            rounded: {
                borderRadius: 12,
            },
            elevation1: {
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            },
            elevation2: {
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
        },
    },

    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                },
            },
        },
    },

    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 6,
                fontWeight: 500,
            },
        },
    },

    MuiTableCell: {
        styleOverrides: {
            head: {
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
            },
        },
    },

    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRight: 'none',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            },
        },
    },

    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            },
        },
    },

    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
            standardSuccess: {
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
            },
            standardError: {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
            standardWarning: {
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
            },
            standardInfo: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
        },
    },
};

export default components;
