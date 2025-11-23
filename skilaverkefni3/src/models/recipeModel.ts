import db from "../config/db.js";

export interface Recipe {
  id?: number;
  title: string;
  description?: string;
  cook_time_minutes?: number;
  difficulty?: string;
  rating?: number;
  cuisine_id: number;
  cuisine_name?: string; // Optional - included when fetching with JOIN
  created_at?: string;
}
// id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
// title VARCHAR(255) NOT NULL,
// description TEXT,
// cook_time_minutes INTEGER,
// difficulty VARCHAR(50),
// rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 5),
// created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
// cuisine_id BIGINT NOT NULL,
// export const getCuisineById = async (id: number): Promise<Cuisine | null> => {
//   return await db.oneOrNone(`SELECT * FROM cuisines WHERE id = $1`, [id]);
// };

export const getRecipeById = async (id: number): Promise<Recipe | null> => {
  return await db.oneOrNone(
    `SELECT r.*, c.name as cuisine_name 
     FROM recipes r 
     JOIN cuisines c ON r.cuisine_id = c.id 
     WHERE r.id = $1`,
    [id]
  );
};

export const getRecipes = async (
  sortBy?: string,
  order?: string
): Promise<Recipe[]> => {
  // Validate sort field to prevent SQL injection
  const validSortFields = [
    "title",
    "rating",
    "cook_time_minutes",
    "difficulty",
    "created_at",
  ];
  const sortField =
    sortBy && validSortFields.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const recipes = await db.any(
    `SELECT r.*, c.name as cuisine_name 
     FROM recipes r 
     JOIN cuisines c ON r.cuisine_id = c.id 
     ORDER BY r.${sortField} ${sortOrder}`
  );
  return recipes;
};

export const createRecipe = async (recipe: Recipe): Promise<Recipe> => {
  const newRecipe = await db.one(
    `INSERT INTO recipes (title, description, cook_time_minutes, difficulty, rating, cuisine_id) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      recipe.title,
      recipe.description,
      recipe.cook_time_minutes,
      recipe.difficulty,
      recipe.rating,
      recipe.cuisine_id,
    ]
  );

  // Fetch the recipe with cuisine_name
  return await db.one(
    `SELECT r.*, c.name as cuisine_name 
     FROM recipes r 
     JOIN cuisines c ON r.cuisine_id = c.id 
     WHERE r.id = $1`,
    [newRecipe.id]
  );
};

export const updateRecipe = async (
  id: number,
  recipe: Partial<Recipe>
): Promise<Recipe | null> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (recipe.title !== undefined) {
    fields.push(`title = $${paramCount++}`);
    values.push(recipe.title);
  }
  if (recipe.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(recipe.description);
  }
  if (recipe.cook_time_minutes !== undefined) {
    fields.push(`cook_time_minutes = $${paramCount++}`);
    values.push(recipe.cook_time_minutes);
  }
  if (recipe.difficulty !== undefined) {
    fields.push(`difficulty = $${paramCount++}`);
    values.push(recipe.difficulty);
  }
  if (recipe.rating !== undefined) {
    fields.push(`rating = $${paramCount++}`);
    values.push(recipe.rating);
  }
  if (recipe.cuisine_id !== undefined) {
    fields.push(`cuisine_id = $${paramCount++}`);
    values.push(recipe.cuisine_id);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);
  const query = `UPDATE recipes SET ${fields.join(
    ", "
  )} WHERE id = $${paramCount} RETURNING *`;

  const updatedRecipe = await db.oneOrNone(query, values);

  if (!updatedRecipe) {
    return null;
  }

  // Fetch the recipe with cuisine_name
  return await db.oneOrNone(
    `SELECT r.*, c.name as cuisine_name 
     FROM recipes r 
     JOIN cuisines c ON r.cuisine_id = c.id 
     WHERE r.id = $1`,
    [updatedRecipe.id]
  );
};

export const deleteRecipeById = async (id: number): Promise<boolean> => {
  const result = await db.result("DELETE FROM recipes WHERE id = $1", [id]);
  return result.rowCount > 0;
};

export const searchRecipes = async (query: string) => {
  return await db.any(
    `SELECT r.*, c.name as cuisine_name 
     FROM recipes r 
     JOIN cuisines c ON r.cuisine_id = c.id 
     WHERE r.title ILIKE $1 OR r.description ILIKE $1 
     ORDER BY r.created_at DESC`,
    [`%${query}%`]
  );
};
