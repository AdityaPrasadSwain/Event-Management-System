package com.sems.service;

import com.sems.repository.EventRepository;
import com.sems.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    public Map<String, Object> getOrganizerStats(String email) {
        Map<String, Object> stats = new HashMap<>();

        long totalEvents = eventRepository.countByOrganizerEmail(email);
        long approvedEvents = eventRepository.countByOrganizerEmailAndStatus(email,
                com.sems.entity.EventStatus.APPROVED);
        long pendingEvents = eventRepository.countByOrganizerEmailAndStatus(email, com.sems.entity.EventStatus.PENDING);
        long totalBookings = ticketRepository.countByEventOrganizerEmail(email);

        Double totalRevenue = ticketRepository.sumRevenueByOrganizerEmail(email);
        if (totalRevenue == null)
            totalRevenue = 0.0;

        java.time.LocalDateTime firstDayOfMonth = java.time.LocalDateTime.now().withDayOfMonth(1).withHour(0)
                .withMinute(0).withSecond(0).withNano(0);
        Double monthlyRevenue = ticketRepository.sumRevenueByOrganizerEmailSince(email, firstDayOfMonth);
        if (monthlyRevenue == null)
            monthlyRevenue = 0.0;

        stats.put("totalEvents", totalEvents);
        stats.put("approvedEvents", approvedEvents);
        stats.put("pendingEvents", pendingEvents);
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue);
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("availableBalance", totalRevenue * 0.9); // Mock balance (90% after platform fee)
        stats.put("pendingBalance", totalRevenue * 0.1); // Mock pending for demonstration

        // Example Chart Data (Monthly Revenue)
        stats.put("revenueChart", Map.of(
                "labels", new String[] { "Jan", "Feb", "Mar", "Apr", "May" },
                "data", new Double[] { 1200.0, 1900.0, 3000.0, 5000.0, 2000.0 }));

        // Example Chart Data (Category Distribution)
        stats.put("categoryChart", Map.of(
                "labels", new String[] { "Tech", "Music", "Business", "Art" },
                "data", new Integer[] { 5, 3, 2, 2 }));

        return stats;
    }
}
