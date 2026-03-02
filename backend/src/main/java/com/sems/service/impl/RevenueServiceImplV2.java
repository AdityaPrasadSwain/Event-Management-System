package com.sems.service.impl;

import com.sems.entity.Event;
import com.sems.repository.BookingRepository;
import com.sems.repository.GlobalSettingRepository;
import com.sems.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RevenueServiceImplV2 implements RevenueService {

    private final GlobalSettingRepository globalSettingRepository;
    private final BookingRepository bookingRepository;

    @Override
    public Map<String, Double> calculateBreakdown(Event event, int numberOfPersons) {
        double commissionRate = getSetting("COMMISSION_RATE", 10.0);
        double userFeeRate = getSetting("USER_FEE_RATE", 5.0);
        double gstRate = getSetting("GST_RATE", 18.0);

        double pricePerPerson = event.getPricePerPerson() != null ? event.getPricePerPerson() : 0.0;
        double ticketTotal = round(pricePerPerson * numberOfPersons);

        double userFee = round(ticketTotal * (userFeeRate / 100.0));
        double gstOnUserFee = round(userFee * (gstRate / 100.0));

        double adminCommission = round(ticketTotal * (commissionRate / 100.0));
        double gstOnCommission = round(adminCommission * (gstRate / 100.0));

        double organizerEarning = round(ticketTotal - adminCommission);
        double totalUserPayable = round(ticketTotal + userFee + gstOnUserFee);
        double gstAmount = round(gstOnUserFee + gstOnCommission);

        Map<String, Double> breakdown = new HashMap<>();
        breakdown.put("ticketTotal", ticketTotal);
        breakdown.put("userFee", userFee);
        breakdown.put("gstOnUserFee", gstOnUserFee);
        breakdown.put("adminCommission", adminCommission);
        breakdown.put("gstOnCommission", gstOnCommission);
        breakdown.put("gstAmount", gstAmount);
        breakdown.put("organizerEarning", organizerEarning);
        breakdown.put("finalAmount", totalUserPayable);

        return breakdown;
    }

    @Override
    public com.sems.util.TaxCalculator.FinancialBreakdown getEventFinancialBreakdown(Event event, int numberOfPersons) {
        double commissionRate = getSetting("COMMISSION_RATE", 10.0) / 100.0;
        double gstRate = getSetting("GST_RATE", 18.0) / 100.0;

        double pricePerPerson = event.getPricePerPerson() != null ? event.getPricePerPerson() : 0.0;
        double basePriceTotal = pricePerPerson * numberOfPersons;

        double adminCommission = round(basePriceTotal * commissionRate);
        double gstOnCommission = round(adminCommission * gstRate);
        double organizerEarning = round(basePriceTotal - adminCommission);
        double finalTotal = round(basePriceTotal + gstOnCommission);

        com.sems.util.TaxCalculator.FinancialBreakdown breakdown = new com.sems.util.TaxCalculator.FinancialBreakdown();
        breakdown.baseTotal = round(basePriceTotal);
        breakdown.adminCommission = adminCommission;
        breakdown.gstOnCommission = gstOnCommission;
        breakdown.organizerEarning = organizerEarning;
        breakdown.finalTotal = finalTotal;

        return breakdown;
    }

    @Override
    public Map<String, Object> getAdminRevenueSummary() {
        Map<String, Object> summary = new HashMap<>();

        long totalBookings = bookingRepository.count();

        double totalCommissionEarned = bookingRepository.findAll().stream()
                .mapToDouble(b -> b.getAdminCommission() + b.getGstOnCommission())
                .sum();

        double totalUserFees = bookingRepository.findAll().stream()
                .mapToDouble(b -> b.getUserFee() + b.getGstOnUserFee())
                .sum();

        double totalGSTCollected = bookingRepository.findAll().stream()
                .mapToDouble(b -> b.getGstAmount())
                .sum();

        double totalOrganizerPayout = bookingRepository.findAll().stream()
                .mapToDouble(b -> b.getOrganizerEarning())
                .sum();

        double netPlatformRevenue = (totalCommissionEarned + totalUserFees) - totalGSTCollected;

        summary.put("totalBookings", totalBookings);
        summary.put("totalCommissionEarned", round(totalCommissionEarned));
        summary.put("totalUserFees", round(totalUserFees));
        summary.put("totalGSTCollected", round(totalGSTCollected));
        summary.put("totalOrganizerPayout", round(totalOrganizerPayout));
        summary.put("netPlatformRevenue", round(netPlatformRevenue));

        return summary;
    }

    @Override
    public double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private double getSetting(String key, double defaultValue) {
        return globalSettingRepository.findBySettingKey(key)
                .map(s -> Double.parseDouble(s.getSettingValue()))
                .orElse(defaultValue);
    }
}
