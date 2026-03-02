package com.sems.service;

import com.sems.dto.BookingRequest;
import com.sems.entity.Booking;
import com.sems.entity.Event;

import java.util.Map;

public interface RevenueService {

    Map<String, Double> calculateBreakdown(Event event, int numberOfPersons);

    /**
     * Advanced calculation using TaxCalculator logic and system settings.
     */
    com.sems.util.TaxCalculator.FinancialBreakdown getEventFinancialBreakdown(Event event, int numberOfPersons);

    /**
     * Aggregates platform-wide revenue statistics for admins.
     */
    Map<String, Object> getAdminRevenueSummary();

    /**
     * Formats financial values to 2 decimal places.
     */
    double round(double value);
}
