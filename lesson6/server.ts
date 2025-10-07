import express from "express";
import { loadMoviesAsync, addMovie, listMovies, markAsWatched , type Movies, clearMovie, loadMoviesAsyncPaginated} from "./movies.ts";
const app = express();
const port = 8000;



app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//// MIDDLEWARE
app.use((request, response, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${request.method} ${request.originalUrl}`);
    next();
  });
  
  app.use((request, response, next) => {
    if (request.method === "POST") {
      console.log(request.body);
    }
    next();
  });


/// GET MOVIE BY ID
app.get("/movies/:id", async (request, response)=>{
    const {id} = request.params as {id:string};
    const movies = await loadMoviesAsync();

    const movie = movies.find((movie)=> {
        return movie.id === id;
    });

    if (!movie) {
        response.status(404);
        return;
    }

    response.status(200).json(movie);
});

/// GET ALL MOVIES FROM FILE
app.get("/movies", async (request, response) => {
    const movies = await loadMoviesAsync();
    response.status(200).json(movies);

});

app.get("/movies/paginated", async (request, response) => {
    const {page, limit} = request.query as {page:number | string, limit:number | string};
    const movies = await loadMoviesAsyncPaginated(Number(page), Number(limit));
    response.status(200).json(movies);
})

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