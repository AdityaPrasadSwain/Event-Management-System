package com.sems.service;

import com.sems.entity.Notification;
import java.util.List;

public interface NotificationService {

    Notification createNotification(String email, String title, String message, Notification.NotificationType type);

    void broadcastNotification(String roleName, String title, String message, Notification.NotificationType type);

    List<Notification> getUserNotifications(String email);

    long getUnreadCount(String email);

    Notification markAsRead(Long notificationId);

    void markAllAsRead(String email);

    void deleteNotification(Long id);
}
