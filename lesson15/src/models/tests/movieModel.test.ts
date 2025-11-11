// tests/movieModel.test.ts
import db from '../../config/db.js';
import {
  Movie,
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../movieModel.js';
import { beforeEach, afterAll, test, expect, describe } from 'vitest';

beforeEach(async () => {
  await db.none('TRUNCATE movies RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await db.none('DELETE FROM movies');
  await db.$pool.end();
});

describe('getAllMovies', () => {
  test('returns empty array when no movies exist', async () => {
    const movies = await getAllMovies();
    expect(movies).toEqual([]);
  });

  test('returns all movies from database', async () => {
    // Create test movies
    await createMovie({
      title: 'The Matrix',
      release_year: 1999,
      duration_minutes: 136,
      rating: 8.7,
      description: 'A computer hacker learns about the true nature of reality.',
      watched: true,
    });
    await createMovie({
      title: 'Inception',
      release_year: 2010,
      duration_minutes: 148,
      rating: 8.8,
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      watched: false,
    });

    const movies = await getAllMovies();
    expect(movies).toHaveLength(2);
    expect(movies[0].title).toBe('The Matrix');
    expect(movies[1].title).toBe('Inception');
  });
});

describe('getMovieById', () => {
  test('returns movie when it exists', async () => {
    const created = await createMovie({
      title: 'The Matrix',
      release_year: 1999,
      duration_minutes: 136,
      box_office_millions: 467.2,
      rating: 8.7,
      description: 'A computer hacker learns about the true nature of reality.',
      watched: true,
    });

    const movie = await getMovieById(created.id);
    expect(movie).toBeDefined();
    expect(movie?.title).toBe('The Matrix');
    expect(movie?.release_year).toBe(1999);
    expect(movie?.duration_minutes).toBe(136);
    expect(movie?.rating).toBe(8.7);
    expect(movie?.watched).toBe(true);
  });

  test('returns null when movie does not exist', async () => {
    const movie = await getMovieById(9999);
    expect(movie).toBeNull();
  });
});

describe('createMovie', () => {
  test('creates a new movie with all fields', async () => {
    const newMovie: Partial<Movie> = {
      title: 'The Matrix',
      release_year: 1999,
      duration_minutes: 136,
      box_office_millions: 467.2,
      rating: 8.7,
      description: 'A computer hacker learns about the true nature of reality.',
      watched: true,
      watched_date: new Date('2000-03-31'),
    };

    const created = await createMovie(newMovie);
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.title).toBe('The Matrix');
    expect(created.release_year).toBe(1999);
    expect(created.duration_minutes).toBe(136);
    expect(created.box_office_millions).toBe(467.2);
    expect(created.rating).toBe(8.7);
    expect(created.watched).toBe(true);
  });

  test('creates a new movie with only required fields', async () => {
    const newMovie: Partial<Movie> = {
      title: 'Simple Movie',
      release_year: 2024, // Required field in the database
    };

    const created = await createMovie(newMovie);
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Simple Movie');
    expect(created.release_year).toBe(2024);
    expect(created.duration_minutes).toBeNull();
    expect(created.rating).toBeNull();
    expect(created.watched).toBe(false); // Default value
  });

  test('throws error when title is empty string', async () => {
    const movieEmptyTitle: Partial<Movie> = {
      title: '',
    };

    await expect(createMovie(movieEmptyTitle)).rejects.toThrow();
  });

  test('throws error when title is null', async () => {
    const movieNullTitle: Partial<Movie> = {
      title: undefined,
    };

    await expect(createMovie(movieNullTitle)).rejects.toThrow();
  });

  test('validates rating is within bounds', async () => {
    const movieWithInvalidRating: Partial<Movie> = {
      title: 'Bad Rating Movie',
      rating: 11, // Should fail (max is 10)
    };

    await expect(createMovie(movieWithInvalidRating)).rejects.toThrow();
  });
});

describe('updateMovie', () => {
  test('updates an existing movie', async () => {
    const created = await createMovie({
      title: 'Original Title',
      release_year: 2000,
      duration_minutes: 120,
      rating: 7.5,
      description: 'Original description',
      watched: false,
    });

    const updated = await updateMovie(created.id, {
      title: 'Updated Title',
      release_year: 2001,
      duration_minutes: 130,
      rating: 8.0,
      description: 'Updated description',
      watched: true,
      box_office_millions: 100.5,
      watched_date: new Date('2024-01-01'),
    });

    expect(updated).toBeDefined();
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.release_year).toBe(2001);
    expect(updated?.duration_minutes).toBe(130);
    expect(updated?.rating).toBe(8.0);
    expect(updated?.watched).toBe(true);
  });

  test('returns null when updating non-existent movie', async () => {
    const updated = await updateMovie(9999, {
      title: 'Updated Title',
      release_year: 2024,
      duration_minutes: 120,
      rating: 8.0,
      description: 'Test',
      watched: false,
    });

    expect(updated).toBeNull();
  });

  test('can update partial fields', async () => {
    const created = await createMovie({
      title: 'Original Title',
      release_year: 2000,
      duration_minutes: 120,
      rating: 7.5,
      description: 'Original description',
      watched: false,
    });

    const updated = await updateMovie(created.id, {
      title: 'Updated Title',
      release_year: created.release_year,
      duration_minutes: created.duration_minutes,
      rating: created.rating,
      description: created.description,
      watched: created.watched,
    });

    expect(updated?.title).toBe('Updated Title');
    expect(updated?.release_year).toBe(2000);
    expect(updated?.duration_minutes).toBe(120);
  });

  test('can mark a movie as watched', async () => {
    const created = await createMovie({
      title: 'Unwatched Movie',
      release_year: 2023,
      watched: false,
    });

    const updated = await updateMovie(created.id, {
      title: created.title,
      release_year: created.release_year,
      watched: true,
      watched_date: new Date('2024-11-11'),
    });

    expect(updated?.watched).toBe(true);
    expect(updated?.watched_date).toBeDefined();
  });
});

describe('deleteMovie', () => {
  test('deletes an existing movie', async () => {
    const created = await createMovie({
      title: 'Movie to Delete',
      release_year: 2020,
      duration_minutes: 90,
      rating: 6.5,
    });

    const result = await deleteMovie(created.id);
    expect(result).toBe(true);

    const deleted = await getMovieById(created.id);
    expect(deleted).toBeNull();
  });

  test('returns false when deleting non-existent movie', async () => {
    const result = await deleteMovie(9999);
    expect(result).toBe(false);
  });

  test('can delete and recreate movie with same data', async () => {
    const movieData: Partial<Movie> = {
      title: 'Recyclable Movie',
      release_year: 2020,
      duration_minutes: 100,
      rating: 7.0,
      description: 'A movie that can be deleted and recreated',
    };

    const first = await createMovie(movieData);
    await deleteMovie(first.id);

    const second = await createMovie(movieData);
    expect(second).toBeDefined();
    expect(second.title).toBe(movieData.title);
    expect(second.release_year).toBe(movieData.release_year);
  });
});

