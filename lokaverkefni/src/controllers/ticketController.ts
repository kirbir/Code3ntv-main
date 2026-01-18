import type { Response, Request, NextFunction } from "express";
import * as TicketModel from "../models/ticketModel.js";
import { NotFoundError } from "../middleware/errorHandler.js";

export const getTicketsByEventId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const tickets = await TicketModel.getTicketsByEventId(id);

    if (tickets.length === 0) {
      throw new NotFoundError("Tickets not found.");
    }

    res.json(tickets);
  } catch (error) {
    next(error);
  }
};
