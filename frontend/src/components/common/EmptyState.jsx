// EmptyState Component
// Display when no data is available

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

const EmptyState = ({
    icon: Icon = InboxIcon,
    title = 'No data available',
    description = 'There is no data to display at the moment.',
    actionLabel,
    onAction,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 2,
                textAlign: 'center',
            }}
        >
            <Icon
                sx={{
                    fontSize: 80,
                    color: 'text.disabled',
                    mb: 2,
                }}
            />
            <Typography variant="h6" color="text.primary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
                {description}
            </Typography>
            {actionLabel && onAction && (
                <Button variant="contained" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;
