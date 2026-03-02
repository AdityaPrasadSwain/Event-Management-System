package com.sems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventRequest {
    @jakarta.validation.constraints.NotBlank(message = "Title is required")
    private String title;

    private String description;

    @jakarta.validation.constraints.NotNull(message = "Start date time is required")
    private java.time.LocalDateTime startDateTime;

    @jakarta.validation.constraints.NotNull(message = "End date time is required")
    private java.time.LocalDateTime endDateTime;

    @jakarta.validation.constraints.NotBlank(message = "Location is required")
    private String location;

    @jakarta.validation.constraints.NotNull(message = "Price is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Price must be non-negative")
    private Double pricePerPerson;

    @jakarta.validation.constraints.Min(value = 0, message = "Minimum advance must be at least 0")
    @jakarta.validation.constraints.Max(value = 100, message = "Minimum advance cannot exceed 100")
    private Double minimumAdvancePercent;

    @jakarta.validation.constraints.NotNull(message = "Capacity is required")
    @jakarta.validation.constraints.Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @jakarta.validation.constraints.NotNull(message = "Category is required")
    private Long categoryId;
}
