package com.sems.dto;

import com.sems.entity.BookingStatus;
import com.sems.entity.PaymentStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

public class BookingDTO {
    private Long id;
    private String ticketNumber;
    private String qrCode;
    private int numberOfPersons;
    private double ticketTotal;
    private double userFee;
    private double gstOnUserFee;
    private double adminCommission;
    private double gstOnCommission;
    private double organizerEarning;
    private double advancePaid;
    private double remainingAmount;
    private double finalAmountPaid;
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private String attendanceStatus;

    private Long eventId;
    private String eventTitle;
    private LocalDateTime eventStartDateTime;
    private String eventLocation;

    private Long userId;
    private String userName;
    private String userEmail;

    private String bookingReference;
    private List<TicketDTO> tickets = new ArrayList<>();

    public BookingDTO() {
    }

    // Manual Getters and Setters
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

    public int getNumberOfPersons() {
        return numberOfPersons;
    }

    public void setNumberOfPersons(int numberOfPersons) {
        this.numberOfPersons = numberOfPersons;
    }

    public double getTicketTotal() {
        return ticketTotal;
    }

    public void setTicketTotal(double ticketTotal) {
        this.ticketTotal = ticketTotal;
    }

    public double getUserFee() {
        return userFee;
    }

    public void setUserFee(double userFee) {
        this.userFee = userFee;
    }

    public double getGstOnUserFee() {
        return gstOnUserFee;
    }

    public void setGstOnUserFee(double gstOnUserFee) {
        this.gstOnUserFee = gstOnUserFee;
    }

    public double getAdminCommission() {
        return adminCommission;
    }

    public void setAdminCommission(double adminCommission) {
        this.adminCommission = adminCommission;
    }

    public double getGstOnCommission() {
        return gstOnCommission;
    }

    public void setGstOnCommission(double gstOnCommission) {
        this.gstOnCommission = gstOnCommission;
    }

    public double getOrganizerEarning() {
        return organizerEarning;
    }

    public void setOrganizerEarning(double organizerEarning) {
        this.organizerEarning = organizerEarning;
    }

    public double getAdvancePaid() {
        return advancePaid;
    }

    public void setAdvancePaid(double advancePaid) {
        this.advancePaid = advancePaid;
    }

