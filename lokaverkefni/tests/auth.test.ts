import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("User Authentication Tests", () => {
  // UC4: Register User - Happy Path
  it("should register a new user sucessfully", async () => {
    const newUser = {
      name: "Test User",
      email: "testuser@example.com",
      password: "SecurePass123!",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.user).not.toHaveProperty("password");
  });

  // UC4: Register User - Alternate Flow 3a
  it("should not register user with duplicate email", async () => {
    const firstUser = {
      email: "duplicate@example.com",
      password: "FirstPass123!",
    };

    await request(app).post("/api/users/register").send(firstUser).expect(201);

    const duplicateUser = {
      email: "duplicate@example.com", // Same email!
      password: "AnotherPass456!",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(duplicateUser)
      .expect(409); // ConflictError

    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toContain("Email");
  });

  // UC4: Register User - Alternate Flow 2a (Invalid Data)
  it("should not register user with invalid email", async () => {
    const invalidUser = {
      name: "Test User",
      email: "not-an-email", // Invalid email format
      password: "SecurePass123!",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(invalidUser)
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });

  // UC5: Login - Happy Path
  it("should login existing user and return token", async () => {
    const newUser = {
      email: "logintest@example.com",
      password: "SecurePass123!",
    };

    await request(app).post("/api/users/register").send(newUser).expect(201);

    const credentials = {
      email: "logintest@example.com",
      password: "SecurePass123!",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(credentials)
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe(credentials.email);
  });

  // UC5: Login - Alternate Flow 2a
  it("should not login with wrong password", async () => {
    const wrongCredentials = {
      email: "testuser@example.com",
      password: "WrongPassword123!",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(wrongCredentials)
      .expect(401);

    expect(response.body).toHaveProperty("error");
  });
});
