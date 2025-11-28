import pgPromise from "pg-promise";
import "dotenv/config";

const pgp = pgPromise({});

const dbConfig = {
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5433,
  database: process.env.PGDATABASE || "tix",
  user: process.env.PGUSER ?? "",
  password: process.env.PGPASSWORD ?? "",
};

const db = pgp(dbConfig);

db.connect()
  .then((obj) => {
    console.log(
      `✅ Connected to: ${process.env.PGHOST} PostgreSQL with pg-promise`
    );
    obj.done();
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error.message);
  });

export default db;
