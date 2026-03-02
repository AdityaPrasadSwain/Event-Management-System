package com.sems.repository;

import com.sems.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.event e JOIN FETCH b.user u WHERE u.id = :userId")
    List<Booking> findByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.event e JOIN FETCH b.user u WHERE e.organizer.id = :organizerId")
    List<Booking> findByEventOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.event e JOIN FETCH b.user u WHERE e.id = :eventId")
    List<Booking> findByEventId(@Param("eventId") Long eventId);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.event.id = :eventId AND b.user.id = :userId AND b.bookingStatus NOT IN (com.sems.entity.BookingStatus.CANCELLED, com.sems.entity.BookingStatus.REJECTED)")
    boolean existsActiveBooking(@Param("eventId") Long eventId, @Param("userId") Long userId);

    Optional<Booking> findByTicketNumber(String ticketNumber);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.organizer.email = :email")
    long totalBookings(@Param("email") String email);

    @Query("SELECT SUM(b.advancePaid) FROM Booking b WHERE b.event.organizer.email = :email")
    Double totalRevenue(@Param("email") String email);

    List<Booking> findByBookingStatusAndExpiryTimeBefore(com.sems.entity.BookingStatus status,
            java.time.LocalDateTime time);
}
