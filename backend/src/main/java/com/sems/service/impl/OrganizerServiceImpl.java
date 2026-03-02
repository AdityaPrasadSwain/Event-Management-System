package com.sems.service.impl;

import com.sems.dto.EventRequest;
import com.sems.dto.EventResponse;
import com.sems.dto.OrganizerDashboardDTO;
import com.sems.dto.OrganizerStatusDTO;
import com.sems.entity.Category;
import com.sems.entity.Event;
import com.sems.entity.EventStatus;
import com.sems.entity.Ticket;
import com.sems.entity.User;
import com.sems.repository.CategoryRepository;
import com.sems.repository.EventRepository;
import com.sems.repository.TicketRepository;
import com.sems.repository.UserRepository;
import com.sems.repository.FeedbackRepository;
import com.sems.service.OrganizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizerServiceImpl implements OrganizerService {

        private final EventRepository eventRepository;
        private final UserRepository userRepository;
        private final TicketRepository ticketRepository;
        private final CategoryRepository categoryRepository;
        private final FeedbackRepository feedbackRepository;
        private final com.sems.repository.BookingRepository bookingRepository;
        private final com.sems.service.EmailService emailService;

        @Override
        @Transactional
        @org.springframework.cache.annotation.CacheEvict(value = "organizerDashboard", key = "#organizerEmail")
        public EventResponse createEvent(EventRequest request, String organizerEmail) {
                User organizer = userRepository.findByEmail(organizerEmail)
                                .orElseThrow(() -> new RuntimeException("Organizer not found"));

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));

                Event event = Event.builder()
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .startDateTime(request.getStartDateTime())
                                .endDateTime(request.getEndDateTime())
                                .location(request.getLocation())
                                .pricePerPerson(request.getPricePerPerson())
                                .category(category)
                                .capacity(request.getCapacity())
                                .remainingSeats(request.getCapacity())
                                .organizer(organizer)
                                .status(EventStatus.PENDING) // Default status
                                .build();

                Event savedEvent = eventRepository.save(event);

                // Notify Admin
                try {
                        java.util.Map<String, Object> vars = new java.util.HashMap<>();
                        vars.put("eventTitle", savedEvent.getTitle());
                        vars.put("organizerName", organizer.getName());
                        vars.put("applyDate", java.time.LocalDateTime.now().toString());
                        vars.put("reviewLink", "http://localhost:5181/admin/events"); // Adjust as needed

                        emailService.sendHtmlEmail(
                                        "admin@sems.com", // Assuming admin email
                                        "New Event Submitted: " + savedEvent.getTitle(),
                                        "admin-new-event",
                                        vars);
                } catch (Exception e) {
                        System.err.println("Failed to send admin notification: " + e.getMessage());
                }

                return mapToDTO(savedEvent);
        }

        @Override
        @Transactional
        @org.springframework.cache.annotation.CacheEvict(value = "organizerDashboard", key = "#organizerEmail")
        public EventResponse updateEvent(Long eventId, EventRequest request, String organizerEmail) {
                Event event = getOwnedEvent(eventId, organizerEmail);

                if (event.getStatus() != EventStatus.PENDING && event.getStatus() != EventStatus.REJECTED) {
                        throw new RuntimeException("Cannot update event after approval. Contact admin.");
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));

                event.setTitle(request.getTitle());
                event.setDescription(request.getDescription());
                event.setStartDateTime(request.getStartDateTime());
                event.setEndDateTime(request.getEndDateTime());
                event.setLocation(request.getLocation());
                event.setCategory(category);
                event.setPricePerPerson(request.getPricePerPerson());
                event.setCapacity(request.getCapacity());

                Event savedEvent = eventRepository.save(event);
                return mapToDTO(savedEvent);
        }

        @Override
        @Transactional
        @org.springframework.cache.annotation.CacheEvict(value = "organizerDashboard", key = "#organizerEmail")
        public void cancelEvent(Long eventId, String cancelReason, String organizerEmail) {
                Event event = getOwnedEvent(eventId, organizerEmail);
                event.setStatus(EventStatus.CANCELLED);
                if (cancelReason != null && !cancelReason.isBlank()) {
                        event.setDescription(event.getDescription() + " [CANCELLED: " + cancelReason + "]");
                }
                eventRepository.save(event);
        }

        @Override
        @Transactional(readOnly = true)
        public List<EventResponse> getMyEvents(String organizerEmail) {
                System.out.println("🔍 Fetching events for organizer email: [" + organizerEmail + "]");
                List<Event> events = eventRepository.findByOrganizerEmailWithDetails(organizerEmail);
                System.out.println("🔍 Database Query findByOrganizerEmailWithDetails(" + organizerEmail
                                + ") returned: " + events.size() + " events");

                if (events.isEmpty()) {
                        System.out.println("⚠️ No events found for organizer email: " + organizerEmail);
                        long totalInDb = eventRepository.count();
                        System.out.println("🔍 Total events in database (all organizers): " + totalInDb);
                }

                return events.stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<Ticket> getEventAttendees(Long eventId, String organizerEmail) {
                Event event = getOwnedEvent(eventId, organizerEmail);
                return ticketRepository.findByEventId(event.getId());
        }

        @Override
        @Transactional(readOnly = true)
        @org.springframework.cache.annotation.Cacheable(value = "organizerDashboard", key = "#organizerEmail")
        public OrganizerDashboardDTO getDashboardStats(String organizerEmail) {
                System.out.println("🔍 Fetching dashboard stats for organizer email: [" + organizerEmail + "]");
                User organizer = userRepository.findByEmail(organizerEmail)
                                .orElseThrow(() -> new RuntimeException("Organizer not found"));

                List<Event> myEvents = eventRepository.findByOrganizerEmailWithDetails(organizerEmail);
                System.out.println("🔍 Dashboard events count for " + organizerEmail + ": " + myEvents.size());

                long totalEvents = myEvents.size();
                long approvedEvents = myEvents.stream().filter(e -> e.getStatus() == EventStatus.APPROVED
                                || e.getStatus() == EventStatus.LIVE || e.getStatus() == EventStatus.UPCOMING).count();
                long pendingEvents = myEvents.stream().filter(e -> e.getStatus() == EventStatus.PENDING).count();

                long totalBookings = bookingRepository.totalBookings(organizerEmail);
                Double revenue = bookingRepository.totalRevenue(organizerEmail);

                return OrganizerDashboardDTO.builder()
                                .totalEvents(totalEvents)
                                .approvedEvents(approvedEvents)
                                .pendingEvents(pendingEvents)
                                .totalBookings(totalBookings)
                                .revenue(revenue != null ? revenue : 0.0)
                                .totalRegistrations(totalBookings)
                                .sentimentData(calculateSentimentData(organizer.getId()))
                                .revenueChart(generateRevenueChartData(myEvents))
                                .categoryChart(generateCategoryChartData(myEvents))
                                .build();
        }

        private java.util.Map<String, Object> generateRevenueChartData(List<Event> events) {
                java.util.List<String> labels = java.util.List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun");
                java.util.List<Double> data = java.util.List.of(1200.0, 1900.0, 3000.0, 5000.0, 2000.0, 3000.0);
                return java.util.Map.of("labels", labels, "data", data);
        }

        private java.util.Map<String, Object> generateCategoryChartData(List<Event> events) {
                java.util.List<String> labels = java.util.List.of("Music", "Tech", "Art", "Business");
                java.util.List<Integer> data = java.util.List.of(10, 5, 8, 3);
                return java.util.Map.of("labels", labels, "data", data);
        }

        private java.util.List<java.util.Map<String, Object>> calculateSentimentData(Long organizerId) {
                long positive = feedbackRepository.countByEventOrganizerIdAndSentiment(organizerId, "POSITIVE");
                long neutral = feedbackRepository.countByEventOrganizerIdAndSentiment(organizerId, "NEUTRAL");
                long negative = feedbackRepository.countByEventOrganizerIdAndSentiment(organizerId, "NEGATIVE");

                if (positive == 0 && neutral == 0 && negative == 0) {
                        positive = 5;
                        neutral = 2;
                        negative = 1;
                }

                java.util.List<java.util.Map<String, Object>> data = new java.util.ArrayList<>();
                data.add(java.util.Map.of("name", "Positive", "value", positive));
                data.add(java.util.Map.of("name", "Neutral", "value", neutral));
                data.add(java.util.Map.of("name", "Negative", "value", negative));
                return data;
        }

        @Override
        @Transactional(readOnly = true)
        public List<com.sems.entity.Feedback> getFeedbacks(String email) {
                User organizer = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Organizer not found"));
                return feedbackRepository.findByEventOrganizerId(organizer.getId());
        }

        @Override
        @Transactional(readOnly = true)
        public List<Category> getAllCategories() {
                return categoryRepository.findAll();
        }

        private Event getOwnedEvent(long eventId, String organizerEmail) {
                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new RuntimeException("Event not found"));

                if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
                        throw new RuntimeException("Unauthorized: You are not the organizer of this event");
                }
                return event;
        }

        private EventResponse mapToDTO(Event event) {
                if (event == null)
                        return null;

                EventResponse.EventResponseBuilder builder = EventResponse.builder()
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
                                .minimumAdvancePercent(event.getMinimumAdvancePercent());

                if (event.getCategory() != null) {
                        builder.categoryId(event.getCategory().getId())
                                        .categoryName(event.getCategory().getName());
                } else {
                        builder.categoryName("Uncategorized");
                }

                if (event.getOrganizer() != null) {
                        builder.organizerId(event.getOrganizer().getId())
                                        .organizerName(event.getOrganizer().getName())
                                        .organizerEmail(event.getOrganizer().getEmail());
                }

                builder.imageUrls(event.getImageUrls() != null ? new java.util.ArrayList<>(event.getImageUrls())
                                : new java.util.ArrayList<>());
                builder.aiSummary(event.getAiSummary());

                return builder.build();
        }

        @Override
        @Transactional(readOnly = true)
        public com.sems.dto.OrganizerStatusDTO getOrganizerStatus(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getRole() != com.sems.entity.Role.ORGANIZER || user.getOrganizerProfile() == null) {
                        throw new RuntimeException("Not an organizer");
                }

                return com.sems.dto.OrganizerStatusDTO.builder()
                                .status(user.getOrganizerProfile().getApprovalStatus().name())
                                .message(user.getOrganizerProfile()
                                                .getApprovalStatus() == com.sems.entity.OrganizerStatus.PENDING
                                                                ? "Your account is pending approval."
                                                                : "Status: " + user.getOrganizerProfile()
                                                                                .getApprovalStatus())
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public com.sems.dto.OrganizerAnalyticsDTO getAnalytics(String email) {
                long totalEvents = eventRepository.countByOrganizerEmail(email);
                long approvedEvents = eventRepository.countByOrganizerEmailAndStatus(email, EventStatus.APPROVED);
                long pendingEvents = eventRepository.countByOrganizerEmailAndStatus(email, EventStatus.PENDING);
                long totalBookings = bookingRepository.totalBookings(email);
                Double revenue = bookingRepository.totalRevenue(email);

                return com.sems.dto.OrganizerAnalyticsDTO.builder()
                                .totalEvents(totalEvents)
                                .approvedEvents(approvedEvents)
                                .pendingEvents(pendingEvents)
                                .totalBookings(totalBookings)
                                .revenue(revenue != null ? revenue : 0.0)
                                .build();
        }

        @Override
        @Transactional
        public List<String> uploadEventImages(Long eventId, List<String> imageUrls, String email) {
                Event event = getOwnedEvent(eventId, email);
                event.getImageUrls().addAll(imageUrls);
                eventRepository.save(event);
                return imageUrls;
        }

        @Override
        @Transactional
        public String updateUserProfilePhoto(String photoPath, String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found: " + email));
                user.setProfileImage(photoPath);
                userRepository.save(user);
                return photoPath;
        }
}
