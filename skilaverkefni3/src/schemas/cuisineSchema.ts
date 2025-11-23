import { z } from "zod";

export const createCuisineSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
});

export const cuisineIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});
