import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#6A11CB' : '#2563EB',
      light: mode === 'dark' ? '#8e44ad' : '#60a5fa',
      dark: mode === 'dark' ? '#2575FC' : '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#00E5FF' : '#06b6d4',
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: mode === 'dark' ? '#000000' : '#ffffff',
    },
    success: {
      main: '#00C853',
    },
    warning: {
      main: '#FFAB00',
    },
    error: {
      main: '#FF1744',
    },
    background: {
      default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
      paper: mode === 'dark' ? '#1e293b' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#E5E7EB' : '#0F172A',
      secondary: mode === 'dark' ? '#9CA3AF' : '#64748B',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      background: mode === 'dark'
        ? 'linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)'
        : 'linear-gradient(90deg, #2563EB 0%, #06b6d4 100%)',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: mode === 'dark'
            ? 'linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)'
            : 'linear-gradient(90deg, #2563EB 0%, #06b6d4 100%)',
          color: 'white',
          boxShadow: mode === 'dark'
            ? '0 4px 15px rgba(37, 117, 252, 0.4)'
            : '0 4px 15px rgba(37, 99, 235, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark'
            ? 'rgba(30, 41, 59, 0.7)' // Semi-transparent dark slate
            : 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
          backdropFilter: 'blur(12px)',
          borderRadius: 16,
          border: mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: mode === 'dark'
            ? 'none'
            : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: mode === 'dark'
              ? '0 8px 24px rgba(0, 0, 0, 0.4)'
              : '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.05)'
            : '1px solid rgba(0, 0, 0, 0.05)',
        },
        head: {
          fontWeight: 600,
          color: mode === 'dark' ? '#9CA3AF' : '#64748B',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#E5E7EB' : '#0F172A',
        },
        input: {
          color: mode === 'dark' ? '#E5E7EB' : '#0F172A',
          '&:-webkit-autofill': {
            WebkitBoxShadow: mode === 'dark' ? '0 0 0 100px #1e293b inset' : '0 0 0 100px #ffffff inset',
            WebkitTextFillColor: mode === 'dark' ? '#E5E7EB' : '#0F172A',
            caretColor: mode === 'dark' ? '#E5E7EB' : '#0F172A',
            borderRadius: 'inherit',
          },
          '&::placeholder': {
            color: mode === 'dark' ? '#9CA3AF' : '#64748B',
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? '#2575FC' : '#2563EB',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? '#6A11CB' : '#2563EB',
          },
          '& input': {
            color: mode === 'dark' ? '#E5E7EB' : '#0F172A',
          },
        },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
export default getTheme('light'); // Default to light mode for visibility
