package com.sems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganizerDashboardDTO {
    private long totalEvents;
    private long approvedEvents;
    private long pendingEvents;
    private long totalBookings;
    private double revenue;
    private long totalRegistrations;
    private java.util.List<java.util.Map<String, Object>> sentimentData;
    private java.util.Map<String, Object> revenueChart;
    private java.util.Map<String, Object> categoryChart;
}
