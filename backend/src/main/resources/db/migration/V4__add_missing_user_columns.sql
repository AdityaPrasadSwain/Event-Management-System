-- V4: Add Missing User Columns
-- Adds 'bio' and 'phone' columns to the 'users' table to align with entities.

-- 1. Add bio column
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Add phone column
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
