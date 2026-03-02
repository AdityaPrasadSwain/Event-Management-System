package com.sems.dto;

import com.sems.entity.EntryStatus;
import java.time.LocalDateTime;

public class TicketDTO {
    private Long id;
    private String ticketNumber;
    private String qrCode;
    private EntryStatus entryStatus;
    private LocalDateTime entryTime;
    private double ticketTotal;
    private LocalDateTime bookingDate;
    private boolean checkIn;

    // Event details
    private Long eventId;
    private String eventTitle;
    private LocalDateTime eventStartDateTime;
    private String eventLocation;
    private String eventCategory;

    // User details
    private Long userId;
    private String userName;
    private String userEmail;

    public TicketDTO() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public EntryStatus getEntryStatus() {
        return entryStatus;
    }

    public void setEntryStatus(EntryStatus entryStatus) {
        this.entryStatus = entryStatus;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public double getTicketTotal() {
        return ticketTotal;
    }

    public void setTicketTotal(double ticketTotal) {
        this.ticketTotal = ticketTotal;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public boolean isCheckIn() {
        return checkIn;
    }

    public void setCheckIn(boolean checkIn) {
        this.checkIn = checkIn;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public LocalDateTime getEventStartDateTime() {
        return eventStartDateTime;
    }

    public void setEventStartDateTime(LocalDateTime eventStartDateTime) {
        this.eventStartDateTime = eventStartDateTime;
    }

    public String getEventLocation() {
        return eventLocation;
    }

    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }

    public String getEventCategory() {
        return eventCategory;
    }

    public void setEventCategory(String eventCategory) {
        this.eventCategory = eventCategory;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public static TicketDTOBuilder builder() {
        return new TicketDTOBuilder();
    }

    public static class TicketDTOBuilder {
        private TicketDTO dto = new TicketDTO();

        public TicketDTOBuilder id(Long id) {
            dto.setId(id);
            return this;
        }

        public TicketDTOBuilder ticketNumber(String ticketNumber) {
            dto.setTicketNumber(ticketNumber);
            return this;
        }

        public TicketDTOBuilder qrCode(String qrCode) {
            dto.setQrCode(qrCode);
            return this;
        }

        public TicketDTOBuilder entryStatus(EntryStatus entryStatus) {
            dto.setEntryStatus(entryStatus);
            return this;
        }

        public TicketDTOBuilder entryTime(LocalDateTime entryTime) {
            dto.setEntryTime(entryTime);
            return this;
        }

        public TicketDTOBuilder ticketTotal(double ticketTotal) {
            dto.setTicketTotal(ticketTotal);
            return this;
        }

        public TicketDTOBuilder bookingDate(LocalDateTime bookingDate) {
            dto.setBookingDate(bookingDate);
            return this;
        }

        public TicketDTOBuilder checkIn(boolean checkIn) {
            dto.setCheckIn(checkIn);
            return this;
        }

        public TicketDTOBuilder eventId(Long eventId) {
            dto.setEventId(eventId);
            return this;
        }

        public TicketDTOBuilder eventTitle(String eventTitle) {
            dto.setEventTitle(eventTitle);
            return this;
        }

        public TicketDTOBuilder eventStartDateTime(LocalDateTime eventStartDateTime) {
            dto.setEventStartDateTime(eventStartDateTime);
            return this;
        }

        public TicketDTOBuilder eventLocation(String eventLocation) {
            dto.setEventLocation(eventLocation);
            return this;
        }

        public TicketDTOBuilder eventCategory(String eventCategory) {
            dto.setEventCategory(eventCategory);
            return this;
        }

        public TicketDTOBuilder userId(Long userId) {
            dto.setUserId(userId);
            return this;
        }

        public TicketDTOBuilder userName(String userName) {
            dto.setUserName(userName);
            return this;
        }

        public TicketDTOBuilder userEmail(String userEmail) {
            dto.setUserEmail(userEmail);
            return this;
        }

        public TicketDTO build() {
            return dto;
        }
    }
}
