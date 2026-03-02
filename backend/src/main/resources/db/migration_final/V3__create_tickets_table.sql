-- V3: Create Tickets and Payments Tables

-- 1. Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    number_of_persons INTEGER NOT NULL DEFAULT 1,
    ticket_total DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_in BOOLEAN DEFAULT FALSE,
    CONSTRAINT uk_ticket_user_event UNIQUE (event_id, user_id)
);

-- 2. Payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    amount DOUBLE PRECISION NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
