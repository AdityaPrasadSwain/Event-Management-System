package com.sems.service;

import com.sems.entity.Booking;
import com.sems.entity.BookingStatus;
import com.sems.entity.Event;
import com.sems.repository.BookingRepository;
import com.sems.repository.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(BookingCleanupService.class);
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    public BookingCleanupService(BookingRepository bookingRepository, EventRepository eventRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * Runs every minute to cleanup expired PENDING bookings.
     * Releases seats back to the event.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanupExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> expiredBookings = bookingRepository.findByBookingStatusAndExpiryTimeBefore(
                BookingStatus.PENDING, now);

        if (expiredBookings.isEmpty()) {
            return;
        }

        logger.info("Cleaning up {} expired bookings", expiredBookings.size());

        for (Booking booking : expiredBookings) {
            try {
                // Return seats to event
                Event event = booking.getEvent();
                event.setRemainingSeats(event.getRemainingSeats() + booking.getNumberOfPersons());
                eventRepository.save(event);

                // Update booking status
                booking.setBookingStatus(BookingStatus.CANCELLED); // Or a specific EXPIRED status if added later
                bookingRepository.save(booking);

                logger.info("Expired booking {} for event {}. Seats released: {}",
                        booking.getBookingReference(), event.getTitle(), booking.getNumberOfPersons());
            } catch (Exception e) {
                logger.error("Failed to cleanup booking {}: {}", booking.getId(), e.getMessage());
            }
        }
    }
}
