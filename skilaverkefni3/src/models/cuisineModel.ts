import db from "../config/db.js";

export interface Cuisine {
  id?: number;
  name: string;
}

export const getCuisineById = async (id: number): Promise<Cuisine | null> => {
  return await db.oneOrNone(`SELECT * FROM cuisines WHERE id = $1`, [id]);
};

export const getCuisines = async (
  sortBy?: string,
  order?: string
): Promise<Cuisine[]> => {
  // Validate sort field to prevent SQL injection
  const validSortFields = ["name", "id"];
  const sortField =
    sortBy && validSortFields.includes(sortBy) ? sortBy : "name";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const cuisines = await db.any(
    `SELECT * FROM cuisines ORDER BY ${sortField} ${sortOrder}`
  );
  return cuisines.map((cuisine: any) => ({
    ...cuisine,
  }));
};

export const createCuisine = async (name: string): Promise<Cuisine> => {
  const result = await db.one(
    `INSERT INTO cuisines(name) VALUES($1) RETURNING *`,
    [name]
  );
  return result;
};

export const updateCuisine = async (
  id: number,
  name: string
): Promise<Cuisine | null> => {
  const result = await db.oneOrNone(
    `UPDATE cuisines SET name = $1 WHERE id = $2 RETURNING *`,
    [name, id]
  );
  return result;
};

export const deleteCuisine = async (id: number): Promise<boolean> => {
  const result = await db.result("DELETE FROM cuisines WHERE id = $1", [id]);
  return result.rowCount > 0;
};

export const getRecipesByCuisineId = async (cuisineId: number) => {
  return await db.any(
    `SELECT r.*, c.name as cuisine_name 
     FROM recipes r 
     JOIN cuisines c ON r.cuisine_id = c.id 
     WHERE r.cuisine_id = $1 
     ORDER BY r.created_at DESC`,
    [cuisineId]
  );
};
