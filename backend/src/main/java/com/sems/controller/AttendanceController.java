package com.sems.controller;

import com.sems.dto.AttendanceDTO;
import com.sems.dto.AttendanceRequest;
import com.sems.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // ORGANIZER Endpoints
    @PostMapping("/organizer/attendance/mark")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<AttendanceDTO> markAttendance(@RequestBody AttendanceRequest request, Principal principal) {
        return ResponseEntity.ok(attendanceService.markAttendance(request, principal.getName()));
    }

    @GetMapping("/organizer/events/{eventId}/attendance")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<AttendanceDTO>> getEventAttendance(@PathVariable Long eventId, Principal principal) {
        return ResponseEntity.ok(attendanceService.getEventAttendance(eventId, principal.getName()));
    }

    // USER Endpoints
    @GetMapping("/user/attendance")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AttendanceDTO>> getUserAttendance(Principal principal) {
        return ResponseEntity.ok(attendanceService.getUserAttendance(principal.getName()));
    }
}
