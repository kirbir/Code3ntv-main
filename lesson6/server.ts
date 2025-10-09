import express from "express";
import { errorHandler } from "./errorHandler.js";
import { NextFunction, Request, Response } from "express";
import {z} from "zod";
import { loadMoviesAsync, addMovie, listMovies, markAsWatched , type Movies, clearMovie, loadMoviesAsyncPaginated} from "./movies.ts";
const app = express();
const port = 8000;


const uuidSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  "Invalid UUID format"
);
app.use(express.json());



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

//// Middleware



/// GET ALL MOVIES FROM FILE
app.get("/movies", async (request, response) => {
  const movies = await loadMoviesAsync();
  response.status(200).json(movies);

});


/// GET MOVIE BY ID
app.get("/movies/:id", async (request, response, next:NextFunction)=>{
  response.status(500).json({error: "Error!"});
  console.log("GET MOVIE BY ID is hit");
  const {id} = request.params as {id:string};
  const result = uuidSchema.safeParse({id});

  if (!result.success) {
    console.log(result.success);
  
    return;
  }
 
  console.log("About to call loadMoviesAsync");
  const movies = await loadMoviesAsync();
  console.log("loadMoviesAsync completed");
  
  const movie = movies.find((movie)=> {
      return movie.id === id;
  });

  if (!movie) {
      response.status(404).json({error: "Movie not found or ID is wrong"});
      return;
  }

  response.status(200).json(movie);
});


/// GET ALL MOVIES FROM FILE PAGINATED
app.get("/movies/paginated", async (request, response) => {
  console.log("Paginated endpoint hit");
  try {
    const {page, limit} = request.query;
    console.log("Query params:", {page, limit});
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    
    console.log("Parsed params:", {pageNum, limitNum});
    
    const movies = await loadMoviesAsync();
    console.log("Total movies:", movies.length);
    
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    const result = movies.slice(start, end);
    
    console.log("Result:", result);
    response.status(200).json(result);
  } catch (error) {
    console.log("Error:", error);
    response.status(500).json({error: "Error loading movies paginated"});
  }
});

/// ADD A NEW MOVIE TO THE FILE
app.post("/movies", async (request, response) => {
    const {title, year} = request.body as {title:string, year:number};

    const newMovie = await addMovie(title, year);
    response.status(201).json(newMovie);
})

/// MARK A MOVIE AS WATCHED BY ID
app.patch("/movies/:id", async (request, response) => {
    const {id} = request.body as {id:string};
    const {watched} = request.body as {watched:boolean};

    const movies = await loadMoviesAsync();
    const foundMovie = movies.find((movie)=> {
        return movie.id === id;
    });

    if (!foundMovie) {
        response.status(404).send(null);
        return;
    }

    markAsWatched(foundMovie.id, watched);
    response.status(204).send('');
})


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

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
