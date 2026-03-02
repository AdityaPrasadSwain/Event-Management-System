-- V7: Advanced Booking Schema Enhancements
-- Adds support for multi-ticket bookings and auto-expiry logic

-- 1. Enhance Bookings table for lifecycle management
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS expiry_time TIMESTAMP,
ADD COLUMN IF NOT EXISTS base_total DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(50) UNIQUE;

-- 2. Link tickets to bookings for multi-ticket support
-- Note: Some existing logic might have ticket and booking as separate entities. 
-- We unify them here.
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS booking_id BIGINT;

-- 3. Add constraint for foreign key
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ticket_booking') THEN
        ALTER TABLE tickets 
        ADD CONSTRAINT fk_ticket_booking 
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Add index for cleanup performance
CREATE INDEX IF NOT EXISTS idx_booking_expiry ON bookings(expiry_time) WHERE booking_status = 'PENDING';
