import { beforeAll, afterAll, beforeEach } from "vitest";
import db from "../src/config/db.test.js";

// Run before all tests
beforeAll(async () => {
  console.log("Setting up test database...");

  try {
    await db.connect().then((obj) => {
      console.log("Database conneted sucessfully");
      obj.done();
    });
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
