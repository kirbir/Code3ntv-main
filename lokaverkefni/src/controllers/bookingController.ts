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

      totalAmount += ticket.price * ticketRequest.quantity;
    }

    const booking = await BookingModel.createBooking(
      user_id,
      event_id,
      tickets,
      totalAmount
    );

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

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const user_id = req.user?.userId;

    if (!user_id) {
      throw new UnauthorizedError("User not authenticated");
    }

    // Get the booking with event details
    const booking = await db.oneOrNone(
      `SELECT b.*, e.start_time 
       FROM bookings b
       JOIN events e ON b.event_id = e.id
       WHERE b.id = $1`,
      [bookingId]
    );

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    // Check if booking belongs to user
    if (booking.user_id != Number(user_id)) {
      throw new AppError("You are not authorized to cancel this booking", 403);
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      throw new AppError("Booking is already cancelled", 400);
    }

    // Check 24-hour rule
    const eventStartTime = new Date(booking.start_time);
    const now = new Date();
    const hoursUntilEvent =
      (eventStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilEvent < 24) {
      throw new AppError(
        "Cannot cancel booking less than 24 hours before event",
        400
      );
    }

    // Cancel the booking (update status and return tickets)
    await db.tx(async (t) => {
      await t.none(
        `UPDATE bookings 
         SET status = 'cancelled', 
             cancelled_at = NOW(),
             updated_at = NOW()
         WHERE id = $1`,
        [bookingId]
      );

      // Return tickets to available pool
      await t.none(
        `UPDATE tickets t
         SET available_quantity = available_quantity + bt.quantity,
             updated_at = NOW()
         FROM booking_tickets bt
         WHERE bt.booking_id = $1 AND t.id = bt.ticket_id`,
        [bookingId]
      );
    });

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};
