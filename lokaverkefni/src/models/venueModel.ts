import db from "../config/db.js";

export interface Venue {
  id?: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
}

export const getVenueByIdWithEvents = async (id: number) => {
  // Get venue
  const venue = await db.oneOrNone(`SELECT * FROM venues WHERE id = $1`, [id]);

  if (!venue) return null;

  // Get upcoming events at this venue
  const events = await db.any(
    `SELECT 
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.base_price,
        e.is_active
      FROM events e
      WHERE e.venue_id = $1 
        AND e.start_time > NOW()
        AND e.is_active = true
      ORDER BY e.start_time ASC`,
    [id]
  );

  return {
    ...venue,
    events,
  };
};

export const getVenueById = async (id: number): Promise<Venue | null> => {
  return await db.oneOrNone(`SELECT * FROM venues WHERE id = $1`, [id]);
};

export const getVenues = async (
  sortBy?: string,
  order?: string
): Promise<Venue[]> => {
  // Validate sort field to prevent SQL injection
  const validSortFields = ["city", "name"];
  const sortField =
    sortBy && validSortFields.includes(sortBy) ? sortBy : "city";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const venues = await db.any(
    `SELECT * FROM venues ORDER BY ${sortField} ${sortOrder}`
  );
  return venues.map((event: any) => ({
    ...event,
  }));
};
