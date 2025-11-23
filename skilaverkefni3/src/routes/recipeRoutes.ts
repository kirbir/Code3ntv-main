import express from "express";
import {
  getRecipesController,
  getRecipeByIdController,
  createRecipeController,
  updateRecipeController,
  deleteRecipeController,
} from "../controllers/recipeController.js";
import { validate, validateParams } from "../middleware/validate.js";
import {
  createRecipeSchema,
  updateRecipeSchema,
  recipeIdSchema,
} from "../schemas/recipeSchema.js";

const router = express.Router();

router.get("/", getRecipesController);

router.get("/:id", validateParams(recipeIdSchema), getRecipeByIdController);

router.post("/", validate(createRecipeSchema), createRecipeController);

router.put(
  "/:id",
  validateParams(recipeIdSchema),
  validate(updateRecipeSchema),
  updateRecipeController
);

router.delete("/:id", validateParams(recipeIdSchema), deleteRecipeController);

export default router;
