package com.sems.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
@Order(1) // Run first before data initialization
public class DatabaseFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Running Database Constraint Fix...");
            // Drop the old constraint
            try {
                jdbcTemplate.execute("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check");
            } catch (Exception e) {
                // Ignore if it doesn't exist or other minor issues during drop
                System.out.println("Constraint might not exist or verify: " + e.getMessage());
            }

            // Re-add the constraint with correct values
            jdbcTemplate.execute(
                    "ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'))");

            System.out.println("Database Constraint Fixed Successfully.");
        } catch (Exception e) {
            System.err.println("Database fix warning (might already be fixed or permissions issue): " + e.getMessage());
        }
    }
}
