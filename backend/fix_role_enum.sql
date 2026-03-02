-- Migration: Fix Role Enum Mismatch
-- Changes EVENT_ORGANIZER to ORGANIZER in the database

-- Step 1: Update all EVENT_ORGANIZER values to ORGANIZER
UPDATE users
SET role = 'ORGANIZER'
WHERE role = 'EVENT_ORGANIZER';

-- Step 2: Verify the update
SELECT DISTINCT role FROM users;
-- Expected output: ADMIN, ORGANIZER, USER

-- Step 3 (Optional): Add constraint to prevent invalid values
ALTER TABLE users DROP CONSTRAINT IF EXISTS role_check;
ALTER TABLE users
ADD CONSTRAINT role_check
CHECK (role IN ('ADMIN', 'ORGANIZER', 'USER'));

-- Verification Query
SELECT 
    role, 
    COUNT(*) as count 
FROM users 
GROUP BY role 
ORDER BY role;
