import type { Request, Response, NextFunction } from "express";
import {
  getCuisines,
  getCuisineById,
  createCuisine,
  deleteCuisine,
  updateCuisine,
  getRecipesByCuisineId,
} from "../models/cuisineModel.js";
import { NotFoundError } from "../middleware/errorHandler.js";

export const getCuisinesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sortBy = req.query.sort as string;
    const order = req.query.order as string;

    const cuisines = await getCuisines(sortBy, order);
    res.json(cuisines);
  } catch (error) {
    console.error("Failed to get Cuisines: " + error);
    next(error);
  }
};

export const getCuisinesByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const cuisine = await getCuisineById(id);

    if (!cuisine) {
      throw new NotFoundError("Cuisine not found");
    }

    res.json(cuisine);
  } catch (error) {
    console.error("Failed to get Cuisine by Id: " + error);
    next(error);
  }
};

export const createCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.body;
    const newCuisine = await createCuisine(name);
    res.status(201).json(newCuisine);
  } catch (error) {
    console.error("Failed to create Cuisine: " + error);
    next(error);
  }
};

export const deleteCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteCuisine(id);
    if (!deleted) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete recipe: " + error);
    next(error);
  }
};

export const updateCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    console.log("Failed to update cuisine: " + error);
    next(error);
  }
};

export const getRecipesByCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    // Check if cuisine exists
    const cuisine = await getCuisineById(id);
    if (!cuisine) {
      throw new NotFoundError("Cuisine not found");
    }

    const recipes = await getRecipesByCuisineId(id);
    res.json(recipes);
  } catch (error) {
    console.error("Failed to get recipes by cuisine: " + error);
    next(error);
  }
};
