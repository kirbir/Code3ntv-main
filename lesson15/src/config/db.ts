import pgPromise from "pg-promise";
import "dotenv/config";

const pgp = pgPromise({});

const db = pgp({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5433,
  database: process.env.PGDATABASE || "movies",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "Sigurjon#12",
});

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
