-- V5: Update tickets table for QR entry system

-- 1. Change qr_code to TEXT to store Base64 strings
ALTER TABLE tickets ALTER COLUMN qr_code TYPE TEXT;

-- 2. Add entry_status column
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_status') THEN
        -- We won't use Postgres enum for flexibility in migrations, just VARCHAR
        NULL;
    END IF;
END $$;

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS entry_status VARCHAR(20) DEFAULT 'NOT_ENTERED';

-- 3. Add entry_time column
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS entry_time TIMESTAMP;

-- 4. Update bookings table for QR entry system
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS qr_code TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS entry_status VARCHAR(20) DEFAULT 'NOT_ENTERED';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS entry_time TIMESTAMP;
