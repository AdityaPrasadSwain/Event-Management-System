package com.sems.config;

import com.sems.entity.Role;
import com.sems.entity.User;
import com.sems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(2) // Run after DatabaseFixer
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin if not exists
        if (!userRepository.findByEmail("admin@sems.com").isPresent()) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@sems.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Default Admin User Created:");
            System.out.println("   Email: admin@sems.com");
            System.out.println("   Password: admin123");
        } else {
            System.out.println("ℹ️  Admin user already exists: admin@sems.com");
        }

        // Cleanup Demo Organizers if they exist (Requested by User)
        removeDemoUser("john@events.com");
        removeDemoUser("sarah@conferences.com");
    }

    private void removeDemoUser(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            try {
                userRepository.delete(user);
                System.out.println("✅ Removed demo user: " + email);
            } catch (Exception e) {
                System.err.println("⚠️ Could not remove demo user " + email + ": " + e.getMessage());
            }
        });
    }
}
