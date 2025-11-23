import express from "express";
import {
  getCuisinesController,
  getCuisinesByIdController,
  createCuisineController,
  updateCuisineController,
  deleteCuisineController,
  getRecipesByCuisineController,
} from "../controllers/cuisineController.js";
import { validate, validateParams } from "../middleware/validate.js";
import {
  createCuisineSchema,
  cuisineIdSchema,
} from "../schemas/cuisineSchema.js";

const router = express.Router();

// GET /cuisines - Get all cuisines
router.get("/", getCuisinesController);

// GET /cuisines/:id - Get a single cuisine by ID
router.get("/:id", validateParams(cuisineIdSchema), getCuisinesByIdController);

// GET /cuisines/:id/recipes - Get all recipes for a cuisine
router.get(
  "/:id/recipes",
  validateParams(cuisineIdSchema),
  getRecipesByCuisineController
);

// POST /cuisines - Create a new cuisine
router.post("/", validate(createCuisineSchema), createCuisineController);

// PUT /cuisines/:id - Update a cuisine
router.put(
  "/:id",
  validateParams(cuisineIdSchema),
  validate(createCuisineSchema),
  updateCuisineController
);

// DELETE /cuisines/:id - Delete a cuisine
router.delete("/:id", validateParams(cuisineIdSchema), deleteCuisineController);

export default router;
