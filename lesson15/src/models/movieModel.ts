import db from "../config/db.js";

export interface Movie {
  id: number;
  title: string;
  release_year?: number;
  duration_minutes?: number;
  box_office_millions?: number;
  rating?: number;
  description?: string;
  watched?: boolean;
  watched_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  const movies = await db.any("SELECT * FROM movies");
  return movies.map((movie: any) => ({
    ...movie,
    rating: movie.rating ? parseFloat(movie.rating) : null,
    box_office_millions: movie.box_office_millions
      ? parseFloat(movie.box_office_millions)
      : null,
  }));
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  const movie = await db.oneOrNone("SELECT * FROM movies WHERE id = $1", [id]);
  if (!movie) return null;
  return {
    ...movie,
    rating: movie.rating ? parseFloat(movie.rating) : null,
    box_office_millions: movie.box_office_millions
      ? parseFloat(movie.box_office_millions)
      : null,
  };
};

export const createMovie = async (movie: Partial<Movie>): Promise<Movie> => {
  const result = await db.one(
    `INSERT INTO movies(
      title, 
      release_year, 
      duration_minutes, 
      box_office_millions, 
      rating, 
      description, 
      watched, 
      watched_date
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      movie.title,
      movie.release_year,
      movie.duration_minutes,
      movie.box_office_millions,
      movie.rating,
      movie.description,
      movie.watched || false,
      movie.watched_date || null,
    ]
  );
  return {
    ...result,
    rating: result.rating ? parseFloat(result.rating) : null,
    box_office_millions: result.box_office_millions
      ? parseFloat(result.box_office_millions)
      : null,
  };
};

export const updateMovie = async (
  id: number,
  movie: Partial<Movie>
): Promise<Movie | null> => {
  const result = await db.oneOrNone(
    `UPDATE movies SET 
      title = $1, 
      release_year = $2, 
      duration_minutes = $3, 
      box_office_millions = $4,
      rating = $5,
      description = $6,
      watched = $7,
      watched_date = $8
    WHERE id = $9 RETURNING *`,
    [
      movie.title,
      movie.release_year,
      movie.duration_minutes,
      movie.box_office_millions,
      movie.rating,
      movie.description,
      movie.watched,
      movie.watched_date,
      id,
    ]
  );
  if (!result) return null;
  return {
    ...result,
    rating: result.rating ? parseFloat(result.rating) : null,
    box_office_millions: result.box_office_millions
      ? parseFloat(result.box_office_millions)
      : null,
  };
};

export const deleteMovie = async (id: number): Promise<boolean> => {
  const result = await db.result("DELETE FROM movies WHERE id = $1", [id]);
  return result.rowCount > 0;
};
