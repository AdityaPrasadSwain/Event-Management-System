import React from 'react';
import { Box, Typography, Paper, Chip, useTheme, Grid, Button } from '@mui/material';
import { QrCode, LocationOn, CalendarToday, ConfirmationNumber, CurrencyRupee, Cancel } from '@mui/icons-material';

const BookingTicket = ({ booking, onCancel }) => {
    const theme = useTheme();
    // const event = booking.event; // Removed as we use flattened booking fields

    return (
        <Paper
            elevation={4}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                borderRadius: 2,
                overflow: 'hidden',
                background: theme.palette.background.paper,
                position: 'relative',
                mb: 3
            }}
        >
            {/* Main Ticket Area */}
            <Box sx={{ flexGrow: 1, p: 3, borderRight: { md: '2px dashed rgba(255,255,255,0.1)' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <div>
                        <Typography variant="caption" color="secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            {booking.eventCategory || 'Event'}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {booking.eventTitle || 'Unknown Event'}
                        </Typography>
                    </div>
                    <Chip
                        label={booking.bookingStatus}
                        color={
                            booking.bookingStatus === 'CONFIRMED' ? 'success' :
                                booking.bookingStatus === 'PENDING' ? 'warning' :
                                    booking.bookingStatus === 'CANCELLED' ? 'error' : 'default'
                        }
                        size="small"
                    />
                    {booking.attendanceStatus && (
                        <Chip
                            label={booking.attendanceStatus}
                            color={booking.attendanceStatus === 'PRESENT' ? 'success' : 'error'}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <div>
                                <Typography variant="caption" color="textSecondary">Date & Time</Typography>
                                <Typography variant="body2">
                                    {new Date(booking.eventStartDateTime).toLocaleString()}
                                </Typography>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <div>
                                <Typography variant="caption" color="textSecondary">Location</Typography>
                                <Typography variant="body2">{booking.eventLocation || 'TBA'}</Typography>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ConfirmationNumber sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <div>
                                <Typography variant="caption" color="textSecondary">Persons</Typography>
                                <Typography variant="body2">{booking.numberOfPersons}</Typography>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CurrencyRupee sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <div>
                                <Typography variant="caption" color="textSecondary">Paid Amount</Typography>
                                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                    ₹{booking.advancePaid?.toFixed(2)}
                                </Typography>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CurrencyRupee sx={{ fontSize: 18, mr: 1, color: booking.remainingAmount > 0 ? 'error.main' : 'text.secondary' }} />
                            <div>
                                <Typography variant="caption" color="textSecondary">Remaining</Typography>
                                <Typography variant="body2" sx={{ color: booking.remainingAmount > 0 ? 'error.main' : 'success.main' }}>
                                    ₹{booking.remainingAmount?.toFixed(2)}
                                </Typography>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ConfirmationNumber sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <div>
                                <Typography variant="caption" color="textSecondary">Payment Status</Typography>
                                <Chip
                                    label={booking.paymentStatus}
                                    size="small"
                                    variant="outlined"
                                    color={booking.paymentStatus === 'PAID' ? 'success' : booking.paymentStatus === 'PARTIAL' ? 'warning' : 'error'}
                                />
                            </div>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                    <ConfirmationNumber sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        Ticket #: {booking.ticketNumber}
                    </Typography>
                </Box>
            </Box>

            {/* Stub / QR Area */}
            <Box
                sx={{
                    width: { xs: '100%', md: 200 },
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.2)'
                }}
            >
                {booking.qrCode ? (
                    <Box
                        component="img"
                        src={booking.qrCode}
                        alt="QR Code"
                        sx={{ width: 150, height: 150, mb: 1, borderRadius: 1 }}
                    />
                ) : (
                    <QrCode sx={{ fontSize: 80, opacity: 0.8, mb: 1 }} />
                )}
                <Typography variant="caption" color="textSecondary" align="center">
                    Scan at entry
                </Typography>
            </Box>

            {/* Actions Area */}
            {booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'REJECTED' && new Date(booking.eventStartDateTime) > new Date() && (
                <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 170,
                    display: { xs: 'none', md: 'block' }
                }}>
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => onCancel(booking.id)}
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            py: 0.2
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            )}

            {/* Mobile Cancel Button */}
            {booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'REJECTED' && new Date(booking.eventStartDateTime) > new Date() && (
                <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, pb: 2 }}>
                    <Button
                        fullWidth
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => onCancel(booking.id)}
                        sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                        Cancel Booking
                    </Button>
                </Box>
            )}

            {/* Decorative Circles for Ticket Effect */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -10,
                    right: { xs: 'auto', md: 190 },
                    left: { xs: 'calc(50% - 10px)', md: 'auto' },
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: theme.palette.background.default
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: { xs: 'auto', md: 190 },
                    left: { xs: 'calc(50% - 10px)', md: 'auto' },
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: theme.palette.background.default
                }}
            />
        </Paper>
    );
};

export default BookingTicket;
