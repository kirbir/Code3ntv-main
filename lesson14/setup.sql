-- Database setup for lesson14 Movie API

-- Create the movies table
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255),
  release_year INTEGER,
  genre VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data
INSERT INTO movies (title, director, release_year, genre) VALUES
  ('The Shawshank Redemption', 'Frank Darabont', 1994, 'Drama'),
  ('The Godfather', 'Francis Ford Coppola', 1972, 'Crime'),
  ('The Dark Knight', 'Christopher Nolan', 2008, 'Action'),
  ('Pulp Fiction', 'Quentin Tarantino', 1994, 'Crime'),
  ('Forrest Gump', 'Robert Zemeckis', 1994, 'Drama');

-- Query to verify the data
SELECT * FROM movies;


