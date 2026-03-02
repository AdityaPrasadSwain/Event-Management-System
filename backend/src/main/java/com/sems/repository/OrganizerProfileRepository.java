package com.sems.repository;

import com.sems.entity.OrganizerProfile;
import com.sems.entity.OrganizerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizerProfileRepository extends JpaRepository<OrganizerProfile, Long> {
    List<OrganizerProfile> findByApprovalStatus(OrganizerStatus approvalStatus);

    Optional<OrganizerProfile> findByUserId(Long userId);
}
