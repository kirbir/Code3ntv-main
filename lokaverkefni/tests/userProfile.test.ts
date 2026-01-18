import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/db.test.js";

describe("User Profile Tests", () => {
  let authToken: string;
  let userId: number;
  let eventId: number;
  let ticketId: number;

  beforeEach(async () => {
    const testUser = {
      email: "profileuser@example.com",
      password: "ProfilePass123!",
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

    const venue = await db.one(
      `INSERT INTO venues (name, address, city, capacity) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Profile Venue", "123 Profile St", "Reykjavik", 1000]
    );

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureEnd = new Date(futureDate);
    futureEnd.setHours(futureEnd.getHours() + 3);

    const event = await db.one(
      `INSERT INTO events (title, description, start_time, end_time, venue_id, base_price, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        "Profile Event",
        "Test event",
        futureDate.toISOString(),
        futureEnd.toISOString(),
        venue.id,
        5000.0,
        true,
      ]
    );
    eventId = event.id;

    const ticket = await db.one(
      `INSERT INTO tickets (event_id, section, description, price, total_quantity, available_quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [eventId, "Standard", "Test tickets", 5000.0, 100, 100]
    );
    ticketId = ticket.id;
  });

  it("should get user profile", async () => {
    // Ensure user still exists
    const userExists = await db.oneOrNone(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );
    if (!userExists) {
      // Recreate user if missing
      const testUser = {
        email: "profileuser@example.com",
        password: "ProfilePass123!",
      };
      await request(app).post("/api/users/register").send(testUser).expect(201);
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send(testUser)
        .expect(200);
      authToken = loginResponse.body.token;
      userId = loginResponse.body.user.id;
    }

    const response = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(userId);
    expect(response.body).toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");
  });

  it("should require authentication to get profile", async () => {
    const response = await request(app).get("/api/users/profile").expect(401);

    expect(response.body).toHaveProperty("error");
  });

  it("should update profile email successfully", async () => {
    const response = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "updated@example.com" })
      .expect(200);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe("updated@example.com");
  });

  it("should not allow duplicate email when updating profile", async () => {
    const anotherUser = {
      email: "another@example.com",
      password: "AnotherPass123!",
    };

    await request(app).post("/api/users/register").send(anotherUser);

    const response = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "another@example.com" })
      .expect(409);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toContain("Email");
  });

  it("should require authentication to update profile", async () => {
    const response = await request(app)
      .put("/api/users/profile")
      .send({ email: "test@example.com" })
      .expect(401);

    expect(response.body).toHaveProperty("error");
  });

  it("should delete user account successfully", async () => {
    const response = await request(app)
      .delete("/api/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("message");

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({
        email: "profileuser@example.com",
        password: "ProfilePass123!",
      })
      .expect(401);

    expect(loginResponse.body).toHaveProperty("error");
  });

  it("should cancel future bookings when deleting account", async () => {
    await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        event_id: eventId,
        tickets: [{ ticket_id: ticketId, quantity: 1 }],
      })
      .expect(201);

    await request(app)
      .delete("/api/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    const ticket = await db.oneOrNone(
      "SELECT available_quantity FROM tickets WHERE id = $1",
      [ticketId]
    );

    expect(ticket.available_quantity).toBe(100);
  });

  it("should require authentication to delete account", async () => {
    const response = await request(app)
      .delete("/api/users/profile")
      .expect(401);

    expect(response.body).toHaveProperty("error");
  });
});
