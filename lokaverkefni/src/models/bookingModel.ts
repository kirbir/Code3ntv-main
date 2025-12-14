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
