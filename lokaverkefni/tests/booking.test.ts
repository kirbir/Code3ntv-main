import { describe, it, expect, beforeEach, afterAll } from "vitest";
import type { Event } from "../src/models/eventModel.js";
import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/db.js";

describe("Booking Tests", () => {
  let authToken: string;
  let userId: number;
  let eventId: number;
  let ticketId: number;
  let pastEvent: Event[];
  let pastEventId: number;
  let pastTicketId: number;

  // Helper: Create a test user and get auth token
  beforeEach(async () => {
    const testUser = {
      email: "bookinguser@example.com",
      password: "BookingPass123!",
    };

    await db.none(
      "DELETE FROM booking_tickets WHERE booking_id IN (SELECT id FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email = $1))",
      [testUser.email]
    );
    await db.none(
      "DELETE FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email = $1)",
      [testUser.email]
    );
    await db.none("DELETE FROM users WHERE email = $1", [testUser.email]);

    // Ensure user is deleted first
    await db.none(
      "DELETE FROM booking_tickets WHERE booking_id IN (SELECT id FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email = $1))",
      [testUser.email]
    );
    await db.none(
      "DELETE FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email = $1)",
      [testUser.email]
    );
    await db.none("DELETE FROM users WHERE email = $1", [testUser.email]);

    // Register user
    const regResponse = await request(app)
      .post("/api/users/register")
      .send(testUser);
    
    if (regResponse.status !== 201) {
      // If still failing, try one more time after a brief delay
      await new Promise(resolve => setTimeout(resolve, 100));
      const retryResponse = await request(app)
        .post("/api/users/register")
        .send(testUser);
      if (retryResponse.status !== 201) {
        throw new Error(
          `Registration failed after retry: ${retryResponse.status} - ${JSON.stringify(retryResponse.body)}`
        );
      }
    }

    // Login user
    let loginResponse = await request(app)
      .post("/api/users/login")
      .send(testUser);
    
    if (loginResponse.status !== 200) {
      // If login fails, user might not be ready yet, retry
      await new Promise(resolve => setTimeout(resolve, 100));
      loginResponse = await request(app)
        .post("/api/users/login")
        .send(testUser);
      if (loginResponse.status !== 200) {
        throw new Error(
          `Login failed after retry: ${loginResponse.status} - ${JSON.stringify(loginResponse.body)}`
        );
      }
    }

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;

    // Create temporary test data
    const venue = await db.one(
      `INSERT INTO venues (name, address, city, capacity) 
   VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Test Venue", "123 Test St", "Reykjavik", 1000]
    );

    const category = await db.one(
      `INSERT INTO categories (name, description) 
       VALUES ($1, $2) 
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      ["Test Concert", "Test category for concerts"]
    );

    const futureEvent = await db.one(
      `INSERT INTO events (title, description, start_time, end_time, venue_id, base_price) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        "Future Event",
        "Test event in the future",
        "2026-12-31 20:00:00",
        "2026-12-31 23:00:00",
        venue.id,
        5000.0,
      ]
    );

    const pastEvent = await db.one(
      `INSERT INTO events (title, description, start_time, end_time, venue_id, base_price) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        "Past Event",
        "Already happened",
        "2024-01-01 20:00:00",
        "2024-01-01 23:00:00",
        venue.id,
        3000.0,
      ]
    );

    const ticket = await db.one(
      `INSERT INTO tickets (event_id, section, description, price, total_quantity, available_quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [futureEvent.id, "Standard", "Test tickets", 5000.0, 100, 100]
    );

    const pastTicket = await db.one(
      `INSERT INTO tickets (event_id, section, description, price, total_quantity, available_quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [pastEvent.id, "Standard", "Past event tickets", 3000.0, 50, 50]
    );

    eventId = futureEvent.id;
    pastEventId = pastEvent.id;
    ticketId = ticket.id;
    pastTicketId = pastTicket.id;

    eventId = futureEvent.id;
    pastEventId = pastEvent.id;
    ticketId = ticket.id;
  });

  // UC6: Create Booking - Happy Path
  // UC7: Book Tickets - Happy Path
  it("should create a booking successfully with valid token", async () => {
    // Ensure user still exists
    const userExists = await db.oneOrNone(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );
    if (!userExists) {
      // Recreate user if missing
      const testUser = {
        email: "bookinguser@example.com",
        password: "BookingPass123!",
      };
      await db.none("DELETE FROM users WHERE email = $1", [testUser.email]);
      await request(app).post("/api/users/register").send(testUser).expect(201);
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send(testUser)
        .expect(200);
      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    }

    const bookingData = {
      event_id: eventId,
      tickets: [
        {
          ticket_id: ticketId,
          quantity: 2,
        },
      ],
    };

    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .send(bookingData)
      .expect(201);

    expect(response.body).toHaveProperty("booking");
    expect(response.body.booking).toHaveProperty("id");
    expect(response.body.booking.status).toBe("confirmed");
  });

  // UC7: Book Tickets - Requires Authentication
  it("should not allow booking without authentication", async () => {
    const bookingData = {
      event_id: 1,
      tickets: [{ ticket_id: 1, quantity: 1 }],
    };

    const response = await request(app)
      .post("/api/bookings")
      .send(bookingData)
      .expect(401);

    expect(response.body).toHaveProperty("error");
  });

  // UC7: View Booking History - Happy Path
  // UC6: View Booking History - Happy Path
  it("should get user booking history", async () => {
    const response = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("bookings");
    expect(Array.isArray(response.body.bookings)).toBe(true);
  });

  // UC6: Booking Past Event - Alternate Flow 2b
  // UC7: Book Tickets - Alternate Flow (Past Event)
  it("should not allow booking for past events", async () => {
    const bookingData = {
      event_id: pastEventId, // Assume this is a past event
      tickets: [{ ticket_id: pastTicketId, quantity: 1 }],
    };

    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .send(bookingData)
      .expect(400);

    expect(response.body.error.message).toContain("past");
  });

  // UC8: Cancel Booking - Happy Path (more than 24 hours before event)
  // UC8: Cancel Booking - Happy Path
  it("should cancel a booking successfully when more than 24 hours before event", async () => {
    // First, create a booking to cancel
    const bookingData = {
      event_id: eventId,
      tickets: [{ ticket_id: ticketId, quantity: 2 }],
    };

    const bookingResponse = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .send(bookingData)
      .expect(201);

    const bookingId = bookingResponse.body.booking.id;

    // Now cancel it
    const response = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("cancel");
  });

  // UC8: Cancel Booking - Alternate Flow 2a (booking doesn't exist)
  // UC8: Cancel Booking - Alternate Flow 1a (Booking Not Found)
  it("should return 404 when trying to cancel non-existent booking", async () => {
    const response = await request(app)
      .delete(`/api/bookings/99999`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(404);

    expect(response.body).toHaveProperty("error");
  });

  // UC8: Cancel Booking - Alternate Flow 2b (booking belongs to another user)
  // UC8: Cancel Booking - Alternate Flow (Unauthorized)
  it("should return 403 when trying to cancel another user's booking", async () => {
    // Ensure first user exists
    const firstUserExists = await db.oneOrNone(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );
    if (!firstUserExists) {
      const testUser = {
        email: "bookinguser@example.com",
        password: "BookingPass123!",
      };
      await request(app).post("/api/users/register").send(testUser).expect(201);
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send(testUser)
        .expect(200);
      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    }

    // Create another user
    const anotherUser = {
      email: "anotheruser@example.com",
      password: "AnotherPass123!",
    };

    await db.none("DELETE FROM users WHERE email = $1", [anotherUser.email]);
    await request(app).post("/api/users/register").send(anotherUser).expect(201);

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send(anotherUser)
      .expect(200);

    const anotherToken = loginResponse.body.token;

    // Create a booking with the first user
    const bookingData = {
      event_id: eventId,
      tickets: [{ ticket_id: ticketId, quantity: 1 }],
    };

    const bookingResponse = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .send(bookingData)
      .expect(201);

    const bookingId = bookingResponse.body.booking.id;

    // Try to cancel with the second user
    const response = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${anotherToken}`)
      .expect(403);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toContain("not authorized");
  });

  // UC8: Cancel Booking - Alternate Flow 3a (less than 24 hours before event)
  // UC8: Cancel Booking - Alternate Flow 4a (Within 24 Hours)
  it("should not allow cancellation less than 24 hours before event", async () => {
    // Create an event that starts in 12 hours
    const venue = await db.one(
      `INSERT INTO venues (name, address, city, capacity) 
     VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Soon Venue", "123 Soon St", "Reykjavik", 500]
    );

    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 12); // 12 hours from now
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(tomorrowEnd.getHours() + 3);

    const soonEvent = await db.one(
      `INSERT INTO events (title, description, start_time, end_time, venue_id, base_price) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        "Soon Event",
        "Happens in 12 hours",
        tomorrow.toISOString(),
        tomorrowEnd.toISOString(),
        venue.id,
        3000.0,
      ]
    );

    const soonTicket = await db.one(
      `INSERT INTO tickets (event_id, section, description, price, total_quantity, available_quantity)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [soonEvent.id, "Standard", "Soon tickets", 3000.0, 50, 50]
    );

    // Create a booking for this soon event
    const bookingData = {
      event_id: soonEvent.id,
      tickets: [{ ticket_id: soonTicket.id, quantity: 1 }],
    };

    const bookingResponse = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .send(bookingData)
      .expect(201);

    const bookingId = bookingResponse.body.booking.id;

    // Try to cancel - should fail because it's less than 24 hours
    const response = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(400);

    expect(response.body.error.message).toContain("24 hours");
  });
});
