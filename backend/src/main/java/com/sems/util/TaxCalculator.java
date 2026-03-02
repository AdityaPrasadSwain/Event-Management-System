package com.sems.util;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class TaxCalculator {

    private static final double GST_RATE = 0.18; // 18% GST
    private static final double ADMIN_COMMISSION_PERCENT = 0.10; // 10% Admin Fee

    public static class FinancialBreakdown {
        public double baseTotal;
        public double adminCommission;
        public double gstOnCommission;
        public double organizerEarning;
        public double finalTotal;

        @Override
        public String toString() {
            return String.format("Base: %.2f, Comm: %.2f, GST: %.2f, Org: %.2f, Total: %.2f",
                    baseTotal, adminCommission, gstOnCommission, organizerEarning, finalTotal);
        }
    }

    public FinancialBreakdown calculate(double ticketPrice, int quantity) {
        FinancialBreakdown breakdown = new FinancialBreakdown();

        BigDecimal base = BigDecimal.valueOf(ticketPrice).multiply(BigDecimal.valueOf(quantity));
        BigDecimal commission = base.multiply(BigDecimal.valueOf(ADMIN_COMMISSION_PERCENT));
        BigDecimal gst = commission.multiply(BigDecimal.valueOf(GST_RATE));
        BigDecimal organizer = base.subtract(commission);

        breakdown.baseTotal = round(base);
        breakdown.adminCommission = round(commission);
        breakdown.gstOnCommission = round(gst);
        breakdown.organizerEarning = round(organizer);
        breakdown.finalTotal = round(base.add(gst)); // Standard model: platform fee + tax added to price

        return breakdown;
    }

    private double round(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
