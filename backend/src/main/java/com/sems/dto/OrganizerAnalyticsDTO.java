package com.sems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganizerAnalyticsDTO {
    private long totalEvents;
    private long approvedEvents;
    private long pendingEvents;
    private long totalBookings;
    private double revenue;
}
