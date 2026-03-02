package com.sems.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizer_profiles")
public class OrganizerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private User user;

    @Column(nullable = false)
    private String organizationName;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false)
    private LocalDateTime applyDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizerStatus approvalStatus;

    public OrganizerProfile() {
    }

    // Manual Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public LocalDateTime getApplyDate() {
        return applyDate;
    }

    public void setApplyDate(LocalDateTime applyDate) {
        this.applyDate = applyDate;
    }

    public OrganizerStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(OrganizerStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public static OrganizerProfileBuilder builder() {
        return new OrganizerProfileBuilder();
    }

    public static class OrganizerProfileBuilder {
        private User user;
        private String organizationName;
        private String contactNumber;
        private LocalDateTime applyDate;
        private OrganizerStatus approvalStatus;

        public OrganizerProfileBuilder user(User user) {
            this.user = user;
            return this;
        }

        public OrganizerProfileBuilder organizationName(String organizationName) {
            this.organizationName = organizationName;
            return this;
        }

        public OrganizerProfileBuilder contactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
            return this;
        }

        public OrganizerProfileBuilder applyDate(LocalDateTime applyDate) {
            this.applyDate = applyDate;
            return this;
        }

        public OrganizerProfileBuilder approvalStatus(OrganizerStatus approvalStatus) {
            this.approvalStatus = approvalStatus;
            return this;
        }

        public OrganizerProfile build() {
            OrganizerProfile profile = new OrganizerProfile();
            profile.setUser(user);
            profile.setOrganizationName(organizationName);
            profile.setContactNumber(contactNumber);
            profile.setApplyDate(applyDate);
            profile.setApprovalStatus(approvalStatus);
            return profile;
        }
    }
}
