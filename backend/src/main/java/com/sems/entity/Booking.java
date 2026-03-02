package com.sems.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true)
    private String ticketNumber;

    @Column(name = "number_of_persons", nullable = false)
    private int numberOfPersons = 1;

    @Column(name = "ticket_total", nullable = false)
    private double ticketTotal = 0.0;

    @Column(name = "user_fee", nullable = false)
    private double userFee = 0.0;

    @Column(name = "gst_on_user_fee", nullable = false)
    private double gstOnUserFee = 0.0;

    @Column(name = "admin_commission", nullable = false)
    private double adminCommission = 0.0;

    @Column(name = "gst_on_commission", nullable = false)
    private double gstOnCommission = 0.0;

    @Column(name = "gst_amount", nullable = false)
    private double gstAmount = 0.0;

    @Column(name = "organizer_earning", nullable = false)
    private double organizerEarning = 0.0;

    @Column(name = "advance_paid", nullable = false)
    private double advancePaid = 0.0;

    @Column(name = "remaining_amount", nullable = false)
    private double remainingAmount = 0.0;

    @Column(name = "final_amount", nullable = false)
    private double finalAmount = 0.0;

    @Column(name = "final_amount_paid", nullable = false)
    private double finalAmountPaid = 0.0;

    @Column(name = "expiry_time")
    private LocalDateTime expiryTime;

    @Column(name = "base_total")
    private double baseTotal = 0.0;

    @Column(name = "booking_reference", unique = true)
    private String bookingReference;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String qrCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_status", nullable = false)
    private EntryStatus entryStatus = EntryStatus.NOT_ENTERED;

    @Column(name = "entry_time")
    private LocalDateTime entryTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "approval_required", nullable = false)
    private boolean approvalRequired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Booking() {
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

    public double getGstAmount() {
        return gstAmount;
    }

    public void setGstAmount(double gstAmount) {
        this.gstAmount = gstAmount;
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

    public double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
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

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public boolean isApprovalRequired() {
        return approvalRequired;
    }

    public void setApprovalRequired(boolean approvalRequired) {
        this.approvalRequired = approvalRequired;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public double getBaseTotal() {
        return baseTotal;
    }

    public void setBaseTotal(double baseTotal) {
        this.baseTotal = baseTotal;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public void addTicket(Ticket ticket) {
        tickets.add(ticket);
        ticket.setBooking(this);
    }

    public void removeTicket(Ticket ticket) {
        tickets.remove(ticket);
        ticket.setBooking(null);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private String ticketNumber;
        private int numberOfPersons = 1;
        private double ticketTotal = 0.0;
        private double userFee = 0.0;
        private double gstOnUserFee = 0.0;
        private double adminCommission = 0.0;
        private double gstOnCommission = 0.0;
        private double gstAmount = 0.0;
        private double organizerEarning = 0.0;
        private double advancePaid = 0.0;
        private double remainingAmount = 0.0;
        private double finalAmount = 0.0;
        private double finalAmountPaid = 0.0;
        private BookingStatus bookingStatus = BookingStatus.PENDING;
        private String qrCode;
        private EntryStatus entryStatus = EntryStatus.NOT_ENTERED;
        private LocalDateTime entryTime;
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;
        private boolean approvalRequired;
        private Event event;
        private User user;
        private LocalDateTime expiryTime;
        private double baseTotal;
        private String bookingReference;
        private List<Ticket> tickets = new ArrayList<>();

        public BookingBuilder ticketNumber(String ticketNumber) {
            this.ticketNumber = ticketNumber;
            return this;
        }

        public BookingBuilder numberOfPersons(int numberOfPersons) {
            this.numberOfPersons = numberOfPersons;
            return this;
        }

        public BookingBuilder ticketTotal(double ticketTotal) {
            this.ticketTotal = ticketTotal;
            return this;
        }

        public BookingBuilder userFee(double userFee) {
            this.userFee = userFee;
            return this;
        }

        public BookingBuilder gstOnUserFee(double gstOnUserFee) {
            this.gstOnUserFee = gstOnUserFee;
            return this;
        }

        public BookingBuilder adminCommission(double adminCommission) {
            this.adminCommission = adminCommission;
            return this;
        }

        public BookingBuilder gstOnCommission(double gstOnCommission) {
            this.gstOnCommission = gstOnCommission;
            return this;
        }

        public BookingBuilder gstAmount(double gstAmount) {
            this.gstAmount = gstAmount;
            return this;
        }

        public BookingBuilder organizerEarning(double organizerEarning) {
            this.organizerEarning = organizerEarning;
            return this;
        }

        public BookingBuilder advancePaid(double advancePaid) {
            this.advancePaid = advancePaid;
            return this;
        }

        public BookingBuilder remainingAmount(double remainingAmount) {
            this.remainingAmount = remainingAmount;
            return this;
        }

        public BookingBuilder finalAmount(double finalAmount) {
            this.finalAmount = finalAmount;
            return this;
        }

        public BookingBuilder finalAmountPaid(double finalAmountPaid) {
            this.finalAmountPaid = finalAmountPaid;
            return this;
        }

        public BookingBuilder bookingStatus(BookingStatus bookingStatus) {
            this.bookingStatus = bookingStatus;
            return this;
        }

        public BookingBuilder qrCode(String qrCode) {
            this.qrCode = qrCode;
            return this;
        }

        public BookingBuilder entryStatus(EntryStatus entryStatus) {
            this.entryStatus = entryStatus;
            return this;
        }

        public BookingBuilder entryTime(LocalDateTime entryTime) {
            this.entryTime = entryTime;
            return this;
        }

        public BookingBuilder paymentStatus(PaymentStatus paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public BookingBuilder approvalRequired(boolean approvalRequired) {
            this.approvalRequired = approvalRequired;
            return this;
        }

        public BookingBuilder event(Event event) {
            this.event = event;
            return this;
        }

        public BookingBuilder user(User user) {
            this.user = user;
            return this;
        }

        public BookingBuilder expiryTime(LocalDateTime expiryTime) {
            this.expiryTime = expiryTime;
            return this;
        }

        public BookingBuilder baseTotal(double baseTotal) {
            this.baseTotal = baseTotal;
            return this;
        }

        public BookingBuilder bookingReference(String bookingReference) {
            this.bookingReference = bookingReference;
            return this;
        }

        public BookingBuilder tickets(List<Ticket> tickets) {
            this.tickets = tickets;
            return this;
        }

        public Booking build() {
            Booking booking = new Booking();
            booking.setTicketNumber(ticketNumber);
            booking.setNumberOfPersons(numberOfPersons);
            booking.setTicketTotal(ticketTotal);
            booking.setUserFee(userFee);
            booking.setGstOnUserFee(gstOnUserFee);
            booking.setAdminCommission(adminCommission);
            booking.setGstOnCommission(gstOnCommission);
            booking.setGstAmount(gstAmount);
            booking.setOrganizerEarning(organizerEarning);
            booking.setAdvancePaid(advancePaid);
            booking.setRemainingAmount(remainingAmount);
            booking.setFinalAmount(finalAmount);
            booking.setFinalAmountPaid(finalAmountPaid);
            booking.setBookingStatus(bookingStatus);
            booking.setQrCode(qrCode);
            booking.setEntryStatus(entryStatus);
            booking.setEntryTime(entryTime);
            booking.setPaymentStatus(paymentStatus);
            booking.setApprovalRequired(approvalRequired);
            booking.setEvent(event);
            booking.setUser(user);
            booking.setExpiryTime(expiryTime);
            booking.setBaseTotal(baseTotal);
            booking.setBookingReference(bookingReference);
            if (tickets != null) {
                tickets.forEach(booking::addTicket);
            }
            return booking;
        }
    }
}
