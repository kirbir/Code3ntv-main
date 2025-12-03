import express from "express";
import eventRoutes from "./routes/eventRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);

app.use(errorHandler);

export default app;
