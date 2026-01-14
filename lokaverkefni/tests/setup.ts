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
  } catch (error) {
    console.log("Failed to connect to database: ", error);
    throw new Error("Database connection Failed.");
  }
});

beforeEach(async () => {
  try {
    // Clear test data between tests
    await db.none(
      "DELETE FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com')"
    );
    await db.none("DELETE FROM users WHERE email LIKE '%@example.com'");
  } catch (error) {
    console.error("Error cleaning up test data:", error);
    throw error;
  }
});

afterAll(async () => {
  console.log("Cleaning up...");
});
