import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        try {
            setLoading(true);

            // Fetch unread count first for the badge
            const countRes = await api.get('/notifications/unread-count');
            setUnreadCount(countRes.data.count || 0);

            // Fetch latest notifications
            const res = await api.get('/notifications');
            setNotifications(res.data || []);
        } catch (error) {
            console.error("❌ Failed to fetch notifications:", error);
            // Set safe defaults instead of crashing
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));

            await api.put(`/notifications/${id}/read`);
        } catch (error) {
            console.error("Failed to mark as read", error);
            // Revert if needed (omitted for brevity)
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            await api.put('/notifications/read-all');
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            setNotifications(prev => prev.filter(n => n.id !== id));
            await api.delete(`/notifications/${id}`);
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    // Poll every 60 seconds
    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
