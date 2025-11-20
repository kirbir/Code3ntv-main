import type { Request, Response } from "express";
import {
  getCuisines,
  createCuisine,
  deleteCuisine,
  updateCuisine,
} from "../models/cuisineModel.js";

export const getCuisinesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cuisines = await getCuisines();
    res.json(cuisines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cuisines: " + error });
  }
};

export const createCuisineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const newCuisine = await createCuisine(name);
    res.status(201).json(newCuisine);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cuisine: " + error });
  }
};

export const deleteCuisineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id); // Get ID from URL parameter, not body
    const deleted = await deleteCuisine(id);
    if (!deleted) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    res.status(204).send(); // 204 No Content is standard for DELETE
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete cuisines: " + error });
  }
};

export const updateCuisineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id); // Get ID from URL parameter
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Cuisine ID" });
      return;
    }
    const { name } = req.body; // Get name from body
    const updatedCuisine = await updateCuisine(id, name);
    if (!updatedCuisine) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    res.json(updatedCuisine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cuisine: " + error });
  }
};
