import fs from "node:fs";
import chalk from "chalk";
import {readFile, writeFile} from "node:fs/promises";
import { randomUUID } from "node:crypto";
import dotenv from 'dotenv';

export type Movies = {
  id: string;
  title: string;
  year: number;
  watched: boolean;
};

dotenv.config();

export const filePathUrl = process.env.DB_FILE || './movies.json';

function createId() {
  return randomUUID();
}

/// LOAD MOVIES FROM FILE AND RETURN AS AN ARRAY
export async function loadMoviesAsync(): Promise<Movies[]> {
  console.log("Loading movies from file");
  try {
    const fileContent = await readFile(filePathUrl, "utf-8");

    if (fileContent.trim() === "") {
      console.log(
        chalk.yellow(
          `WARNING! The ${filePathUrl} is empty, maybe add some movies to the database?`
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

export async function loadMoviesPaginatedAsync(
  filePath: string,
  page: number | undefined,
  limit: number | undefined
): Promise<Movies[]> {
  try {
    const data = await readFile(filePath, 'utf8');
    const response = JSON.parse(data);

    if (!Array.isArray(response)) {
      throw new Error('Expected JSON array');
    }

    // If page or limit are undefined, return all tasks
    if (page === undefined || limit === undefined) {
      return response;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return response.slice(startIndex, endIndex);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('loadMoviesPaginatedAsync: ' + error.message);
    }
    throw new Error('loadMoviesAsyncPaginated: Unknown error');
  }
}


 /// Save movies to a file asynchronously
 // @param filePath - The path to the file to save movies to
 // @param movies - The movies to save
 //
export async function saveMoviesAsync(filePath: string, movies: Movies[]): Promise<void> {
  try {
    await writeFile(filePath, JSON.stringify(movies, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('saveMoviesAsync: ' + e.message);
    }
    throw new Error('saveMoviesAsync: Unknown error');
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
    await saveMoviesAsync(filePathUrl,movies);
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
    await saveMoviesAsync(filePathUrl,movies);
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
  await saveMoviesAsync(filePathUrl,newMovie);
}

