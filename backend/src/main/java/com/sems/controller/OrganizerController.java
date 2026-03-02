package com.sems.controller;

import com.sems.dto.EventRequest;
import com.sems.dto.EventResponse;
import com.sems.dto.OrganizerDashboardDTO;
import com.sems.entity.Category;
import com.sems.entity.Ticket;
import com.sems.service.OrganizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sems.dto.OrganizerStatusDTO;
import com.sems.service.FileStorageService;
import com.sems.repository.EventRepository;
import com.sems.repository.UserRepository;
import com.sems.entity.Event;
import com.sems.entity.User;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@RequiredArgsConstructor
public class OrganizerController {

    private final OrganizerService organizerService;
    private final FileStorageService fileStorageService;

    @PostMapping("/events/{id}/images")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<String>> uploadEventImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            Principal principal) throws IOException {

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(fileStorageService.storeFile(file));
        }

        organizerService.uploadEventImages(id, urls, principal.getName());

        return ResponseEntity.ok(urls);
    }

    @PostMapping("/profile-photo")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<String> uploadProfilePhoto(
            @RequestParam("file") MultipartFile file,
            Authentication auth) throws IOException {

        String path = fileStorageService.storeFile(file);
        organizerService.updateUserProfilePhoto(path, auth.getName());

        return ResponseEntity.ok(path);
    }

    @PostMapping("/events")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest request, Principal principal) {
        return ResponseEntity.ok(organizerService.createEvent(request, principal.getName()));
    }

    @PutMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long eventId, @RequestBody EventRequest request,
            Principal principal) {
        return ResponseEntity.ok(organizerService.updateEvent(eventId, request, principal.getName()));
    }

    @DeleteMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Void> cancelEvent(@PathVariable Long eventId, @RequestBody(required = false) String reason,
            Principal principal) {
        organizerService.cancelEvent(eventId, reason, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/my")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<EventResponse>> getMyEvents(Principal principal) {
        return ResponseEntity.ok(organizerService.getMyEvents(principal.getName()));
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<List<EventResponse>> getAllEvents(Principal principal) {
        // If we want to keep the old one for compatibility or admin viewing organizer
        // events?
        // The prompt asked for GET /api/organizer/events/my
        // The existing one was GET /api/organizer/events mapping to getMyEvents
        // I will keep the existing one but ALSO add the new specific path if requested,
        // OR just map the existing method to the new path if the old one isn't used by
        // others?
        // The prompt specifically asked for:
        // GET /api/organizer/events/my
        // Currently:
        // @GetMapping("/events") -> organizerService.getMyEvents
        // So /api/organizer/events ALREADY returns my events.
        // I will ADD the new path alias to be safe and explicit.
        return ResponseEntity.ok(organizerService.getMyEvents(principal.getName()));
    }

    @GetMapping("/events/{id}/attendees")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<Ticket>> getEventAttendees(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(organizerService.getEventAttendees(id, principal.getName()));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<com.sems.entity.Category>> getAllCategories() {
        return ResponseEntity.ok(organizerService.getAllCategories());
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<OrganizerDashboardDTO> getDashboardStats(Principal principal) {
        return ResponseEntity.ok(organizerService.getDashboardStats(principal.getName()));
    }

    @GetMapping("/feedbacks")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<com.sems.entity.Feedback>> getFeedbacks(Principal principal) {
        return ResponseEntity.ok(organizerService.getFeedbacks(principal.getName()));
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<com.sems.dto.OrganizerStatusDTO> getOrganizerStatus(Principal principal) {
        return ResponseEntity.ok(organizerService.getOrganizerStatus(principal.getName()));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<com.sems.dto.OrganizerAnalyticsDTO> getAnalytics(Principal principal) {
        return ResponseEntity.ok(organizerService.getAnalytics(principal.getName()));
    }
}
