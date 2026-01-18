import express from "express";
import {
  getBookingHistory,
  createBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Protected route - requires authentication
router.post("/", authenticate, createBooking);
router.get("/", authenticate, getBookingHistory);
router.delete("/:id", authenticate, cancelBooking);

export default router;
