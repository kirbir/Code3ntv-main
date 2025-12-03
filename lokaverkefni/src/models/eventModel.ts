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
