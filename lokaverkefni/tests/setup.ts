import { beforeAll, afterAll, beforeEach } from "vitest";
import db from "../src/config/db.js";

// Run before all tests
beforeAll(async () => {
  console.log("Setting up test database...");

  try {
    await db.connect().then((obj) => {
      console.log("Database conneted sucessfully");
      obj.done();
    });

    // Create schema if it doesn't exist
    console.log("Creating test database schema...");
    await db.none(`
      -- Drop existing tables (for clean setup)
      DROP TABLE IF EXISTS refresh_tokens CASCADE;
      DROP TABLE IF EXISTS password_reset_tokens CASCADE;
      DROP TABLE IF EXISTS booking_tickets CASCADE;
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS tickets CASCADE;
      DROP TABLE IF EXISTS event_categories CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS venues CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;

      -- Create Core Tables
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
          section VARCHAR(50) NOT NULL,
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
          UNIQUE (id, user_id)
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

      -- Create Indexes for Performance
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
    `);
    console.log("Test database schema created successfully");
  } catch (error) {
    console.log("Failed to connect to database: ", error);
    throw new Error("Database connection Failed.");
  }
});

beforeEach(async () => {
  try {
    // Clean up all test data in correct order (respecting foreign keys)
    // This ensures no test data accumulates between test runs
    
    // 1. Delete booking_tickets for test bookings
    await db.none(`
      DELETE FROM booking_tickets 
      WHERE booking_id IN (
        SELECT id FROM bookings 
        WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
           OR event_id IN (
             SELECT id FROM events 
             WHERE venue_id IN (
               SELECT id FROM venues 
               WHERE address LIKE '123 % St' OR address LIKE '456 % St'
             )
           )
      )
    `);
    
    // 2. Delete bookings for test users or test events
    await db.none(`
      DELETE FROM bookings 
      WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
         OR event_id IN (
           SELECT id FROM events 
           WHERE venue_id IN (
             SELECT id FROM venues 
             WHERE address LIKE '123 % St' OR address LIKE '456 % St'
           )
         )
    `);
    
    // 3. Delete tickets for test events
    await db.none(`
      DELETE FROM tickets 
      WHERE event_id IN (
        SELECT id FROM events 
        WHERE venue_id IN (
          SELECT id FROM venues 
          WHERE address LIKE '123 % St' OR address LIKE '456 % St'
        )
      )
    `);
    
    // 4. Delete event_categories for test events
    await db.none(`
      DELETE FROM event_categories 
      WHERE event_id IN (
        SELECT id FROM events 
        WHERE venue_id IN (
          SELECT id FROM venues 
          WHERE address LIKE '123 % St' OR address LIKE '456 % St'
        )
      )
    `);
    
    // 5. Delete test events
    await db.none(`
      DELETE FROM events 
      WHERE venue_id IN (
        SELECT id FROM venues 
        WHERE address LIKE '123 % St' OR address LIKE '456 % St'
      )
    `);
    
    // 6. Delete test users
    await db.none("DELETE FROM users WHERE email LIKE '%@example.com'");
    
    // 7. Delete test venues
    await db.none(
      "DELETE FROM venues WHERE address LIKE '123 % St' OR address LIKE '456 % St'"
    );
    
    // 8. Delete test categories (only if not used by real events)
    await db.none(`
      DELETE FROM categories 
      WHERE name LIKE '%Test%' 
        AND id NOT IN (
          SELECT DISTINCT category_id 
          FROM event_categories 
          WHERE category_id IS NOT NULL
        )
    `);
    
    // 9. Clean up tokens for test users
    await db.none(`
      DELETE FROM refresh_tokens 
      WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
    `);
    await db.none(`
      DELETE FROM password_reset_tokens 
      WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
    `);
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
});

afterAll(async () => {
  console.log("Cleaning up...");
  // Final cleanup - ensure all test data is removed after all tests
  try {
    // Run the same cleanup as beforeEach to catch any remaining test data
    await db.none(`
      DELETE FROM booking_tickets 
      WHERE booking_id IN (
        SELECT id FROM bookings 
        WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
           OR event_id IN (
             SELECT id FROM events 
             WHERE venue_id IN (
               SELECT id FROM venues 
               WHERE address LIKE '123 % St' OR address LIKE '456 % St'
             )
           )
      )
    `);
    await db.none(`
      DELETE FROM bookings 
      WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
         OR event_id IN (
           SELECT id FROM events 
           WHERE venue_id IN (
             SELECT id FROM venues 
             WHERE address LIKE '123 % St' OR address LIKE '456 % St'
           )
         )
    `);
    await db.none(`
      DELETE FROM tickets 
      WHERE event_id IN (
        SELECT id FROM events 
        WHERE venue_id IN (
          SELECT id FROM venues 
          WHERE address LIKE '123 % St' OR address LIKE '456 % St'
        )
      )
    `);
    await db.none(`
      DELETE FROM event_categories 
      WHERE event_id IN (
        SELECT id FROM events 
        WHERE venue_id IN (
          SELECT id FROM venues 
          WHERE address LIKE '123 % St' OR address LIKE '456 % St'
        )
      )
    `);
    await db.none(`
      DELETE FROM events 
      WHERE venue_id IN (
        SELECT id FROM venues 
        WHERE address LIKE '123 % St' OR address LIKE '456 % St'
      )
    `);
    await db.none("DELETE FROM users WHERE email LIKE '%@example.com'");
    await db.none(
      "DELETE FROM venues WHERE address LIKE '123 % St' OR address LIKE '456 % St'"
    );
    await db.none(`
      DELETE FROM categories 
      WHERE name LIKE '%Test%' 
        AND id NOT IN (
          SELECT DISTINCT category_id 
          FROM event_categories 
          WHERE category_id IS NOT NULL
        )
    `);
    await db.none(`
      DELETE FROM refresh_tokens 
      WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
    `);
    await db.none(`
      DELETE FROM password_reset_tokens 
      WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')
    `);
  } catch (error) {
    console.error("Error in final cleanup:", error);
  }
  // Close database connection
  try {
    await db.$pool.end();
  } catch (error) {
    // Ignore errors on close
  }
});
