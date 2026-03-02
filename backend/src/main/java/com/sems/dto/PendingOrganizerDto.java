package com.sems.dto;

import com.sems.entity.OrganizerStatus;

public record PendingOrganizerDto(
        Long id,
        String name,
        String email,
        String organizationName,
        String contactNumber,
        OrganizerStatus status,
        java.time.LocalDateTime appliedAt) {
}
