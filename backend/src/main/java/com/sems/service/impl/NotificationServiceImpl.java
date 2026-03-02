package com.sems.service.impl;

import com.sems.entity.Notification;
import com.sems.entity.User;
import com.sems.repository.NotificationRepository;
import com.sems.repository.UserRepository;
import com.sems.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Notification createNotification(String email, String title, String message,
            Notification.NotificationType type) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        Notification notification = Notification.builder()
                .userId(user.getId())
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void broadcastNotification(String roleName, String title, String message,
            Notification.NotificationType type) {
        List<User> users;
        if (roleName == null || roleName.isEmpty()) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findAll().stream()
                    .filter(u -> u.getRole().name().equalsIgnoreCase(roleName))
                    .toList();
        }

        List<Notification> notifications = users.stream()
                .map(user -> Notification.builder()
                        .userId(user.getId())
                        .title(title)
                        .message(message)
                        .type(type)
                        .isRead(false)
                        .build())
                .toList();

        notificationRepository.saveAll(notifications);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Notification> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
