import pgPromise from "pg-promise";
import "dotenv/config";

const pgp = pgPromise({});

// Test database configuration - uses tix_test database
const dbConfig = {
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5433,
  database: process.env.PGDATABASE_TEST || "tix_test_data",
  user: process.env.PGUSER ?? "",
  password: process.env.PGPASSWORD ?? "",
};

const db = pgp(dbConfig);

export default db;
