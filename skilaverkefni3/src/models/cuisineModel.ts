import db from "../config/db.js";

export interface Cuisine {
  id: Number;
  name: String;
}

export const getCuisines = async (): Promise<Cuisine[]> => {
  const cuisines = await db.any("SELECT * FROM cuisines");
  return cuisines.map((cuisine: any) => ({
    ...cuisine,
  }));
};

export const createCuisine = async (
  cuisine: Partial<Cuisine>
): Promise<Cuisine> => {
  const result = await db.one(
    `INSERT INTO cuisines(name) VALUES($1) RETURNING *`,
    [cuisine.name]
  );
  return {
    ...result,
  };
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
