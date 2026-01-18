import express from "express";
import { getTicketsByEventId } from "../controllers/ticketController.js";
import { getEventsController } from "../controllers/eventController.js";
import { validate, validateParams } from "../middleware/validate.js";
import { eventIdSchema } from "../schemas/eventSchema.js";

const router = express.Router();

router.get("/:id/tickets", validateParams(eventIdSchema), getTicketsByEventId);
router.get("/", getEventsController);

export default router;
