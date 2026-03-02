package com.sems.dto;

import com.sems.entity.EventStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

public class EventResponse {

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
    private Long categoryId;
    private String categoryName;
    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private Double minimumAdvancePercent;
    private String rejectionReason;
    private String aiSummary;
    private List<String> imageUrls;

    public EventResponse() {
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

    public Double getMinimumAdvancePercent() {
        return minimumAdvancePercent;
    }

    public void setMinimumAdvancePercent(Double minimumAdvancePercent) {
        this.minimumAdvancePercent = minimumAdvancePercent;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public static EventResponseBuilder builder() {
        return new EventResponseBuilder();
    }

    public static class EventResponseBuilder {
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
        private Long categoryId;
        private String categoryName;
        private Long organizerId;
        private String organizerName;
        private String organizerEmail;
        private Double minimumAdvancePercent;
        private String rejectionReason;
        private String aiSummary;
        private List<String> imageUrls;

        public EventResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public EventResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public EventResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public EventResponseBuilder startDateTime(LocalDateTime startDateTime) {
            this.startDateTime = startDateTime;
            return this;
        }

        public EventResponseBuilder endDateTime(LocalDateTime endDateTime) {
            this.endDateTime = endDateTime;
            return this;
        }

        public EventResponseBuilder location(String location) {
            this.location = location;
            return this;
        }

        public EventResponseBuilder pricePerPerson(Double pricePerPerson) {
            this.pricePerPerson = pricePerPerson;
            return this;
        }

        public EventResponseBuilder status(EventStatus status) {
            this.status = status;
            return this;
        }

        public EventResponseBuilder capacity(Integer capacity) {
            this.capacity = capacity;
            return this;
        }

        public EventResponseBuilder remainingSeats(Integer remainingSeats) {
            this.remainingSeats = remainingSeats;
            return this;
        }

        public EventResponseBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public EventResponseBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public EventResponseBuilder organizerId(Long organizerId) {
            this.organizerId = organizerId;
            return this;
        }

        public EventResponseBuilder organizerName(String organizerName) {
            this.organizerName = organizerName;
            return this;
        }

        public EventResponseBuilder organizerEmail(String organizerEmail) {
            this.organizerEmail = organizerEmail;
            return this;
        }

        public EventResponseBuilder minimumAdvancePercent(Double minimumAdvancePercent) {
            this.minimumAdvancePercent = minimumAdvancePercent;
            return this;
        }

        public EventResponseBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public EventResponseBuilder aiSummary(String aiSummary) {
            this.aiSummary = aiSummary;
            return this;
        }

        public EventResponseBuilder imageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
            return this;
        }

        public EventResponse build() {
            EventResponse res = new EventResponse();
            res.setId(id);
            res.setTitle(title);
            res.setDescription(description);
            res.setStartDateTime(startDateTime);
            res.setEndDateTime(endDateTime);
            res.setLocation(location);
            res.setPricePerPerson(pricePerPerson);
            res.setStatus(status);
            res.setCapacity(capacity);
            res.setRemainingSeats(remainingSeats);
            res.setCategoryId(categoryId);
            res.setCategoryName(categoryName);
            res.setOrganizerId(organizerId);
            res.setOrganizerName(organizerName);
            res.setOrganizerEmail(organizerEmail);
            res.setMinimumAdvancePercent(minimumAdvancePercent);
            res.setRejectionReason(rejectionReason);
            res.setAiSummary(aiSummary);
            res.setImageUrls(imageUrls);
            return res;
        }
    }
}
