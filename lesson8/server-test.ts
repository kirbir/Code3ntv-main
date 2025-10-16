import { beforeEach, describe, expect, it } from "vitest";
import request from 'supertest';
import { saveMoviesAsync, loadMoviesPaginatedAsync, filePathUrl, Movies } from './movies';
import { app } from './server';

const goodFellasId = "123e4567-e89b-12d3-a456-426614174005";

const fakeMovies: Movies[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "The Matrix",
    year: 1999,
    watched: false
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    title: "Inception",
    year: 2010,
    watched: true
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    title: "Pulp Fiction",
    year: 1994,
    watched: false
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174003",
    title: "The Dark Knight",
    year: 2008,
    watched: true
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174004",
    title: "Fight Club",
    year: 1999,
    watched: false
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174005",
    title: "Goodfellas",
    year: 1990,
    watched: true
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174006",
    title: "The Shawshank Redemption",
    year: 1994,
    watched: false
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174007",
    title: "Forrest Gump",
    year: 1994,
    watched: true
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174008",
    title: "The Godfather",
    year: 1972,
    watched: false
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174009",
    title: "Interstellar",
    year: 2014,
    watched: true
  }
];

beforeEach(async () => {
  await saveMoviesAsync(filePathUrl, fakeMovies);
})

describe('GET /movies', () => {
  it('Should return 200 OK and a list of movies', async () => {
    await saveMoviesAsync(filePathUrl, []);
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

  });
});

describe('GET /movies:id', () => {
  it('Should return 200 and a movie matching the ID in the parameter.', async () => {
    const respsone = await request(app).get(`/movies/${goodFellasId}`);
    expect(respsone.body.id).toBe(goodFellasId);
  });
});

describe('POST /movies', async () => {
  it('should persist the newly created movie to the database', async () => {
    const title = 'Saving Private Ryan';
    const response = await request(app).post('/movies').send({
      title: title, year: 1998
    });
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe(title);
    const id = response.body.data.id;

    const movies = await loadMoviesPaginatedAsync(filePathUrl, undefined, undefined);
    const movie = movies.find((movie) => movie.id === id);
    expect(movie?.title).toBe(title);
    expect(movie?.id).toBe(id);
  });
});