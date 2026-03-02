package com.sems.dto;

import com.sems.entity.EventStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private Double pricePerPerson;
    private EventStatus status;
    private Integer capacity;
    private Integer remainingSeats;
    private Double minimumAdvancePercent;
    private String aiSummary;

    private Long categoryId;
    private String categoryName;

    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private List<String> imageUrls;

    public EventDTO() {
    }

    // Manual Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getPricePerPerson() {
        return pricePerPerson;
    }

    public void setPricePerPerson(Double pricePerPerson) {
        this.pricePerPerson = pricePerPerson;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getRemainingSeats() {
        return remainingSeats;
    }

    public void setRemainingSeats(Integer remainingSeats) {
        this.remainingSeats = remainingSeats;
    }

    public Double getMinimumAdvancePercent() {
        return minimumAdvancePercent;
    }

    public void setMinimumAdvancePercent(Double minimumAdvancePercent) {
        this.minimumAdvancePercent = minimumAdvancePercent;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public static EventDTOBuilder builder() {
        return new EventDTOBuilder();
    }

    public static class EventDTOBuilder {
        private Long id;
        private String title;
        private String description;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;
        private String location;
        private Double pricePerPerson;
        private EventStatus status;
        private Integer capacity;
        private Integer remainingSeats;
        private Double minimumAdvancePercent;
        private String aiSummary;
        private Long categoryId;
        private String categoryName;
        private Long organizerId;
        private String organizerName;
        private String organizerEmail;
        private List<String> imageUrls;

        public EventDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public EventDTOBuilder title(String title) {
            this.title = title;
            return this;
        }

        public EventDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public EventDTOBuilder startDateTime(LocalDateTime startDateTime) {
            this.startDateTime = startDateTime;
            return this;
        }

        public EventDTOBuilder endDateTime(LocalDateTime endDateTime) {
            this.endDateTime = endDateTime;
            return this;
        }

        public EventDTOBuilder location(String location) {
            this.location = location;
            return this;
        }

        public EventDTOBuilder pricePerPerson(Double pricePerPerson) {
            this.pricePerPerson = pricePerPerson;
            return this;
        }

        public EventDTOBuilder status(EventStatus status) {
            this.status = status;
            return this;
        }

        public EventDTOBuilder capacity(Integer capacity) {
            this.capacity = capacity;
            return this;
        }

        public EventDTOBuilder remainingSeats(Integer remainingSeats) {
            this.remainingSeats = remainingSeats;
            return this;
        }

        public EventDTOBuilder minimumAdvancePercent(Double minimumAdvancePercent) {
            this.minimumAdvancePercent = minimumAdvancePercent;
            return this;
        }

        public EventDTOBuilder aiSummary(String aiSummary) {
            this.aiSummary = aiSummary;
            return this;
        }

        public EventDTOBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public EventDTOBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public EventDTOBuilder organizerId(Long organizerId) {
            this.organizerId = organizerId;
            return this;
        }

        public EventDTOBuilder organizerName(String organizerName) {
            this.organizerName = organizerName;
            return this;
        }

        public EventDTOBuilder organizerEmail(String organizerEmail) {
            this.organizerEmail = organizerEmail;
            return this;
        }

        public EventDTOBuilder imageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
            return this;
        }

        public EventDTO build() {
            EventDTO dto = new EventDTO();
            dto.setId(id);
            dto.setTitle(title);
            dto.setDescription(description);
            dto.setStartDateTime(startDateTime);
            dto.setEndDateTime(endDateTime);
            dto.setLocation(location);
            dto.setPricePerPerson(pricePerPerson);
            dto.setStatus(status);
            dto.setCapacity(capacity);
            dto.setRemainingSeats(remainingSeats);
            dto.setMinimumAdvancePercent(minimumAdvancePercent);
            dto.setAiSummary(aiSummary);
            dto.setCategoryId(categoryId);
            dto.setCategoryName(categoryName);
            dto.setOrganizerId(organizerId);
            dto.setOrganizerName(organizerName);
            dto.setOrganizerEmail(organizerEmail);
            dto.setImageUrls(imageUrls);
            return dto;
        }
    }
}
