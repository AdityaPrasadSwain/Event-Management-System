-- V1: Complete Baseline Schema
-- Includes all core tables required by the application entities.

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    profile_image VARCHAR(255),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Organizer Profiles
CREATE TABLE IF NOT EXISTS organizer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(255) NOT NULL,
    apply_date TIMESTAMP NOT NULL,
    approval_status VARCHAR(20) NOT NULL
);

-- 4. Events table
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    price_per_person DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    remaining_seats INTEGER NOT NULL,
    organizer_id BIGINT NOT NULL REFERENCES users(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    rejection_reason TEXT,
    ai_summary TEXT,
    approval_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Event Images (Collection Table)
CREATE TABLE IF NOT EXISTS event_images (
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL
);

-- 6. Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(255) NOT NULL UNIQUE,
    number_of_persons INTEGER NOT NULL DEFAULT 1,
    event_id BIGINT NOT NULL REFERENCES events(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    booking_status VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    approval_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_booking_user_event UNIQUE (event_id, user_id)
);

-- 7. Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    status VARCHAR(20) NOT NULL,
    check_in_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_attendance_user_event UNIQUE (event_id, user_id)
);

-- 8. Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    comment VARCHAR(1000) NOT NULL,
    rating INTEGER NOT NULL,
    sentiment VARCHAR(20),
    ai_summary VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    user_id BIGINTREFERENCES users(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
