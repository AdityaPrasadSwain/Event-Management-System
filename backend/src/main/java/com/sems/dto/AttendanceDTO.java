package com.sems.dto;

import com.sems.entity.Attendance;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long bookingId;
    private String ticketNumber;
    private Attendance.Status status;
    private LocalDateTime checkInTime;
}
