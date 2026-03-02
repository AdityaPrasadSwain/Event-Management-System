package com.sems.dto;

import com.sems.entity.Attendance;
import lombok.Data;

@Data
public class AttendanceRequest {
    private Long bookingId;
    private Attendance.Status status;
}
