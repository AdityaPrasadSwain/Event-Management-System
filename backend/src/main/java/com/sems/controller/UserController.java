package com.sems.controller;

import com.sems.dto.EventDTO;
import com.sems.dto.PasswordChangeRequest;
import com.sems.dto.TicketDTO;
import com.sems.dto.UserDTO;
import com.sems.service.UserService;
import com.sems.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @PostMapping("/upload-profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            Principal principal) throws java.io.IOException {
        String imagePath = fileStorageService.storeFile(file);
        userService.updateProfileImage(principal.getName(), imagePath);
        return ResponseEntity.ok(Map.of("message", "Profile image uploaded successfully", "url", imagePath));
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<EventDTO>> getApprovedEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(userService.getApprovedEvents(category, location));
    }

    @GetMapping("/events/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<EventDTO> getEventDetails(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getEventDetails(id));
    }

    /*
     * DEPRECATED: Use BookingController
     * 
     * @PostMapping("/events/{id}/register")
     * 
     * @PreAuthorize("hasRole('USER')")
     * public ResponseEntity<TicketDTO> bookEvent(@PathVariable Long id, Principal
     * principal) {
     * return ResponseEntity.ok(userService.bookEvent(id, principal.getName()));
     * }
     */

    /*
     * DEPRECATED: Use BookingController
     * 
     * @GetMapping("/bookings")
     * 
     * @PreAuthorize("hasRole('USER')")
     * public ResponseEntity<List<TicketDTO>> getMyBookings(Principal principal) {
     * return ResponseEntity.ok(userService.getMyBookings(principal.getName()));
     * }
     */

    /*
     * DEPRECATED: Use BookingController
     * 
     * @DeleteMapping("/bookings/{id}")
     * 
     * @PreAuthorize("hasRole('USER')")
     * public ResponseEntity<Void> cancelBooking(@PathVariable Long id, Principal
     * principal) {
     * userService.cancelBooking(id, principal.getName());
     * return ResponseEntity.noContent().build();
     * }
     */

    @PostMapping("/events/{id}/check-in")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> checkIn(@PathVariable Long id, @RequestBody Map<String, String> request,
            Principal principal) {
        String ticketCode = request.get("ticketCode");
        userService.checkIn(id, ticketCode, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Check-in successful"));
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getProfile(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO profileData,
            Principal principal) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), profileData));
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody com.sems.dto.PasswordChangeRequest request,
            Principal principal) {
        // userService.updatePassword(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully (DISABLED FOR DIAGNOSTICS)"));
    }
}
