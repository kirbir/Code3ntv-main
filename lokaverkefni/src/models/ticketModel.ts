import db from "../config/db.js";

export interface Ticket {
  id?: number;
  section: string;
  description: string;
  price: number;
  total_quantity: number;
  available_quantity: number;
}

export const getTicketsByEventId = async (eventId: number) => {
  return await db.any(
    `SELECT 
          id,
          section,
          description,
          price,
          total_quantity,
          available_quantity
        FROM tickets 
        WHERE event_id = $1
        ORDER BY price DESC`, // Show expensive (VIP) first
    [eventId]
  );
};
