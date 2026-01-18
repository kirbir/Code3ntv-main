import type { Request, Response, NextFunction } from "express";
import { getEventById, getEvents } from "../models/eventModel.js";

import { NotFoundError } from "../middleware/errorHandler.js";

export const getEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sortBy = req.query.sort as string;
    const order = req.query.order as string;

    const events = await getEvents(sortBy, order);
    res.json(events);
  } catch (error) {
    console.error("Failed to get Events: " + error);
    next(error);
  }
};

export const getEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = req.params.id;
    const event = await getEventById(Number(eventId));

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};
