package com.sems.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        final String method = request.getMethod();

        log.debug("🔍 JWT Filter - Processing: {} {}", method, requestURI);

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("⚠️ No JWT token found in request to {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = null;
        String userEmail = null;

        try {
            jwt = authHeader.substring(7);
            log.debug("✅ JWT token extracted from Authorization header");

            userEmail = jwtUtils.extractUsername(jwt);
            log.debug("📧 Extracted email from JWT: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.debug("🔐 SecurityContext is null, proceeding with authentication for user: {}", userEmail);

                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                log.debug("👤 User loaded from database: {}, Authorities: {}",
                        userEmail, userDetails.getAuthorities());

                if (jwtUtils.isTokenValid(jwt, userDetails)) {
                    log.debug("✅ JWT token is valid for user: {}", userEmail);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("✅ Authentication set in SecurityContext for user: {} with authorities: {}",
                            userEmail, userDetails.getAuthorities());
                } else {
                    log.warn("❌ JWT token validation failed for user: {}", userEmail);
                }
            } else if (userEmail == null) {
                log.warn("❌ Could not extract email from JWT token");
            } else {
                log.debug("ℹ️ SecurityContext already has authentication, skipping JWT processing");
            }
        } catch (UsernameNotFoundException e) {
            log.error("❌ User not found for email from JWT token: '{}'", userEmail);
            log.error("   This means the token is valid but the user doesn't exist in the database.");
            log.error("   Possible causes: user was deleted, token from different environment, or database was reset.");
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.error("❌ JWT token expired: {}", e.getMessage());
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            log.error("❌ Invalid JWT token: {}", e.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException e) {
            log.error("❌ JWT signature validation failed: {}", e.getMessage());
        } catch (Exception e) {
            log.error("❌ Unexpected error processing JWT: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}
