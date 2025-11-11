import db from "../config/db.js";

export interface Movie {
  id: number;
  title: string;
  director?: string;
  release_year?: number;
  genre?: string;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  return await db.any("SELECT * FROM movies");
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  return await db.oneOrNone("SELECT * FROM movies WHERE id = $1", [id]);
};

export const createMovie = async (movie: Partial<Movie>): Promise<Movie> => {
  return await db.one(
    "INSERT INTO movies(title, director, release_year, genre) VALUES($1, $2, $3, $4) RETURNING *",
    [movie.title, movie.director, movie.release_year, movie.genre]
  );
};

export const updateMovie = async (
  id: number,
  movie: Partial<Movie>
): Promise<Movie | null> => {
  return await db.oneOrNone(
    "UPDATE movies SET title = $1, director = $2, release_year = $3, genre = $4 WHERE id = $5 RETURNING *",
    [movie.title, movie.director, movie.release_year, movie.genre, id]
  );
};

export const deleteMovie = async (id: number): Promise<boolean> => {
  const result = await db.result("DELETE FROM movies WHERE id = $1", [id]);
  return result.rowCount > 0;
};
