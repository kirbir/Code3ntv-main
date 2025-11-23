import type { Request, Response, NextFunction } from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipeById,
  searchRecipes,
} from "../models/recipeModel.js";
import { getCuisineById } from "../models/cuisineModel.js";
import { NotFoundError } from "../middleware/errorHandler.js";

export const getRecipesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if search query is provided
    const query = req.query.q as string;
    const sortBy = req.query.sort as string;
    const order = req.query.order as string;

    if (query !== undefined) {
      // Handle search
      if (!query || query.trim() === "") {
        res.status(400).json({ error: "Search query is required" });
        return;
      }

      const recipes = await searchRecipes(query);
      res.json({ recipes });
      return;
    }

    // No search query, return all recipes with optional sorting
    const recipes = await getRecipes(sortBy, order);
    res.json(recipes);
  } catch (error) {
    console.error("Failed to get Recipes: " + error);
    next(error);
  }
};

export const getRecipeByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const cuisine = await getRecipeById(id);

    if (!cuisine) {
      throw new NotFoundError("Recipe not found");
    }

    res.json(cuisine);
  } catch (error) {
    console.error("Failed to get Recipe by Id: " + error);
    next(error);
  }
};

export const createRecipeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      cook_time_minutes,
      difficulty,
      rating,
      cuisine_id,
    } = req.body;

    // Validate that cuisine exists
    const cuisine = await getCuisineById(cuisine_id);
    if (!cuisine) {
      throw new NotFoundError("Cuisine not found");
    }

    const newRecipe = await createRecipe({
      title,
      description,
      cook_time_minutes,
      difficulty,
      rating,
      cuisine_id,
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Failed to create Recipe: " + error);
    next(error);
  }
};

export const deleteRecipeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteRecipeById(id);
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

export const updateRecipeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Recipe ID" });
      return;
    }
    const {
      title,
      description,
      cook_time_minutes,
      difficulty,
      rating,
      cuisine_id,
    } = req.body;

    // If cuisine_id is provided, validate that it exists
    if (cuisine_id !== undefined) {
      const cuisine = await getCuisineById(cuisine_id);
      if (!cuisine) {
        throw new NotFoundError("Cuisine not found");
      }
    }

    const updatedRecipe = await updateRecipe(id, {
      title,
      description,
      cook_time_minutes,
      difficulty,
      rating,
      cuisine_id,
    });

    if (!updatedRecipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    res.json(updatedRecipe);
  } catch (error) {
    console.log("Failed to update recipe: " + error);
    next(error);
  }
};
