package com.sems.repository;

import com.sems.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEventId(Long eventId);

    List<Feedback> findByUserId(Long userId);

    long countByEventOrganizerIdAndSentiment(Long organizerId, String sentiment);

    long countByEventOrganizerEmailAndSentiment(String email, String sentiment);

    List<Feedback> findByEventOrganizerId(Long organizerId);

    List<Feedback> findByEventOrganizerEmail(String email);
}
