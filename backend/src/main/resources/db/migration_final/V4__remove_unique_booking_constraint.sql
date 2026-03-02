-- V4: Remove unique booking and ticket constraints to allow re-booking after cancellation/rejection

-- 1. Remove constraint from bookings table
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS uk_booking_user_event;

-- 2. Remove constraint from tickets table
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS uk_ticket_user_event;
