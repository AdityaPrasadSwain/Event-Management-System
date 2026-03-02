package com.sems.repository;

import com.sems.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("SELECT a FROM Attendance a JOIN FETCH a.event e JOIN FETCH a.user u WHERE e.id = :eventId")
    List<Attendance> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT a FROM Attendance a JOIN FETCH a.event e WHERE a.user.id = :userId")
    List<Attendance> findByUserId(@Param("userId") Long userId);

    Optional<Attendance> findByBookingId(Long bookingId);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);
}
