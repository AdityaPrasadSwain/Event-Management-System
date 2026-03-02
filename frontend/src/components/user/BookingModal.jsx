import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Alert
} from '@mui/material';
import { CurrencyRupee, Person } from '@mui/icons-material';

const BookingModal = ({ open, onClose, event, onConfirm, loading }) => {
    const [seatCount, setSeatCount] = useState(1);
    const [paymentChoice, setPaymentChoice] = useState('full'); // 'full' or 'partial'

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setSeatCount(1);
            setPaymentChoice('full');
        }
    }, [open]);

    if (!event) return null;

    const pricePerPerson = event.pricePerPerson || 0;
    const ticketTotal = pricePerPerson * seatCount;

    // Financial calculations (matching backend defaults)
    const USER_FEE_RATE = 5.0; // 5%
    const GST_RATE = 18.0; // 18%

    const userFee = Math.round(ticketTotal * (USER_FEE_RATE / 100.0) * 100) / 100;
    const gstOnUserFee = Math.round(userFee * (GST_RATE / 100.0) * 100) / 100;
    const totalUserPayable = Math.round((ticketTotal + userFee + gstOnUserFee) * 100) / 100;

    // Calculate Minimum Payment
    // Default to 100% if not set
    const minPercentage = event.minimumAdvancePercent !== undefined ? event.minimumAdvancePercent : 100;
    const minPaymentAmount = Math.round(totalUserPayable * (minPercentage / 100) * 100) / 100;

    const canPayPartial = minPercentage < 100;

    const handleConfirm = () => {
        const paidAmount = paymentChoice === 'full' ? totalUserPayable : minPaymentAmount;
        // numberOfPersons, advancePaid
        onConfirm(seatCount, paidAmount);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: '#1e1e1e', color: 'white' } }}>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Book Tickets: {event.title}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Seat Selection */}
                    <Box>
                        <Typography variant="subtitle2" color="gray" gutterBottom>Number of Persons</Typography>
                        <TextField
                            type="number"
                            fullWidth
                            value={seatCount}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val > 0 && val <= event.remainingSeats) setSeatCount(val);
                            }}
                            inputProps={{ min: 1, max: event.remainingSeats }}
                            variant="outlined"
                            sx={{
                                input: { color: 'white' },
                                fieldset: { borderColor: 'rgba(255,255,255,0.2)' }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {event.remainingSeats} seats remaining
                        </Typography>
                    </Box>

                    {/* Price Breakdown */}
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="gray">Ticket Total ({seatCount} x {pricePerPerson})</Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}><CurrencyRupee sx={{ fontSize: 16 }} />{ticketTotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="gray">Convenience Fee (5%)</Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}><CurrencyRupee sx={{ fontSize: 16 }} />{userFee.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="gray">GST (18% on fee)</Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}><CurrencyRupee sx={{ fontSize: 16 }} />{gstOnUserFee.toFixed(2)}</Typography>
                        </Box>
                        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Total Payable</Typography>
                            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center' }}><CurrencyRupee />{totalUserPayable.toFixed(2)}</Typography>
                        </Box>
                    </Box>

                    {/* Partial Payment Option */}
                    {canPayPartial && (
                        <Box>
                            <Typography variant="subtitle2" color="gray" gutterBottom>Payment Option</Typography>
                            <RadioGroup
                                value={paymentChoice}
                                onChange={(e) => setPaymentChoice(e.target.value)}
                            >
                                <FormControlLabel
                                    value="full"
                                    control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                    label={
                                        <Box>
                                            <Typography>Pay Full Amount</Typography>
                                            <Typography variant="caption" color="green">Complete payment now</Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 1 }}
                                />
                                <FormControlLabel
                                    value="partial"
                                    control={<Radio sx={{ color: 'secondary.main', '&.Mui-checked': { color: 'secondary.main' } }} />}
                                    label={
                                        <Box>
                                            <Typography>Pay Minimum Advance ({minPercentage}%)</Typography>
                                            <Typography variant="caption" color="orange">
                                                Pay ₹{minPaymentAmount.toFixed(2)} now, rest later
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </RadioGroup>

                            {paymentChoice === 'partial' && (
                                <Alert severity="info" sx={{ mt: 2, bgcolor: 'rgba(2, 136, 209, 0.1)', color: '#29b6f6', borderRadius: 2 }}>
                                    Your booking will be confirmed upon payment of <strong>₹{minPaymentAmount.toFixed(2)}</strong>.
                                    <br />
                                    Remaining Balance: ₹{(totalUserPayable - minPaymentAmount).toFixed(2)}
                                </Alert>
                            )}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button onClick={onClose} color="inherit" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={paymentChoice === 'partial' ? 'secondary' : 'primary'}
                    disabled={loading}
                    size="large"
                >
                    {loading ? 'Processing...' : (
                        paymentChoice === 'full'
                            ? `Pay ₹${totalUserPayable.toFixed(2)}`
                            : `Pay ₹${minPaymentAmount.toFixed(2)}`
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingModal;
