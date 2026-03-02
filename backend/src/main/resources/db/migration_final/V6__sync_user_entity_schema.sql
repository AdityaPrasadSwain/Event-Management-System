-- V6: Senior Architect Schema Synchronization
-- Purpose: Resolve Hibernate 'column does not exist' for bio and phone
-- Target Folder: db/migration_final (Configured in application.properties)

ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
