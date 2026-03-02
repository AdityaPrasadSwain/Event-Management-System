import React from 'react';
import {
    Box, Typography, Container, Paper, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, IconButton,
    Chip, Divider, Button
} from '@mui/material';
import {
    CheckCircle, Warning, Error as ErrorIcon, Info,
    Delete, DoneAll
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationsPage = () => {
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle color="success" />;
            case 'WARNING': return <Warning color="warning" />;
            case 'ERROR': return <ErrorIcon color="error" />;
            default: return <Info color="info" />;
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                        All Notifications
                    </Typography>
                    <Button
                        startIcon={<DoneAll />}
                        onClick={markAllAsRead}
                        disabled={notifications.every(n => n.read)}
                    >
                        Mark All Read
                    </Button>
                </Box>

                <List>
                    <AnimatePresence>
                        {notifications.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <Typography color="text.secondary">
                                    You're all caught up! No notifications.
                                </Typography>
                            </Box>
                        ) : (
                            notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ListItem
                                        alignItems="flex-start"
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => deleteNotification(notification.id)}>
                                                <Delete />
                                            </IconButton>
                                        }
                                        sx={{
                                            bgcolor: notification.read ? 'inherit' : 'action.selected',
                                            borderRadius: 1,
                                            mb: 1,
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                        onClick={() => !notification.read && markAsRead(notification.id)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'transparent' }}>
                                                {getIcon(notification.type)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight={notification.read ? 400 : 700}>
                                                        {notification.title}
                                                    </Typography>
                                                    {!notification.read && (
                                                        <Chip label="NEW" color="error" size="small" sx={{ height: 20, fontSize: '0.6rem' }} />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block', my: 0.5 }}>
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </List>
            </Paper>
        </Container>
    );
};

export default NotificationsPage;
