import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { Error as ErrorIcon, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('🔴 ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: '#f5f5f5',
                    p: 3
                }}>
                    <Paper sx={{
                        maxWidth: 600,
                        p: 4,
                        textAlign: 'center',
                        bgcolor: '#fff'
                    }}>
                        <ErrorIcon sx={{ fontSize: 64, color: '#d32f2f', mb: 2 }} />

                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Something Went Wrong
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            The dashboard encountered an error. This might be due to a WebGL rendering issue.
                        </Typography>

                        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                                {this.state.error?.toString()}
                            </Typography>
                            {this.props.showDetails && this.state.errorInfo && (
                                <details style={{ marginTop: '8px' }}>
                                    <summary style={{ cursor: 'pointer' }}>Stack Trace</summary>
                                    <pre style={{
                                        fontSize: '11px',
                                        overflow: 'auto',
                                        maxHeight: '200px',
                                        marginTop: '8px'
                                    }}>
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </Alert>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Refresh />}
                            onClick={this.handleReload}
                            sx={{
                                background: 'linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)',
                                px: 4
                            }}
                        >
                            Reload Dashboard
                        </Button>

                        <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.secondary' }}>
                            If this problem persists, please contact support
                        </Typography>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
