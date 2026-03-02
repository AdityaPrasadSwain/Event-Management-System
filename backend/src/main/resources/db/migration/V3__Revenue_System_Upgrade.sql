-- V3: Revenue System Upgrade
-- Adds financial columns and global settings for commission/GST.

-- 1. Add minimum_advance_percent to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS minimum_advance_percent DOUBLE PRECISION DEFAULT 100.0;

-- 2. Add financial columns to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_total DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_fee DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gst_on_user_fee DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_commission DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gst_on_commission DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gst_amount DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS organizer_earning DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS advance_paid DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS remaining_amount DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_amount DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_amount_paid DOUBLE PRECISION DEFAULT 0.0;

-- 3. Global Settings Table for dynamic rates
CREATE TABLE IF NOT EXISTS global_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL,
    description TEXT
);

-- Insert Default Rates
INSERT INTO global_settings (setting_key, setting_value, description) 
VALUES ('COMMISSION_RATE', '10.0', 'Percentage of ticket price taken by platform from organizer')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO global_settings (setting_key, setting_value, description) 
VALUES ('USER_FEE_RATE', '5.0', 'Percentage of ticket price added as convenience fee for user')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO global_settings (setting_key, setting_value, description) 
VALUES ('GST_RATE', '18.0', 'GST percentage applied to platform fees')
ON CONFLICT (setting_key) DO NOTHING;
