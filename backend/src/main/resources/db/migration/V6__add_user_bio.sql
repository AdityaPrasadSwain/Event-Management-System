-- V6: Add bio and phone columns to users table
-- Resolves Hibernate schema mismatch error

ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
