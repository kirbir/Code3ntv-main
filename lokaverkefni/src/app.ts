import express from "express";
import eventRoutes from "./routes/eventRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(errorHandler);

export default app;
