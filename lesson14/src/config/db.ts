import pgPromise = require("pg-promise");
import 'dotenv' from dotenv;

const pgp = pgPromise();

const db = pgPromise({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    databasae: process.env.PGDB,
    password: process.env.PGPASSWORD
})