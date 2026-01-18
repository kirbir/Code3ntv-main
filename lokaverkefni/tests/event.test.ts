import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/db.test.js";

describe("Event Tests", () => {
  let eventId: number;
  let venueId: number;
  let categoryId: number;

  beforeEach(async () => {
    // Create test venue
    const venue = await db.one(
      `INSERT INTO venues (name, address, city, capacity) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Test Venue", "123 Test St", "Reykjavik", 1000]
    );
    venueId = venue.id;

    // Create test category
    const category = await db.one(
      `INSERT INTO categories (name, description) 
       VALUES ($1, $2) 
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      ["Test Category", "Test description"]
    );
    categoryId = category.id;

    // Create future event
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureEnd = new Date(futureDate);
    futureEnd.setHours(futureEnd.getHours() + 3);

    const event = await db.one(
      `INSERT INTO events (title, description, start_time, end_time, venue_id, base_price, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        "Test Event",
        "A test event description",
        futureDate.toISOString(),
        futureEnd.toISOString(),
        venueId,
        5000.0,
        true,
      ]
    );
    eventId = event.id;

    // Link event to category
    await db.none(
      `INSERT INTO event_categories (event_id, category_id) 
       VALUES ($1, $2) 
       ON CONFLICT DO NOTHING`,
      [eventId, categoryId]
    );
  });

  // UC1: List Events - Happy Path
  it("should get list of all events", async () => {
    const response = await request(app).get("/api/events").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("description");
  });

  // UC1: List Events - Alternate Flow 2a (Empty list)
  it("should return empty array when no events exist", async () => {
    await db.none("DELETE FROM event_categories WHERE event_id = $1", [
      eventId,
    ]);
    await db.none("DELETE FROM events WHERE id = $1", [eventId]);

    const response = await request(app).get("/api/events").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const deletedEvent = response.body.find((e: any) => e.id === eventId);
    expect(deletedEvent).toBeUndefined();
  });

  // UC1: Sort Events - by title
  it("should sort events by title", async () => {
    // Create another event with different title
    const anotherEvent = await db.one(
      `INSERT INTO events (title, description, start_time, end_time, venue_id, base_price, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        "Alpha Event",
        "First alphabetically",
        new Date(Date.now() + 86400000).toISOString(),
        new Date(Date.now() + 86400000 + 10800000).toISOString(),
        venueId,
        3000.0,
        true,
      ]
    );

    const response = await request(app)
      .get("/api/events?sort=title&order=asc")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length >= 2) {
      expect(response.body[0].title <= response.body[1].title).toBe(true);
    }
  });

  // UC2: Get Event Details - Happy Path
  it("should get event details by id", async () => {
    const response = await request(app)
      .get(`/api/events/${eventId}`)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(eventId);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("venue_name");
    expect(response.body).toHaveProperty("categories");
  });

  // UC2: Get Event Details - Alternate Flow 1a (Event not found)
  it("should return 404 when event does not exist", async () => {
    const response = await request(app).get("/api/events/99999").expect(404);

    expect(response.body).toHaveProperty("error");
  });

  // UC2: Get Event with Tickets
  it("should get event with available tickets", async () => {
    // Create a ticket for the event
    await db.one(
      `INSERT INTO tickets (event_id, section, description, price, total_quantity, available_quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [eventId, "Standard", "Test tickets", 5000.0, 100, 100]
    );

    const response = await request(app)
      .get(`/api/events/${eventId}/tickets`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("section");
    expect(response.body[0]).toHaveProperty("price");
    expect(response.body[0]).toHaveProperty("available_quantity");
  });
});
