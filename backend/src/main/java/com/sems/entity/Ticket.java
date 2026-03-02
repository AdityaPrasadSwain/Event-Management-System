package com.sems.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets", uniqueConstraints = {
        @UniqueConstraint(columnNames = "qrCode")
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "ticket_number", nullable = false, unique = true)
    private String ticketNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String qrCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_status", nullable = false)
    private EntryStatus entryStatus = EntryStatus.NOT_ENTERED;

    @Column(name = "entry_time")
    private LocalDateTime entryTime;

    @Column(name = "number_of_persons", nullable = false)
    private int numberOfPersons = 1;

    @Column(name = "ticket_total", nullable = false)
    private double ticketTotal = 0.0;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();

    @Column(name = "check_in")
    private boolean checkIn = false;

    public Ticket() {
    }

    // Manual Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public static TicketBuilder builder() {
        return new TicketBuilder();
    }

    public static class TicketBuilder {
        private Event event;
        private User user;
        private Booking booking;
        private String ticketNumber;
        private String qrCode;
        private EntryStatus entryStatus = EntryStatus.NOT_ENTERED;
        private LocalDateTime entryTime;
        private int numberOfPersons = 1;
        private double ticketTotal = 0.0;
        private LocalDateTime bookingDate = LocalDateTime.now();
        private boolean checkIn = false;

        public TicketBuilder event(Event event) {
            this.event = event;
            return this;
        }

        public TicketBuilder user(User user) {
            this.user = user;
            return this;
        }

        public TicketBuilder booking(Booking booking) {
            this.booking = booking;
            return this;
        }

        public TicketBuilder ticketNumber(String ticketNumber) {
            this.ticketNumber = ticketNumber;
            return this;
        }

        public TicketBuilder qrCode(String qrCode) {
            this.qrCode = qrCode;
            return this;
        }

        public TicketBuilder entryStatus(EntryStatus entryStatus) {
            this.entryStatus = entryStatus;
            return this;
        }

        public TicketBuilder entryTime(LocalDateTime entryTime) {
            this.entryTime = entryTime;
            return this;
        }

        public TicketBuilder numberOfPersons(int numberOfPersons) {
            this.numberOfPersons = numberOfPersons;
            return this;
        }

        public TicketBuilder ticketTotal(double ticketTotal) {
            this.ticketTotal = ticketTotal;
            return this;
        }

        public TicketBuilder bookingDate(LocalDateTime bookingDate) {
            this.bookingDate = bookingDate;
            return this;
        }

        public TicketBuilder checkIn(boolean checkIn) {
            this.checkIn = checkIn;
            return this;
        }

        public Ticket build() {
            Ticket ticket = new Ticket();
            ticket.setEvent(event);
            ticket.setUser(user);
            ticket.setBooking(booking);
            ticket.setTicketNumber(ticketNumber);
            ticket.setQrCode(qrCode);
            ticket.setEntryStatus(entryStatus);
            ticket.setEntryTime(entryTime);
            ticket.setNumberOfPersons(numberOfPersons);
            ticket.setTicketTotal(ticketTotal);
            ticket.setBookingDate(bookingDate);
            ticket.setCheckIn(checkIn);
            return ticket;
        }
    }
}
