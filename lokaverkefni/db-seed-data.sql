-- ============================================
-- Drop existing tables (for clean setup)
-- ============================================
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS booking_tickets;
DROP TABLE IF EXISTS event_categories;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS booking CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================
-- Create Core Tables
-- ============================================

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email TEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	role TEXT NOT NULL DEFAULT 'user',
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name <> ''),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE CHECK (name <> ''),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL CHECK (title <> ''),
    description TEXT NOT NULL CHECK (description <> ''),
    venue_id INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    CHECK (end_time > start_time),
    is_active BOOLEAN DEFAULT TRUE,
    base_price NUMERIC(10,2) CHECK (base_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_categories (
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, category_id)
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL,        -- e.g. “VIP”, “Balcony”, “Floor A”
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
    available_quantity INTEGER NOT NULL CHECK (
        available_quantity >= 0 AND available_quantity <= total_quantity
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id      BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status        VARCHAR(20) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','cancelled','refunded')),
    total_amount  NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_ref   VARCHAR(100),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at  TIMESTAMPTZ,
    UNIQUE (id, user_id) -- quick lookup per user
);

CREATE TABLE booking_tickets (
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_id  BIGINT NOT NULL REFERENCES tickets(id) ON DELETE RESTRICT,
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    PRIMARY KEY (booking_id, ticket_id)
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Create Indexes for Performance
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_is_active ON events(is_active);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_booking_tickets_booking_id ON booking_tickets(booking_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- ============================================
-- Truncate Tables (Clean Data)
-- ============================================

TRUNCATE TABLE refresh_tokens CASCADE;
TRUNCATE TABLE password_reset_tokens CASCADE;
TRUNCATE TABLE booking_tickets CASCADE;
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE tickets CASCADE;
TRUNCATE TABLE event_categories CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE venues CASCADE;
TRUNCATE TABLE users CASCADE;

-- ============================================
-- Insert Demo Data
-- ============================================

-- Users (password_hash is bcrypt hash of "password123" for demo)
INSERT INTO users (email, password_hash, role) VALUES
('admin@tix.is', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin'),
('user1@example.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'user'),
('user2@example.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'user'),
('user3@example.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'user');

-- Venues
INSERT INTO venues (name, address, city, capacity) VALUES
('Harpa Concert Hall', 'Austurbakki 2', 'Reykjavík', 1800),
('Laugardalshöll', 'Engjavegur 8', 'Reykjavík', 5500),
('Háskólabíó', 'Háskólabíó', 'Reykjavík', 600),
('Icelandair Hotel', 'Nauthólsvegur 52', 'Reykjavík', 300),
('Borgarleikhúsið', 'Listabraut 3', 'Reykjavík', 500);

-- Categories
INSERT INTO categories (name, description) VALUES
('Music', 'Concerts and music performances'),
('Sports', 'Sports events and competitions'),
('Theater', 'Theater performances and plays'),
('Comedy', 'Comedy shows and stand-up'),
('Festival', 'Festivals and multi-day events'),
('Conference', 'Conferences and seminars');

-- Events
INSERT INTO events (title, description, venue_id, start_time, end_time, is_active, base_price) VALUES
('Sigur Rós Concert', 'Icelandic post-rock band performing their greatest hits', 1, '2024-12-15 20:00:00+00', '2024-12-15 23:00:00+00', TRUE, 8500.00),
('Iceland vs Denmark Football', 'International friendly match', 2, '2024-12-20 18:00:00+00', '2024-12-20 20:00:00+00', TRUE, 5000.00),
('Hamlet - Shakespeare', 'Classic Shakespeare play performed in Icelandic', 5, '2024-12-10 19:30:00+00', '2024-12-10 22:00:00+00', TRUE, 4500.00),
('Comedy Night with Jón Gnarr', 'Stand-up comedy show', 3, '2024-12-12 20:00:00+00', '2024-12-12 22:30:00+00', TRUE, 3500.00),
('Iceland Airwaves Festival', 'Annual music festival', 1, '2024-12-05 14:00:00+00', '2024-12-08 23:00:00+00', TRUE, 15000.00),
('Tech Conference 2024', 'Technology and innovation conference', 4, '2024-12-18 09:00:00+00', '2024-12-18 17:00:00+00', TRUE, 12000.00),
('Björk - Biophilia Live', 'Björk performing Biophilia album', 1, '2024-12-25 21:00:00+00', '2024-12-25 23:30:00+00', TRUE, 9500.00),
('Basketball Championship', 'National basketball finals', 2, '2024-12-22 19:00:00+00', '2024-12-22 21:30:00+00', TRUE, 4000.00);

-- Event Categories (many-to-many)
INSERT INTO event_categories (event_id, category_id) VALUES
(1, 1), -- Sigur Rós - Music
(2, 2), -- Football - Sports
(3, 3), -- Hamlet - Theater
(4, 4), -- Comedy Night - Comedy
(5, 1), -- Airwaves - Music
(5, 6), -- Airwaves - Festival
(6, 6), -- Tech Conference - Conference
(7, 1), -- Björk - Music
(8, 2); -- Basketball - Sports

-- Tickets
INSERT INTO tickets (event_id, section, description, price, total_quantity, available_quantity) VALUES
-- Sigur Rós tickets
(1, 'VIP', 'Front row VIP seating', 12000.00, 50, 45),
(1, 'Premium', 'Premium seating area', 9500.00, 200, 180),
(1, 'Standard', 'Standard seating', 8500.00, 500, 450),
(1, 'Balcony', 'Upper balcony seating', 6500.00, 300, 280),
-- Football tickets
(2, 'VIP Box', 'VIP box seating', 8000.00, 20, 15),
(2, 'Premium', 'Premium seating', 6000.00, 500, 450),
(2, 'Standard', 'Standard seating', 5000.00, 2000, 1800),
-- Hamlet tickets
(3, 'Front Row', 'Front row seating', 6000.00, 30, 25),
(3, 'Standard', 'Standard seating', 4500.00, 300, 280),
(3, 'Balcony', 'Balcony seating', 3500.00, 170, 160),
-- Comedy Night tickets
(4, 'VIP', 'VIP seating with meet & greet', 5000.00, 20, 18),
(4, 'Standard', 'Standard seating', 3500.00, 400, 380),
-- Airwaves Festival tickets
(5, 'Full Pass', 'Full festival pass', 20000.00, 1000, 850),
(5, 'Day Pass', 'Single day pass', 8000.00, 500, 450),
-- Tech Conference tickets
(6, 'VIP', 'VIP access with lunch', 15000.00, 50, 40),
(6, 'Standard', 'Standard conference ticket', 12000.00, 200, 180),
-- Björk tickets
(7, 'VIP', 'VIP seating', 15000.00, 40, 35),
(7, 'Premium', 'Premium seating', 11000.00, 150, 140),
(7, 'Standard', 'Standard seating', 9500.00, 400, 380),
-- Basketball tickets
(8, 'VIP', 'VIP seating', 6000.00, 30, 25),
(8, 'Standard', 'Standard seating', 4000.00, 2000, 1900);

-- Bookings
INSERT INTO bookings (user_id, event_id, status, total_amount, payment_ref) VALUES
(2, 1, 'confirmed', 17000.00, 'PAY-001'),
(2, 3, 'confirmed', 9000.00, 'PAY-002'),
(3, 2, 'pending', 10000.00, NULL),
(3, 4, 'confirmed', 7000.00, 'PAY-003'),
(4, 5, 'confirmed', 20000.00, 'PAY-004');

-- Booking Tickets
INSERT INTO booking_tickets (booking_id, ticket_id, quantity, unit_price) VALUES
(1, 2, 2, 8500.00), -- User 2: 2 Premium tickets for Sigur Rós
(2, 8, 2, 4500.00), -- User 2: 2 Standard tickets for Hamlet
(3, 6, 2, 5000.00), -- User 3: 2 Standard tickets for Football (pending)
(4, 12, 2, 3500.00), -- User 3: 2 Standard tickets for Comedy
(5, 15, 1, 20000.00); -- User 4: 1 Full Pass for Airwaves

