import db from "./src/config/db.js";

async function testConnection() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    const result = await db.one("SELECT NOW() as current_time");
    console.log("Database connection successful!");
    console.log("Current time from database:", result.current_time);

    // Check if movies table exists
    const tableCheck = await db.oneOrNone(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'movies'
      );
    `);

    if (tableCheck?.exists) {
      console.log("Movies table exists!");

      // Count movies
      const count = await db.one("SELECT COUNT(*) as count FROM movies");
      console.log(`Found ${count.count} movies in the database`);

      // Show all movies
      const movies = await db.any("SELECT * FROM movies");
      console.log("Movies:", movies);
    } else {
      console.log("Movies table does NOT exist!");
      console.log("Please run the SQL from setup.sql to create it.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Database connection failed!");
    console.error("Error:", error);
    process.exit(1);
  }
}

testConnection();
