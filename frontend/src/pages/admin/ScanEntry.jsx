import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Alert, Card, CardContent, Divider, CircularProgress } from '@mui/material';
import { QrCodeScanner, CheckCircle, Error, Person, Event } from '@mui/icons-material';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const ScanEntry = () => {
    const [ticketId, setTicketId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (e) => {
        if (e) e.preventDefault();
        if (!ticketId) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await api.post('/entry/scan', { ticketIdentifier: ticketId });
            setResult(response.data);
            setTicketId(''); // Clear for next scan
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid ticket or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <PageHeader
                title="Event Entry Scan"
                subtitle="Scan QR code or enter ticket ID to validate entry"
                icon={<QrCodeScanner />}
            />

            <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <form onSubmit={handleScan}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Ticket ID"
                            variant="outlined"
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            placeholder="Enter ticket ID manually..."
                            disabled={loading}
                            autoFocus
                        />
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleScan}
                            disabled={loading || !ticketId}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Scan / Entry'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            {error && (
                <Alert severity="error" icon={<Error />} sx={{ mb: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {result && (
                <Card sx={{ borderRadius: 2, borderLeft: '6px solid', borderColor: 'success.main', animation: 'slideIn 0.3s ease-out' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'success.main' }}>
                            <CheckCircle sx={{ fontSize: 40, mr: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {result.message}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                            <Box>
                                <Typography color="textSecondary" variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Event fontSize="inherit" /> EVENT
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {result.eventTitle}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography color="textSecondary" variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Person fontSize="inherit" /> ATTENDEE
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {result.userName}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography color="textSecondary" variant="caption">ENTRY TIME</Typography>
                                <Typography variant="body1">
                                    {new Date(result.entryTime).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Box sx={{ mt: 6, textAlign: 'center', opacity: 0.6 }}>
                <Typography variant="body2" color="textSecondary">
                    TIP: For real-time scanning, connect a barcode scanner or use a browser-based QR scanner integration.
                </Typography>
            </Box>

            <style>
                {`
                    @keyframes slideIn {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `}
            </style>
        </Container>
    );
};

export default ScanEntry;
