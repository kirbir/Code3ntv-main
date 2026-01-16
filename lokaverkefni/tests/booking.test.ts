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
    // Register and login a user for booking tests
    const testUser = {
      email: "bookinguser@example.com",
      password: "BookingPass123!",
    };

    try {
      await request(app).post("/api/users/register").send(testUser);
    } catch (error) {
      // Ignore registration errors - user might already exist
    }

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send(testUser)
      .expect(200);

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
  it("should create a booking successfully with valid token", async () => {
    const bookingData = {
      event_id: 1,
      tickets: [
        {
          ticket_id: 1,
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

  // Authentication Test - Alternate Flow
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
  it("should get user booking history", async () => {
    const response = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("bookings");
    expect(Array.isArray(response.body.bookings)).toBe(true);
  });

  // UC6: Booking Past Event - Alternate Flow 2b
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
});
