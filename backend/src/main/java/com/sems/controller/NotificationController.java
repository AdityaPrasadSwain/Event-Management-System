package com.sems.controller;

import com.sems.entity.Notification;
import com.sems.entity.User;
import com.sems.service.NotificationService;
import com.sems.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService; // To resolve UserDetails to ID

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications(
            org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(List.of());
        }

        try {
            return ResponseEntity.ok(notificationService.getUserNotifications(authentication.getName()));
        } catch (Exception e) {
            System.err.println("Error getting notifications: " + e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(Map.of("count", 0L));
        }

        try {
            long count = notificationService.getUnreadCount(authentication.getName());
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            System.err.println("Error getting unread count: " + e.getMessage());
            return ResponseEntity.ok(Map.of("count", 0L));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(org.springframework.security.core.Authentication authentication) {
        if (authentication != null) {
            notificationService.markAllAsRead(authentication.getName());
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    // Admin only
    @PostMapping("/broadcast")
    public ResponseEntity<Void> broadcast(@RequestBody Map<String, String> payload) {
        String role = payload.get("role"); // "USER", "ORGANIZER", "ADMIN" or null for all
        String title = payload.get("title");
        String message = payload.get("message");
        String typeStr = payload.getOrDefault("type", "INFO");

        Notification.NotificationType type;
        try {
            type = Notification.NotificationType.valueOf(typeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            type = Notification.NotificationType.INFO; // Fallback
        }

        notificationService.broadcastNotification(role, title, message, type);
        return ResponseEntity.ok().build();
    }
}
