import express from "express";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { loadMoviesAsync, addMovie, listMovies, markAsWatched, type Movies, clearMovie, loadMoviesAsyncPaginated } from "./movies";
import { errorHandler, validate, validateParams, validateQuery } from "./middleware";
const app = express();
const port = 8000;


const uuidSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  "Invalid UUID format"
);

app.use(express.json());

interface IParam {
  id: string
}

const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1)
});

const paramsSchema = z.object({
  id: uuidSchema
});

const updateMovieSchema = z.object({
  watched: z.boolean()
});

//// MIDDLEWARE
app.use((request, response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${request.method} ${request.originalUrl}`);
  if (request.method === "POST" || request.method === "PATCH") {

    console.log(request.body);
    next();
  } else {

    next();

  }

});

// Replace lines 36-39 with:
app.use(errorHandler);

app.get("/", (req, res) => {
  throw new Error("Something broke!");
});
//// Middleware


/// GET ALL MOVIES FROM FILE PAGINATED
app.get("/movies/paginated", async (request, response) => {
  console.log("Paginated endpoint hit");
  try {
    const { page, limit } = request.query;
    console.log("Query params:", { page, limit });

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    console.log("Parsed params:", { pageNum, limitNum });

    const movies = await loadMoviesAsync();
    console.log("Total movies:", movies.length);

    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    const result = movies.slice(start, end);

    console.log("Result:", result);
    response.status(200).json(result);
  } catch (error) {
    console.log("Error:", error);
    response.status(500).json({ error: "Error loading movies paginated" });
  }
});

/// GET MOVIE BY ID
app.get("/movies/:id", validateParams(paramsSchema), async (req: Request, response, next: NextFunction) => {

  console.log("GET MOVIE BY ID is hit");
  const { id } = req.params;
  const result = uuidSchema.safeParse(id);
  console.log(result)

  if (!result.success) {
    response.status(400).json({ error: "Error: Invalid format of UUID!" });
    return;
  }

  console.log("About to call loadMoviesAsync");
  const movies = await loadMoviesAsync();
  console.log("loadMoviesAsync completed");

  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    response.status(404).json({ error: "Movie not found or ID is wrong" });
    return;
  }

  response.status(200).json(movie);
});

/// GET ALL MOVIES FROM FILE
app.get("/movies", async (request, response) => {
  const movies = await loadMoviesAsync();
  response.status(200).json(movies);

});

/// ADD A NEW MOVIE TO THE FILE
app.post("/movies", validate(createMovieSchema), async (request, response) => {
  const { title, year } = request.body as { title: string, year: number };
  const newMovie = await addMovie(title, year);
  response.status(201).json(newMovie);
});

/// MARK A MOVIE AS WATCHED BY ID
app.patch("/movies/:id", validateParams(paramsSchema), validate(updateMovieSchema), async (request, response) => {
  const { id } = request.params as { id: string };
  const { watched } = request.body as { watched: boolean };
  
  const movies = await loadMoviesAsync();
  const foundMovie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!foundMovie) {
    response.status(404).send(null);
    return;
  }

  markAsWatched(foundMovie.id, watched);
  response.status(204).send('');
});


//// DELETE MOVIE BY ID
app.delete("/movies/:id", async (request, response) => {
  const { id } = request.params as { id: string };
  const movies = await loadMoviesAsync();
  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    response.status(404).send(null);
    return;
  }

  clearMovie(movie.id);
  response.status(204).send("");
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
