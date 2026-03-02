package com.sems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalOrganizers;
    private long totalEvents;
    private long pendingEvents;
    private long activeEvents;
    private long cancelledEvents;
}
