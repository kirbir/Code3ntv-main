import fs from "node:fs";
import chalk from "chalk";
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
export function loadMovies(): Movies[] {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");

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

/// SAVE MOVIES TO THE FILE 
function saveMovies(movies: Movies[]) {
    try {
        const jsonString = JSON.stringify(movies, null, 2);
        fs.writeFileSync(filePath, jsonString, "utf-8");
    } catch (error) {
        console.log(chalk.red("Error saving Movies: ", error))
    }

}

/// ADD A NEW MOVIE TO THE FILE
export function addMovie(title: string, year:number): Movies {
    const movies = loadMovies();
    const newMovie: Movies = {
        id: createId(),
        title: title,
        year: year,
        watched: false

    }

    movies.push(newMovie);
    saveMovies(movies);
    console.log(chalk.green("New movie added!"));
    return newMovie;
}

/// LIST ALL MOVIES FROM THE FILE AND PRINT TO THE CONSOLE
export function listMovies() {
    const movies = loadMovies();

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
export function markAsWatched(id: string, watched: boolean = true): boolean {
    const movies = loadMovies();

    const movie = movies.find((movie)=> {
        return movie.id === id;
    });

    if (!movie) {
        return false;
    }

    movie.watched = watched;
    saveMovies(movies);
    console.log(chalk.green(`Marked movie #${id} as watched!`));
    return true;
}

/// CLEAR MOVIE BY ID
export function clearMovie(id: string) {
  const movies = loadMovies();
  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    return;
  }

  const newMovie = movies.filter((movie) => {
    return movie.id !== id;
  });
  saveMovies(newMovie);
}

