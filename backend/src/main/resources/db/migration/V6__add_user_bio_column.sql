-- V6: Final Schema Sync for Users
-- Adds bio and phone columns to the users table
-- Target: com.sems.entity.User

ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
