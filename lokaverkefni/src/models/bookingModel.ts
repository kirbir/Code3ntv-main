import db from "../config/db.js";

export interface Booking {
  id?: number;
  user_id: string;
  event_id: number;
  status: string;
  total_amount: number;
  payment_ref?: string;
  created_at?: Date;
}

export interface BookingTicket {
  ticket_id: number;
  quantity: number;
}

export const getBookingHistory = async (userId: number) => {
  return await db.any(
    `
  SELECT 
    b.id,
    b.event_id,
    b.status,
    b.total_amount,
    b.created_at,
    e.title as event_title,
    e.start_time as event_start_time,
    v.name as venue_name,
    json_agg(
      json_build_object(
        'ticket_id', bt.ticket_id,
        'quantity', bt.quantity,
        'unit_price', bt.unit_price,
        'section', t.section
      )
    ) as tickets
  FROM bookings b
  JOIN events e ON b.event_id = e.id
  JOIN venues v ON e.venue_id = v.id
  LEFT JOIN booking_tickets bt ON b.id = bt.booking_id
  LEFT JOIN tickets t ON bt.ticket_id = t.id
  WHERE b.user_id = $1
  GROUP BY b.id, e.title, e.start_time, v.name
  ORDER BY b.created_at DESC
  `,
    [userId]
  );
};

export const cancelFutureBookings = async (userId: number) => {
  return await db.tx(async (t) => {
    // Gather all future bookings for user before deleting account
    const futureBookings = await t.any(
      `SELECT 
      b.id,
      b.event_id,
      bt.ticket_id,
      bt.quantity
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN booking_tickets bt ON b.id = bt.booking_id
      WHERE b.user_id = $1
        AND e.start_time > NOW()
        AND b.status = 'confirmed'
      `,
      [userId]
    );

    // Cancel the bookings
    for (const booking of futureBookings) {
      await t.none(
        `
        UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
        [booking.id]
      );

      // Return tickets to available pool
      await t.none(
        `UPDATE tickets 
               SET available_quantity = available_quantity + $1 
               WHERE id = $2`,
        [booking.quantity, booking.ticket_id]
      );
    }
  });
};

export const createBooking = async (
  userId: number,
  eventId: number,
  tickets: BookingTicket[],
  totalAmount: number
) => {
  return await db.tx(async (t) => {
    const booking = await t.one(
      `INSERT INTO bookings (user_id, event_id, status, total_amount) VALUES ($1, $2, 'confirmed', $3) RETURNING *`,
      [userId, eventId, totalAmount]
    );

    // For each ticket bought, add to booking_tickets and decrease available tickets.
    for (const ticket of tickets) {
      await t.none(
        `
            INSERT INTO booking_tickets (booking_id, ticket_id, quantity, unit_price) SELECT $1, $2, $3, price FROM tickets WHERE id = $2
            `,
        [booking.id, ticket.ticket_id, ticket.quantity]
      );

      await t.none(
        `UPDATE tickets SET available_quantity = available_quantity - $1 WHERE id = $2`,
        [ticket.quantity, ticket.ticket_id]
      );
    }

    return booking;
  });
};
