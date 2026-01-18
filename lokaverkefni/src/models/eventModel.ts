import db from "../config/db.js";

export interface Event {
  id?: number;
  title: string;
  description: string;
  venue_id: number;
  start_time: number;
  end_time: number;
  is_active: boolean;
  base_price: number;
}

export const getEventById = async (id: number) => {
  // Get event with venue info
  const event = await db.oneOrNone(
    `SELECT 
      e.*,
      v.name as venue_name,
      v.address as venue_address,
      v.city as venue_city,
      v.capacity as venue_capacity
    FROM events e
    JOIN venues v ON e.venue_id = v.id
    WHERE e.id = $1`,
    [id]
  );

  if (!event) return null;

  // Get categories for this event
  const categories = await db.any(
    `SELECT c.id, c.name, c.description
    FROM categories c
    JOIN event_categories ec ON c.id = ec.category_id
    WHERE ec.event_id = $1`,
    [id]
  );

  return {
    ...event,
    categories,
  };
};

export const getEvents = async (
  sortBy?: string,
  order?: string
): Promise<Event[]> => {
  // Validate sort field to prevent SQL injection
  const validSortFields = ["title", "id"];
  const sortField =
    sortBy && validSortFields.includes(sortBy) ? sortBy : "title";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const events = await db.any(
    `SELECT * FROM events ORDER BY ${sortField} ${sortOrder}`
  );
  return events.map((event: any) => ({
    ...event,
  }));
};
