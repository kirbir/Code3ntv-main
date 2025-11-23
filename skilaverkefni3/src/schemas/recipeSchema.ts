import { z } from "zod";

export const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  cook_time_minutes: z
    .number()
    .int()
    .positive("Cook time must be positive")
    .optional(),
  difficulty: z.string().max(50, "Difficulty too long").optional(),
  rating: z
    .number()
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5")
    .optional(),
  cuisine_id: z.number().int().positive("Cuisine ID required"),
});

export const updateRecipeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long")
    .optional(),
  description: z.string().max(1000, "Description too long").optional(),
  cook_time_minutes: z
    .number()
    .int()
    .positive("Cook time must be positive")
    .optional(),
  difficulty: z.string().max(50, "Difficulty too long").optional(),
  rating: z
    .number()
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5")
    .optional(),
  cuisine_id: z.number().int().positive("Cuisine ID required").optional(),
});

export const recipeIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});
