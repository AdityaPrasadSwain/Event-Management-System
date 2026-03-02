package com.sems.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;

    @Column(nullable = false)
    private String location;

    @Column(name = "price_per_person")
    private Double pricePerPerson = 0.0;

    @Column(name = "minimum_advance_percent", nullable = false)
    private Double minimumAdvancePercent = 100.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.PENDING;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "remaining_seats", nullable = false)
    private Integer remainingSeats;

    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "approval_required", nullable = false)
    private boolean approvalRequired = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    @JsonIgnoreProperties({ "events", "password", "tickets" })
    private User organizer;

    @ElementCollection
    @CollectionTable(name = "event_images", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    public Event() {
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

    public Double getMinimumAdvancePercent() {
        return minimumAdvancePercent;
    }

    public void setMinimumAdvancePercent(Double minimumAdvancePercent) {
        this.minimumAdvancePercent = minimumAdvancePercent;
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

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }

    public boolean isApprovalRequired() {
        return approvalRequired;
    }

    public void setApprovalRequired(boolean approvalRequired) {
        this.approvalRequired = approvalRequired;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public static EventBuilder builder() {
        return new EventBuilder();
    }

    public static class EventBuilder {
        private String title;
        private String description;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;
        private String location;
        private Double pricePerPerson;
        private Double minimumAdvancePercent;
        private Integer capacity;
        private Integer remainingSeats;
        private Category category;
        private User organizer;
        private EventStatus status;

        public EventBuilder title(String title) {
            this.title = title;
            return this;
        }

        public EventBuilder description(String description) {
            this.description = description;
            return this;
        }

        public EventBuilder startDateTime(LocalDateTime startDateTime) {
            this.startDateTime = startDateTime;
            return this;
        }

        public EventBuilder endDateTime(LocalDateTime endDateTime) {
            this.endDateTime = endDateTime;
            return this;
        }

        public EventBuilder location(String location) {
            this.location = location;
            return this;
        }

        public EventBuilder pricePerPerson(Double pricePerPerson) {
            this.pricePerPerson = pricePerPerson;
            return this;
        }

        public EventBuilder minimumAdvancePercent(Double minimumAdvancePercent) {
            this.minimumAdvancePercent = minimumAdvancePercent;
            return this;
        }

        public EventBuilder capacity(Integer capacity) {
            this.capacity = capacity;
            return this;
        }

        public EventBuilder remainingSeats(Integer remainingSeats) {
            this.remainingSeats = remainingSeats;
            return this;
        }

        public EventBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public EventBuilder organizer(User organizer) {
            this.organizer = organizer;
            return this;
        }

        public EventBuilder status(EventStatus status) {
            this.status = status;
            return this;
        }

        public Event build() {
            Event event = new Event();
            event.setTitle(title);
            event.setDescription(description);
            event.setStartDateTime(startDateTime);
            event.setEndDateTime(endDateTime);
            event.setLocation(location);
            event.setPricePerPerson(pricePerPerson);
            event.setMinimumAdvancePercent(minimumAdvancePercent != null ? minimumAdvancePercent : 100.0);
            event.setCapacity(capacity);
            event.setRemainingSeats(remainingSeats != null ? remainingSeats : capacity);
            event.setCategory(category);
            event.setOrganizer(organizer);
            if (status != null)
                event.setStatus(status);
            return event;
        }
    }
}
