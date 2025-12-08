import express from "express";
import { venueIdSchema } from "../schemas/venueSchema.js";

import {
  getVenueById,
  getVenues,
  getVenueByIdWithEvents,
} from "../controllers/venueController.js";

import { validate, validateParams } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getVenues);
router.get("/:id", validateParams(venueIdSchema), getVenueById);
router.get(
  "/:id/events",
  validateParams(venueIdSchema),
  getVenueByIdWithEvents
);

export default router;
