import React, { useState } from 'react';
import {
    IconButton, Badge, Menu, MenuItem, Typography, Box,
    List, ListItem, ListItemText, ListItemAvatar, Avatar,
    Divider, Button, Tooltip
} from '@mui/material';
import {
    Notifications, Info, CheckCircle, Warning, Error as ErrorIcon,
    DoneAll, Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationMenu = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewAll = () => {
        handleClose();
        navigate('/notifications');
    };

    const handleItemClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        // Handle navigation if needed based on type/message
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle color="success" />;
            case 'WARNING': return <Warning color="warning" />;
            case 'ERROR': return <ErrorIcon color="error" />;
            default: return <Info color="info" />;
        }
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: 360,
                        maxHeight: 500,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Tooltip title="Mark all as read">
                            <IconButton size="small" onClick={markAllAsRead}>
                                <DoneAll fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Divider />

                <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No notifications
                            </Typography>
                        </Box>
                    ) : (
                        notifications.slice(0, 5).map((notification) => (
                            <React.Fragment key={notification.id}>
                                <MenuItem
                                    onClick={() => handleItemClick(notification)}
                                    sx={{
                                        backgroundColor: notification.read ? 'inherit' : 'action.hover',
                                        whiteSpace: 'normal',
                                        py: 1.5
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'transparent' }}>
                                            {getIcon(notification.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 700 }}>
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </MenuItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    )}
                </List>

                <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Button fullWidth size="small" onClick={handleViewAll}>
                        View All
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default NotificationMenu;
