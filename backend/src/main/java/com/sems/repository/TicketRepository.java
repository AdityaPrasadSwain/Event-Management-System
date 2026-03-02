package com.sems.repository;

import com.sems.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT t FROM Ticket t JOIN FETCH t.event e JOIN FETCH t.user u WHERE u.id = :userId")
    List<Ticket> findTicketsWithUserAndEvent(@Param("userId") Long userId);

    List<Ticket> findByUserId(Long userId);

    List<Ticket> findByEventId(Long eventId);

    long countByEventOrganizerId(Long organizerId);

    long countByEventOrganizerEmail(String email);

    @Query("SELECT COALESCE(SUM(t.ticketTotal), 0.0) FROM Ticket t WHERE t.event.organizer.email = :email")
    Double sumRevenueByOrganizerEmail(@Param("email") String email);

    @Query("SELECT COALESCE(SUM(t.ticketTotal), 0.0) FROM Ticket t WHERE t.event.organizer.email = :email AND t.bookingDate >= :since")
    Double sumRevenueByOrganizerEmailSince(@Param("email") String email, @Param("since") java.time.LocalDateTime since);

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    Optional<Ticket> findByQrCode(String qrCode);

    boolean existsByEventAndUser(com.sems.entity.Event event, com.sems.entity.User user);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);
}
