package com.sems.util;

import com.sems.dto.EventDTO;
import com.sems.dto.UserDTO;
import com.sems.entity.Event;
import com.sems.entity.User;
import org.springframework.stereotype.Component;

@Component
public class DTOMapper {

    public static UserDTO toUserDTO(User user) {
        if (user == null)
            return null;

        UserDTO.UserDTOBuilder builder = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .phone(user.getPhone())
                .bio(user.getBio())
                .enabled(user.isEnabled());

        if (user.getOrganizerProfile() != null) {
            builder.organizationName(user.getOrganizerProfile().getOrganizationName())
                    .contactNumber(user.getOrganizerProfile().getContactNumber())
                    .organizerStatus(user.getOrganizerProfile().getApprovalStatus().name());
        }

        return builder.build();
    }

    public static EventDTO toEventDTO(Event event) {
        if (event == null)
            return null;

        EventDTO.EventDTOBuilder builder = EventDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .location(event.getLocation())
                .pricePerPerson(event.getPricePerPerson())
                .status(event.getStatus())
                .capacity(event.getCapacity())
                .remainingSeats(event.getRemainingSeats())
                .minimumAdvancePercent(event.getMinimumAdvancePercent())
                .aiSummary(event.getAiSummary())
                .imageUrls(event.getImageUrls() != null ? new java.util.ArrayList<>(event.getImageUrls())
                        : new java.util.ArrayList<>());

        if (event.getCategory() != null) {
            builder.categoryId(event.getCategory().getId())
                    .categoryName(event.getCategory().getName());
        }

        if (event.getOrganizer() != null) {
            builder.organizerId(event.getOrganizer().getId())
                    .organizerName(event.getOrganizer().getName())
                    .organizerEmail(event.getOrganizer().getEmail());
        }

        return builder.build();
    }

    public static com.sems.dto.TicketDTO toTicketDTO(com.sems.entity.Ticket ticket) {
        if (ticket == null)
            return null;

        com.sems.dto.TicketDTO.TicketDTOBuilder builder = com.sems.dto.TicketDTO.builder()
                .id(ticket.getId())
                .qrCode(ticket.getQrCode())
                .bookingDate(ticket.getBookingDate())
                .checkIn(ticket.isCheckIn());

        if (ticket.getEvent() != null) {
            builder.eventId(ticket.getEvent().getId())
                    .eventTitle(ticket.getEvent().getTitle())
                    .eventStartDateTime(ticket.getEvent().getStartDateTime())
                    .eventLocation(ticket.getEvent().getLocation())
                    .eventCategory(ticket.getEvent().getCategory() != null ? ticket.getEvent().getCategory().getName()
                            : "Uncategorized");
        }

        if (ticket.getUser() != null)

        {
            builder.userId(ticket.getUser().getId())
                    .userName(ticket.getUser().getName())
                    .userEmail(ticket.getUser().getEmail());
        }

        return builder.build();
    }

    public static com.sems.dto.AdminEventDto toAdminEventDto(Event event) {
        if (event == null)
            return null;

        return new com.sems.dto.AdminEventDto(
                event.getId(),
                event.getTitle(),
                event.getStatus(),
                event.getCategory() != null ? event.getCategory().getName() : "N/A",
                event.getOrganizer() != null ? event.getOrganizer().getName() : "N/A",
                event.getPricePerPerson(),
                event.getLocation(),
                event.getStartDateTime());
    }

    public static com.sems.dto.PendingOrganizerDto toPendingOrganizerDto(com.sems.entity.OrganizerProfile profile) {
        if (profile == null)
            return null;

        return new com.sems.dto.PendingOrganizerDto(
                profile.getUser().getId(),
                profile.getUser().getName(),
                profile.getUser().getEmail(),
                profile.getOrganizationName(),
                profile.getContactNumber(),
                profile.getApprovalStatus(),
                profile.getApplyDate());
    }
}
