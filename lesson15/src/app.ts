import express from "express";
import movieRouter from "./routes/movies.js";

const app = express();

app.use(express.json());
app.use("/api/movies", movieRouter);

export default app;
