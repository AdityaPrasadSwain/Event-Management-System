import React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    IconButton,
    Divider,
    Button,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckIcon,
    Delete as DeleteIcon,
    MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';

const OrganizerNotifications = () => {
    const notifications = [];

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Stay updated with your events and bookings
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<MarkReadIcon />}>
                    Mark All Read
                </Button>
            </Box>

            <Paper sx={{ p: 3 }}>
                {notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <NotificationsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You're all caught up! New notifications will appear here
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <NotificationsIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={notification.title}
                                        secondary={notification.message}
                                    />
                                    <Chip
                                        label={notification.read ? 'Read' : 'Unread'}
                                        color={notification.read ? 'default' : 'primary'}
                                        size="small"
                                        sx={{ mr: 2 }}
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
};

export default OrganizerNotifications;
