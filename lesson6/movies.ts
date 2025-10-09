import fs from "node:fs";
import chalk from "chalk";
import {readFile, writeFile} from "node:fs/promises";
import { randomUUID } from "node:crypto";

export type Movies = {
  id: string;
  title: string;
  year: number;
  watched: boolean;
};

const filePath = "./movies.json";

function createId() {
  return randomUUID();
}

/// LOAD MOVIES FROM FILE AND RETURN AS AN ARRAY
export async function loadMoviesAsync(): Promise<Movies[]> {
  console.log("Loading movies from file");
  try {
    const fileContent = await readFile(filePath, "utf-8");

    if (fileContent.trim() === "") {
      console.log(
        chalk.yellow(
          `WARNING! The ${filePath} is empty, maybe add some movies to the database?`
        )
      );
      return [];
    }

    const allMoviesParsed = JSON.parse(fileContent);
    return allMoviesParsed;
  } catch (error) {
    console.log("Error loading movies: ", error);
    return [];
  }
}

export async function loadMoviesAsyncPaginated(page: number, limit: number): Promise<Movies[]> {
  try {
    const movies = await loadMoviesAsync();
    const start = (page - 1) * limit;
    const end = start + limit;
    return movies.slice(start, end);
    
  } catch (error) {
    console.log("Error loading movies paginated: ", error);
    return [];
  }
}

/// SAVE MOVIES TO THE FILE 
async function saveMoviesAsync(movies: Movies[]) {
    try {
        const jsonString = JSON.stringify(movies, null, 2);
        await writeFile(filePath, jsonString, "utf-8");
    } catch (error) {
        console.log(chalk.red("Error saving Movies: ", error))
    }

}

/// ADD A NEW MOVIE TO THE FILE
export async function addMovie(title: string, year:number): Promise<Movies> {
    const movies = await loadMoviesAsync();
    const newMovie: Movies = {
        id: createId(),
        title: title,
        year: year,
        watched: false

    }

    movies.push(newMovie);
    await saveMoviesAsync(movies);
    console.log(chalk.green("New movie added!"));
    return newMovie;
}

/// LIST ALL MOVIES FROM THE FILE AND PRINT TO THE CONSOLE
export async function listMovies() {
    const movies = await loadMoviesAsync();

    if(movies.length ===0) {
        console.log(chalk.yellow("No movies found. Add a movie to the get started!"));
        return;
    }

    movies.forEach((movie, index) => {
        const isWatched = movie.watched ? "[✔]" : "[ ]";
        console.log(chalk.blue(movie.id + " " + isWatched + " " + movie.title + " " + movie.year));
    });
}

/// MARK A MOVIE AS WATCHED 
export async function markAsWatched(id: string, watched: boolean = true): Promise<boolean> {
    const movies = await loadMoviesAsync();

    const movie = movies.find((movie)=> {
        return movie.id === id;
    });

    if (!movie) {
        return false;
    }

    movie.watched = watched;
    await saveMoviesAsync(movies);
    console.log(chalk.green(`Marked movie #${id} as watched!`));
    return true;
}

/// CLEAR MOVIE BY ID
export async function clearMovie(id: string) {
  const movies = await loadMoviesAsync();
  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    return;
  }

  const newMovie = movies.filter((movie) => {
    return movie.id !== id;
  });
  await saveMoviesAsync(newMovie);
}

