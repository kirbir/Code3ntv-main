import express from "express";
import * as movieModel from "../models/movieModel.js";

const router = express.Router();

// GET all movies
router.get("/", async (req, res) => {
  try {
    const movies = await movieModel.getAllMovies();
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch movies",
        details: error instanceof Error ? error.message : String(error),
      });
  }
});

// GET movie by id
router.get("/:id", async (req, res) => {
  try {
    const movie = await movieModel.getMovieById(Number(req.params.id));
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

// POST create movie
router.post("/", async (req, res) => {
  try {
    const movie = await movieModel.createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to create movie" });
  }
});

// PUT update movie
router.put("/:id", async (req, res) => {
  try {
    const movie = await movieModel.updateMovie(Number(req.params.id), req.body);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// DELETE movie
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await movieModel.deleteMovie(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

export default router;
