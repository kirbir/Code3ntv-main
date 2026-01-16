import type { Response, Request, NextFunction } from "express";
import * as BookingModel from "../models/bookingModel.js";
import * as EventModel from "../models/eventModel.js";
import {
  NotFoundError,
  AppError,
  UnauthorizedError,
} from "../middleware/errorHandler.js";

import db from "../config/db.js";

export const getBookingHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user_id = req.user?.userId;

    if (!user_id) {
      throw new Error("User not authenticated");
    }

    const bookings = await BookingModel.getBookingHistory(user_id);

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { event_id, tickets } = req.body;
    // @ts-ignore - user_id comes from auth middleware
    const user_id = req.user?.userId;

    if (!user_id) {
      throw new UnauthorizedError("User not authenticated");
    }

    // Validate event exists and hasn't passed
    const event = await EventModel.getEventById(event_id);
    if (!event) {
      throw new NotFoundError("Event not found");
    }

    // Check if event has already started/passed
    const eventStartTime = new Date(event.start_time);
    if (eventStartTime < new Date()) {
      throw new AppError("Cannot book tickets for past events", 400);
    }

    // Validate tickets exist and availability
    let totalAmount = 0;

    for (const ticketRequest of tickets) {
      const ticket = await db.oneOrNone(
        "SELECT * FROM tickets WHERE id = $1 AND event_id = $2",
        [ticketRequest.ticket_id, event_id]
      );

      if (!ticket) {
        throw new NotFoundError(
          `Ticket ${ticketRequest.ticket_id} not found for this event`
        );
      }

      // Check availability
      if (ticket.available_quantity < ticketRequest.quantity) {
        throw new Error(
          `Not enough tickets available. Only ${ticket.available_quantity} left for ${ticket.section}`
        );
      }

      // Calculate total
      totalAmount += ticket.price * ticketRequest.quantity;
    }

    // 3. Create the booking (transaction handles the DB updates)
    const booking = await BookingModel.createBooking(
      user_id,
      event_id,
      tickets,
      totalAmount
    );

    // 4. Return success response
    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        id: booking.id,
        event_id: booking.event_id,
        status: booking.status,
        total_amount: booking.total_amount,
        created_at: booking.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};
