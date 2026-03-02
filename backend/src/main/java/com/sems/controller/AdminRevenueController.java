package com.sems.controller;

import com.sems.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
public class AdminRevenueController {

        private final com.sems.service.RevenueService revenueService;
        private final com.sems.repository.BookingRepository bookingRepository; // Kept for any other needs, but not used
                                                                               // now

        @GetMapping("/summary")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Map<String, Object>> getRevenueSummary() {
                return ResponseEntity.ok(revenueService.getAdminRevenueSummary());
        }
}
