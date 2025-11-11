import type { Request, Response } from "express";
import { getAllMovies, createMovie } from "../models/movieModel.js";

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies: " + error });
  }
};