    public double getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(double remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getFinalAmountPaid() {
        return finalAmountPaid;
    }

    public void setFinalAmountPaid(double finalAmountPaid) {
        this.finalAmountPaid = finalAmountPaid;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
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

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public List<TicketDTO> getTickets() {
        return tickets;
    }

    public void setTickets(List<TicketDTO> tickets) {
        this.tickets = tickets;
    }

    public static BookingDTOBuilder builder() {
        return new BookingDTOBuilder();
    }

    public static class BookingDTOBuilder {
        private Long id;
        private String ticketNumber;
        private String qrCode;
        private int numberOfPersons;
        private double ticketTotal;
        private double userFee;
        private double gstOnUserFee;
        private double adminCommission;
        private double gstOnCommission;
        private double organizerEarning;
        private double advancePaid;
        private double remainingAmount;
        private double finalAmountPaid;
        private BookingStatus bookingStatus;
        private PaymentStatus paymentStatus;
        private LocalDateTime createdAt;
        private String attendanceStatus;
        private Long eventId;
        private String eventTitle;
        private LocalDateTime eventStartDateTime;
        private String eventLocation;
        private Long userId;
        private String userName;
        private String userEmail;
        private String bookingReference;
        private List<TicketDTO> tickets = new ArrayList<>();

        public BookingDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BookingDTOBuilder ticketNumber(String ticketNumber) {
            this.ticketNumber = ticketNumber;
            return this;
        }

        public BookingDTOBuilder qrCode(String qrCode) {
            this.qrCode = qrCode;
            return this;
        }

        public BookingDTOBuilder numberOfPersons(int numberOfPersons) {
            this.numberOfPersons = numberOfPersons;
            return this;
        }

        public BookingDTOBuilder ticketTotal(double ticketTotal) {
            this.ticketTotal = ticketTotal;
            return this;
        }

        public BookingDTOBuilder userFee(double userFee) {
            this.userFee = userFee;
            return this;
        }

        public BookingDTOBuilder gstOnUserFee(double gstOnUserFee) {
            this.gstOnUserFee = gstOnUserFee;
            return this;
        }

        public BookingDTOBuilder adminCommission(double adminCommission) {
            this.adminCommission = adminCommission;
            return this;
        }

        public BookingDTOBuilder gstOnCommission(double gstOnCommission) {
            this.gstOnCommission = gstOnCommission;
            return this;
        }

        public BookingDTOBuilder organizerEarning(double organizerEarning) {
            this.organizerEarning = organizerEarning;
            return this;
        }

        public BookingDTOBuilder advancePaid(double advancePaid) {
            this.advancePaid = advancePaid;
            return this;
        }

        public BookingDTOBuilder remainingAmount(double remainingAmount) {
            this.remainingAmount = remainingAmount;
            return this;
        }

        public BookingDTOBuilder finalAmountPaid(double finalAmountPaid) {
            this.finalAmountPaid = finalAmountPaid;
            return this;
        }

        public BookingDTOBuilder bookingStatus(BookingStatus bookingStatus) {
            this.bookingStatus = bookingStatus;
            return this;
        }

        public BookingDTOBuilder paymentStatus(PaymentStatus paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public BookingDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public BookingDTOBuilder attendanceStatus(String attendanceStatus) {
            this.attendanceStatus = attendanceStatus;
            return this;
        }

        public BookingDTOBuilder eventId(Long eventId) {
            this.eventId = eventId;
            return this;
        }

        public BookingDTOBuilder eventTitle(String eventTitle) {
            this.eventTitle = eventTitle;
            return this;
        }

        public BookingDTOBuilder eventStartDateTime(LocalDateTime eventStartDateTime) {
            this.eventStartDateTime = eventStartDateTime;
            return this;
        }

        public BookingDTOBuilder eventLocation(String eventLocation) {
            this.eventLocation = eventLocation;
            return this;
        }

        public BookingDTOBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public BookingDTOBuilder userName(String userName) {
            this.userName = userName;
            return this;
        }

        public BookingDTOBuilder userEmail(String userEmail) {
            this.userEmail = userEmail;
            return this;
        }

        public BookingDTOBuilder bookingReference(String bookingReference) {
            this.bookingReference = bookingReference;
            return this;
        }

        public BookingDTOBuilder tickets(List<TicketDTO> tickets) {
            this.tickets = tickets;
            return this;
        }

        public BookingDTO build() {
            BookingDTO dto = new BookingDTO();
            dto.setId(id);
            dto.setTicketNumber(ticketNumber);
            dto.setQrCode(qrCode);
            dto.setNumberOfPersons(numberOfPersons);
            dto.setTicketTotal(ticketTotal);
            dto.setUserFee(userFee);
            dto.setGstOnUserFee(gstOnUserFee);
            dto.setAdminCommission(adminCommission);
            dto.setGstOnCommission(gstOnCommission);
            dto.setOrganizerEarning(organizerEarning);
            dto.setAdvancePaid(advancePaid);
            dto.setRemainingAmount(remainingAmount);
            dto.setFinalAmountPaid(finalAmountPaid);
            dto.setBookingStatus(bookingStatus);
            dto.setPaymentStatus(paymentStatus);
            dto.setCreatedAt(createdAt);
            dto.setAttendanceStatus(attendanceStatus);
            dto.setEventId(eventId);
            dto.setEventTitle(eventTitle);
            dto.setEventStartDateTime(eventStartDateTime);
            dto.setEventLocation(eventLocation);
            dto.setUserId(userId);
            dto.setUserName(userName);
            dto.setUserEmail(userEmail);
            dto.setBookingReference(bookingReference);
            dto.setTickets(tickets);
            return dto;
        }
    }
}
