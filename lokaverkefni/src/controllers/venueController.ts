import type { Response, Request, NextFunction } from "express";
import * as VenueModel from "../models/venueModel.js";

import { NotFoundError } from "../middleware/errorHandler.js";

export const getVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sortBy = req.query.sort as string;
    const order = req.query.order as string;

    const venues = await VenueModel.getVenues(sortBy, order);
    res.json(venues);
  } catch (error) {
    console.error("Failed to get Venues: " + error);
    next(error);
  }
};

export const getVenueById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const venue = await VenueModel.getVenueById(id);

    if (!venue) {
      throw new NotFoundError("Venue not found.");
    };

    res.json(venue);
  } catch (error) {
    next(error);
  }
};

export const getVenueByIdWithEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const venue = await VenueModel.getVenueByIdWithEvents(id);

    if (!venue) {
      throw new NotFoundError("Venue not found.");
    }

    res.json(venue)
  } catch (error) {
    next(error);
  }
};
