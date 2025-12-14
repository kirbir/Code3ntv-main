import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Protected route - requires authentication
router.post("/", authenticate, createBooking);

export default router;
