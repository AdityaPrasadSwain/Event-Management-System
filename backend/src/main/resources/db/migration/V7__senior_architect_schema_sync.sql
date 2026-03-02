-- V7: Senior Architect Schema Synchronization
-- Purpose: Resolve Hibernate 'column does not exist' for bio and phone
-- Strategy: Consolidated sync to bypass previous Flyway versioning conflicts

ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
