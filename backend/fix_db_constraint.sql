-- Run these commands in your database (e.g., pgAdmin or psql) to fix the constraint issue.

-- 1. Drop the old constraint that is causing the error
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;

-- 2. Add the new constraint with all current status values
ALTER TABLE events ADD CONSTRAINT events_status_check 
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'));
