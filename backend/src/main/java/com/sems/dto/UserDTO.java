package com.sems.dto;

import com.sems.entity.Role;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String profileImage;
    private boolean enabled;
    private String phone;
    private String bio;

    private String organizationName;
    private String contactNumber;
    private String organizerStatus;

    public UserDTO() {
    }

    public UserDTO(Long id, String name, String email, Role role, String profileImage, boolean enabled, String phone,
            String bio) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.profileImage = profileImage;
        this.enabled = enabled;
        this.phone = phone;
        this.bio = bio;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
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

    public String getOrganizerStatus() {
        return organizerStatus;
    }

    public void setOrganizerStatus(String organizerStatus) {
        this.organizerStatus = organizerStatus;
    }

    public static UserDTOBuilder builder() {
        return new UserDTOBuilder();
    }

    public static class UserDTOBuilder {
        private Long id;
        private String name;
        private String email;
        private Role role;
        private String profileImage;
        private boolean enabled;
        private String phone;
        private String bio;
        private String organizationName;
        private String contactNumber;
        private String organizerStatus;

        public UserDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserDTOBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserDTOBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserDTOBuilder profileImage(String profileImage) {
            this.profileImage = profileImage;
            return this;
        }

        public UserDTOBuilder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserDTOBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserDTOBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public UserDTOBuilder organizationName(String organizationName) {
            this.organizationName = organizationName;
            return this;
        }

        public UserDTOBuilder contactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
            return this;
        }

        public UserDTOBuilder organizerStatus(String organizerStatus) {
            this.organizerStatus = organizerStatus;
            return this;
        }

        public UserDTO build() {
            UserDTO dto = new UserDTO(id, name, email, role, profileImage, enabled, phone, bio);
            dto.setOrganizationName(organizationName);
            dto.setContactNumber(contactNumber);
            dto.setOrganizerStatus(organizerStatus);
            return dto;
        }
    }
}
