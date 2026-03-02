import React from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, Badge, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from '@mui/material';
import { Notifications, DoneAll, DeleteSweep, Info, CheckCircle, Warning, Error as ErrorIcon } from '@mui/icons-material';
import { useNotification } from '../../context/NotificationContext';

const NotificationPanel = ({ anchorEl, open, onClose }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotification();

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle color="success" />;
            case 'warning': return <Warning color="warning" />;
            case 'error': return <ErrorIcon color="error" />;
            default: return <Info color="info" />;
        }
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
                sx: { width: 360, maxHeight: 500, mt: 1.5, borderRadius: 2 }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                {unreadCount > 0 && (
                    <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }} />
                )}
            </Box>

            <Divider />

            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Button size="small" startIcon={<DoneAll />} onClick={markAllAsRead} disabled={unreadCount === 0}>
                    Mark all read
                </Button>
                <Button size="small" startIcon={<DeleteSweep />} color="error" onClick={clearNotifications} disabled={notifications.length === 0}>
                    Clear all
                </Button>
            </Box>

            <Divider />

            {notifications.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6 }}>
                    <Notifications sx={{ fontSize: 48, mb: 1 }} />
                    <Typography>No notifications</Typography>
                </Box>
            ) : (
                <List sx={{ p: 0 }}>
                    {notifications.map((notification) => (
                        <ListItem
                            key={notification.id}
                            alignItems="flex-start"
                            sx={{
                                bgcolor: notification.read ? 'transparent' : 'rgba(187, 134, 252, 0.08)',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'transparent' }}>
                                    {getIcon(notification.type)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={notification.message}
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Menu>
    );
};

export default NotificationPanel;
