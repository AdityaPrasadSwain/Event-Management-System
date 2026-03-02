package com.sems.service;

import com.sems.dto.AdminDashboardDTO;
import com.sems.entity.Event;
import com.sems.entity.Role;
import com.sems.entity.User;

import java.util.List;

public interface AdminService {
    List<User> getAllUsers();

    void blockUser(Long id);

    void unblockUser(Long id);

    void changeUserRole(Long id, Role role);

    List<com.sems.dto.AdminEventDto> getPendingEvents();

    List<com.sems.dto.AdminEventDto> getAllEvents();

    void approveEvent(Long id);

    void rejectEvent(Long id, String reason);

    void cancelEvent(Long id);

    List<com.sems.dto.PendingOrganizerDto> getPendingOrganizers();

    List<User> getApprovedOrganizers();

    void approveOrganizer(Long id);

    void rejectOrganizer(Long id);

    AdminDashboardDTO getDashboardStats();
}
