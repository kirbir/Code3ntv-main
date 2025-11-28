import express from "express";
import cuisineRouter from "./routes/cuisineRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
// app.use("/api/cuisines", cuisineRouter);
// app.use("/api/recipes", recipeRouter);

app.use(errorHandler);

export default app;

