package com.sems.security;

import com.sems.entity.OrganizerStatus;
import com.sems.entity.Role;
import com.sems.entity.User;
import com.sems.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OrganizerApprovalFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !isWhitelisted(request)) {

            // Check if user has ROLE_ORGANIZER
            boolean isOrganizer = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_" + Role.ORGANIZER.name()));

            if (isOrganizer) {
                String email = auth.getName();
                User user = userRepository.findByEmail(email).orElse(null);

                if (user != null && user.getOrganizerProfile() != null) {
                    OrganizerStatus status = user.getOrganizerProfile().getApprovalStatus();

                    if (status != OrganizerStatus.APPROVED) {
                        // Deny access
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"error\": \"Account is pending approval. Please wait for admin verification.\"}");
                        return; // Stop filter chain
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isWhitelisted(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Allow public auth endpoints
        if (uri.startsWith("/api/auth/"))
            return true;

        // Allow checking status so frontend knows to redirect
        if (uri.equals("/api/organizer/status"))
            return true;
        if (uri.equals("/api/organizer/profile"))
            return true;

        // Allow organizers to see their OWN events and dashboard even if pending
        if ("GET".equalsIgnoreCase(method)) {
            if (uri.startsWith("/api/organizer/events") ||
                    uri.startsWith("/api/organizer/dashboard")) {
                return true;
            }
        }

        // Allow preparing events
        if ("POST".equalsIgnoreCase(method) && uri.equals("/api/organizer/events")) {
            return true;
        }

        return false;
    }
}
