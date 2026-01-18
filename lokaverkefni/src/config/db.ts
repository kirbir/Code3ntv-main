import pgPromise from "pg-promise";
import "dotenv/config";

const pgp = pgPromise({});

// Use test database when NODE_ENV is "test"
const isTestEnvironment = process.env.NODE_ENV === "test";

const dbConfig = {
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5433,
  database: isTestEnvironment 
    ? (process.env.PGDATABASE_TEST || "tix_test_data")
    : (process.env.PGDATABASE || "tix"),
  user: process.env.PGUSER ?? "",
  password: process.env.PGPASSWORD ?? "",
};

const db = pgp(dbConfig);

// Only log connection in non-test environment
if (!isTestEnvironment) {
  db.connect()
    .then((obj) => {
      console.log(
        `✅ Connected to: ${dbConfig.database} PostgreSQL with pg-promise`
      );
      obj.done();
    })
    .catch((error) => {
      console.error("❌ Database connection error:", error.message);
    });
}

export default db;
