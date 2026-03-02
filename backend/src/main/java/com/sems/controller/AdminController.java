package com.sems.controller;

import com.sems.dto.UserDTO;
import com.sems.dto.AdminDashboardDTO;
import com.sems.entity.Event;
import com.sems.entity.Role;
import com.sems.entity.User;
import com.sems.service.AdminService;
import com.sems.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // --- Organizer Approval (Using UserService with DTOs) ---

    @GetMapping("/organizers/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<com.sems.dto.PendingOrganizerDto>> getPendingOrganizers() {
        return ResponseEntity.ok(adminService.getPendingOrganizers());
    }

    @PostMapping("/organizers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> approveOrganizer(@PathVariable Long id) {
        adminService.approveOrganizer(id);
        return ResponseEntity.ok(Map.of("message", "Organizer approved successfully"));
    }

    @PostMapping("/organizers/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> rejectOrganizer(@PathVariable Long id) {
        adminService.rejectOrganizer(id);
        return ResponseEntity.ok(Map.of("message", "Organizer rejected successfully"));
    }

    // --- User Management ---

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> blockUser(@PathVariable Long id) {
        adminService.blockUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unblockUser(@PathVariable Long id) {
        adminService.unblockUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changeUserRole(@PathVariable Long id, @RequestParam Role role) {
        adminService.changeUserRole(id, role);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/organizers/approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getApprovedOrganizers() {
        return ResponseEntity.ok(adminService.getApprovedOrganizers());
    }

    // --- Event Approval ---

    @GetMapping("/events/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<com.sems.dto.AdminEventDto>> getPendingEvents() {
        return ResponseEntity.ok(adminService.getPendingEvents());
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<com.sems.dto.AdminEventDto>> getAllEvents() {
        return ResponseEntity.ok(adminService.getAllEvents());
    }

    @PutMapping("/events/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveEvent(@PathVariable Long id) {
        adminService.approveEvent(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/events/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectEvent(
            @PathVariable Long id,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "No reason provided";
        adminService.rejectEvent(id, reason);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/events/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelEvent(@PathVariable Long id) {
        adminService.cancelEvent(id);
        return ResponseEntity.ok().build();
    }

    // --- Dashboard ---

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
