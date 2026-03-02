package com.sems.service;

import com.sems.dto.AttendanceDTO;
import com.sems.dto.AttendanceRequest;
import java.util.List;

public interface AttendanceService {
    AttendanceDTO markAttendance(AttendanceRequest request, String organizerEmail);

    List<AttendanceDTO> getEventAttendance(Long eventId, String organizerEmail);

    List<AttendanceDTO> getUserAttendance(String userEmail);
}
