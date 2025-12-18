import express from "express";
import {
  getBookingHistory,
  createBooking,
} from "../controllers/bookingController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Protected route - requires authentication
router.post("/", authenticate, createBooking);
router.get("/", authenticate, getBookingHistory);

export default router;
