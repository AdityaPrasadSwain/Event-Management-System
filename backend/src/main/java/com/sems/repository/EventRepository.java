package com.sems.repository;

import com.sems.entity.Event;
import com.sems.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(EventStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    java.util.Optional<Event> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.organizer WHERE e.id = :id")
    java.util.Optional<Event> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.organizer WHERE e.organizer.id = :organizerId")
    List<Event> findByOrganizerIdWithDetails(@Param("organizerId") Long organizerId);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.organizer WHERE e.organizer.email = :email")
    List<Event> findByOrganizerEmailWithDetails(@Param("email") String email);

    // Keep for backward compatibility if needed, but using the explicit one is
    // better
    List<Event> findByOrganizer_Id(Long organizerId);

    // ✅ FIXED: Search by category name (Derived Query Method)
    // This works because we navigate through the category relationship:
    // category.name
    List<Event> findByStatusAndCategory_NameContainingIgnoreCase(EventStatus status, String categoryName);

    // ✅ ALTERNATIVE: JPQL Query (Recommended for better control and readability)
    @Query("SELECT e FROM Event e WHERE e.status = :status AND LOWER(e.category.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))")
    List<Event> searchByStatusAndCategoryName(@Param("status") EventStatus status,
            @Param("categoryName") String categoryName);

    List<Event> findByStatusAndLocationContainingIgnoreCase(EventStatus status, String location);

    List<Event> findByStatusAndStartDateTimeAfter(EventStatus status, java.time.LocalDateTime date);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.organizer WHERE e.status = :status")
    List<Event> findByStatusWithDetails(@Param("status") EventStatus status);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.organizer")
    List<Event> findAllWithDetails();

    long countByOrganizerEmail(String email);

    long countByOrganizerEmailAndStatus(String email, EventStatus status);
}
