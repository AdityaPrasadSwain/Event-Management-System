package com.sems.service.impl;

import com.sems.dto.EventRequest;
import com.sems.dto.EventResponse;
import com.sems.entity.Event;
import com.sems.entity.EventStatus;
import com.sems.entity.User;
import com.sems.repository.EventRepository;
import com.sems.repository.UserRepository;
import com.sems.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final com.sems.repository.CategoryRepository categoryRepository;

    @Override
    @Transactional
    @CacheEvict(value = { "events", "upcomingEvents", "organizerDashboard" }, allEntries = true)
    public EventResponse createEvent(EventRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        com.sems.entity.OrganizerProfile profile = organizer.getOrganizerProfile();
        if (profile == null) {
            throw new RuntimeException("Access Denied: You do not have an organizer profile.");
        }
        // Removed strict APPROVED check to allow pending organizers to "prepare"
        // events.
        // They will be created with status=PENDING by default (line 53).

        if (request.getStartDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Start date must be in the future");
        }
        if (request.getEndDateTime().isBefore(request.getStartDateTime())) {
            throw new RuntimeException("End date must be after start date");
        }

        com.sems.entity.Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .location(request.getLocation())
                .pricePerPerson(request.getPricePerPerson())
                .capacity(request.getCapacity())
                .remainingSeats(request.getCapacity())
                .minimumAdvancePercent(
                        request.getMinimumAdvancePercent() != null ? request.getMinimumAdvancePercent() : 100.0)
                .status(EventStatus.PENDING) // Default to PENDING for admin review
                .organizer(organizer)
                .category(category)
                .build();

        System.out.println("🔍 Creating event for organizer email: [" + email + "]");
        System.out.println("🔍 Organizer User ID: " + organizer.getId());

        Event savedEvent = eventRepository.save(event);
        System.out.println("✅ Event saved successfully with ID: " + savedEvent.getId() + " for organizer ID: "
                + savedEvent.getOrganizer().getId());
        return mapToDTO(savedEvent);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("events")
    public List<EventResponse> getAllEvents() {
        // Only show APPROVED, UPCOMING, or LIVE events to the public
        // Strict requirement: "Only APPROVED events visible to users"
        // But UPCOMING/LIVE are lifecycle states of an APPROVED event usually.
        // For now, let's filter by status explicitly if repository supports 'in' or
        // multiple.
        // Or cleaner: just use findByStatus(APPROVED).
        // If 'UPCOMING' is a status, then we need to decide if UPCOMING events are
        // 'APPROVED'.
        // In previous conversation, EventStatus had UPCOMING.
        // If 'APPROVED' is just a gateway status, and then it becomes UPCOMING...
        // The User Request says: Enum EventStatus { PENDING, APPROVED, REJECTED }
        // My EventStatus enum has { PENDING, APPROVED, REJECTED, UPCOMING, LIVE ... }
        // I should probably allow Approved, Upcoming, Live.
        // But for simplicity of the prompt "Only APPROVED events visible", I will start
        // with that.
        // Actually, if I look at my EventStatus enum, I have UPCOMING.
        // When admin approves, does it become APPROVED or UPCOMING?
        // AdminController.approveEvent sets it to APPROVED.
        // So I should return APPROVED events.
        return eventRepository.findByStatusWithDetails(EventStatus.APPROVED).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("upcomingEvents")
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findByStatus(EventStatus.UPCOMING).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "events", key = "#id")
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToDTO(event);
    }

    @Override
    @Transactional
    @CacheEvict(value = { "events", "upcomingEvents" }, allEntries = true)
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    private EventResponse mapToDTO(Event event) {
        return EventResponse.builder()
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
                .categoryId(event.getCategory() != null ? event.getCategory().getId() : null)
                .categoryName(event.getCategory() != null ? event.getCategory().getName() : "Uncategorized")
                .organizerId(event.getOrganizer().getId())
                .organizerName(event.getOrganizer().getName())
                .organizerEmail(event.getOrganizer().getEmail())
                .rejectionReason(event.getRejectionReason())
                .aiSummary(event.getAiSummary())
                .imageUrls(event.getImageUrls() != null ? new java.util.ArrayList<>(event.getImageUrls())
                        : new java.util.ArrayList<>())
                .build();
    }
}
