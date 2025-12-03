import express from "express";

import { getEventsController } from "../controllers/eventController.js";

import { validate, validateParams } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getEventsController);

export default router;
