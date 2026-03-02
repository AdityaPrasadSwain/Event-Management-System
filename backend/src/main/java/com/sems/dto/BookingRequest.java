package com.sems.dto;

import lombok.Data;

@Data
public class BookingRequest {
    @jakarta.validation.constraints.NotNull(message = "Event ID is required")
    private Long eventId;

    @jakarta.validation.constraints.Min(value = 1, message = "Number of persons must be at least 1")
    private int numberOfPersons;

    @jakarta.validation.constraints.NotNull(message = "Advance payment amount is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Advance payment cannot be negative")
    private Double advancePaid;
}
