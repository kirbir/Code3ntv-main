import express from "express";
import {
  getCuisinesController,
  createCuisineController,
  updateCuisineController,
  deleteCuisineController,
} from "../controllers/cuisineController.js";

const router = express.Router();

// GET /cuisines - Get all cuisines
router.get("/", getCuisinesController);

// POST /cuisines - Create a new cuisine
router.post("/", createCuisineController);

// PUT /cuisines/:id - Update a cuisine
router.put("/:id", updateCuisineController);

// DELETE /cuisines/:id - Delete a cuisine
router.delete("/:id", deleteCuisineController);

export default router;
