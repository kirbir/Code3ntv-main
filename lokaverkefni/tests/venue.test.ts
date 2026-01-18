import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/db.js";

describe("Venue Tests", () => {
  let venueId: number;
  let eventId: number;

  beforeEach(async () => {
    const venue = await db.one(
      `INSERT INTO venues (name, address, city, capacity) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Test Venue", "123 Test St", "Reykjavik", 1000]
    );
    venueId = venue.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureEnd = new Date(futureDate);
    futureEnd.setHours(futureEnd.getHours() + 3);

    const event = await db.one(
      `INSERT INTO events (title, description, start_time, end_time, venue_id, base_price, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        "Test Event",
        "Test description",
        futureDate.toISOString(),
        futureEnd.toISOString(),
        venueId,
        5000.0,
        true,
      ]
    );
    eventId = event.id;
  });

  // UC3: Get Venue Details - Happy Path
  it("should get venue details by id", async () => {
    const response = await request(app)
      .get(`/api/venues/${venueId}`)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(venueId);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("address");
    expect(response.body).toHaveProperty("city");
    expect(response.body).toHaveProperty("capacity");
  });

  // UC3: Get Venue Details - Alternate Flow (Not Found)
  it("should return 404 when venue does not exist", async () => {
    const response = await request(app).get("/api/venues/99999").expect(404);

    expect(response.body).toHaveProperty("error");
  });

  // UC3: Get Venue with Upcoming Events - Happy Path
  it("should get venue with upcoming events", async () => {
    const response = await request(app)
      .get(`/api/venues/${venueId}/events`)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("events");
    expect(Array.isArray(response.body.events)).toBe(true);
    
    if (response.body.events.length > 0) {
      expect(response.body.events[0]).toHaveProperty("id");
      expect(response.body.events[0]).toHaveProperty("title");
    }
  });

  // UC3: Get Venue with Upcoming Events - No Events
  it("should return empty events array when venue has no upcoming events", async () => {
    const emptyVenue = await db.one(
      `INSERT INTO venues (name, address, city, capacity) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Empty Venue", "456 Empty St", "Reykjavik", 500]
    );

    const response = await request(app)
      .get(`/api/venues/${emptyVenue.id}/events`)
      .expect(200);

    expect(response.body).toHaveProperty("events");
    expect(Array.isArray(response.body.events)).toBe(true);
    expect(response.body.events.length).toBe(0);
  });
});
