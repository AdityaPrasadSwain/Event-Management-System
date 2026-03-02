// ErrorDisplay Component
// Display error messages in a friendly way

import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

const ErrorDisplay = ({
    title = 'Something went wrong',
    message = 'An error occurred. Please try again.',
    severity = 'error',
    onRetry,
    retryLabel = 'Try Again',
}) => {
    return (
        <Box sx={{ p: 3 }}>
            <Alert
                severity={severity}
                icon={<ErrorIcon />}
                action={
                    onRetry && (
                        <Button color="inherit" size="small" onClick={onRetry}>
                            {retryLabel}
                        </Button>
                    )
                }
            >
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
        </Box>
    );
};

export default ErrorDisplay;
