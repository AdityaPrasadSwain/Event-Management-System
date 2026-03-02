-- POSTGRESQL SAFE SCHEMA MIGRATION SCRIPT
-- This script adds new financial columns safely to existing tables.

-- 1. Update events table
-- minimum_advance_percent
ALTER TABLE events ADD COLUMN IF NOT EXISTS minimum_advance_percent DOUBLE PRECISION DEFAULT 100.0;
UPDATE events SET minimum_advance_percent = 100.0 WHERE minimum_advance_percent IS NULL;
ALTER TABLE events ALTER COLUMN minimum_advance_percent SET NOT NULL;

-- 2. Update bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_total DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_fee DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS remaining_amount DOUBLE PRECISION DEFAULT 0.0;
-- Also adding others for completeness
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gst_on_user_fee DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_commission DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gst_on_commission DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS organizer_earning DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS advance_paid DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_amount_paid DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS number_of_persons INTEGER DEFAULT 1;

-- Backfill and Set NOT NULL
UPDATE bookings SET ticket_total = 0.0 WHERE ticket_total IS NULL;
UPDATE bookings SET user_fee = 0.0 WHERE user_fee IS NULL;
UPDATE bookings SET remaining_amount = 0.0 WHERE remaining_amount IS NULL;
UPDATE bookings SET number_of_persons = 1 WHERE number_of_persons IS NULL;

ALTER TABLE bookings ALTER COLUMN ticket_total SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN user_fee SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN remaining_amount SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN gst_on_user_fee SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN admin_commission SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN gst_on_commission SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN organizer_earning SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN advance_paid SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN final_amount_paid SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN number_of_persons SET NOT NULL;

-- 3. Update tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS number_of_persons INTEGER DEFAULT 1;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ticket_total DOUBLE PRECISION DEFAULT 0.0;

UPDATE tickets SET number_of_persons = 1 WHERE number_of_persons IS NULL;
UPDATE tickets SET ticket_total = 0.0 WHERE ticket_total IS NULL;

ALTER TABLE tickets ALTER COLUMN number_of_persons SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN ticket_total SET NOT NULL;
