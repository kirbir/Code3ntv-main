import express from "express";
import cuisineRouter from "./routes/cuisineRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/cuisines", cuisineRouter);

export default app;
