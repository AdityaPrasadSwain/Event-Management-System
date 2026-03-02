package com.sems.dto;

import com.sems.entity.EventStatus;

public record AdminEventDto(
        Long id,
        String title,
        EventStatus status,
        String categoryName,
        String organizerName,
        Double price,
        String location,
        java.time.LocalDateTime startDateTime) {
}
