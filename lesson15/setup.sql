-- ============================================
-- PostgreSQL Workshop - Database Schema Setup
-- ============================================
-- This script creates all tables needed for the movie database
-- Run this BEFORE running seed-data.sql
--
-- Tables created:
-- - movies: Main movie information
-- - directors: Director information
-- - actors: Actor information
-- - genres: Genre categories
-- - reviews: User reviews for movies
-- - movie_directors: Links movies to directors (many-to-many)
-- - movie_actors: Links movies to actors with character info (many-to-many)
-- - movie_genres: Links movies to genres (many-to-many)

-- ============================================
-- Drop existing tables (for clean setup)
-- ============================================

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS movie_actors CASCADE;
DROP TABLE IF EXISTS movie_directors CASCADE;
DROP TABLE IF EXISTS movie_genres CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS actors CASCADE;
DROP TABLE IF EXISTS directors CASCADE;
DROP TABLE IF EXISTS genres CASCADE;

-- ============================================
-- Create Core Tables
-- ============================================

-- Movies table
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL CHECK (title <> ''),
  release_year INTEGER,
  duration_minutes INTEGER,
  box_office_millions DECIMAL(10,2),
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  description TEXT,
  watched BOOLEAN DEFAULT FALSE,
  watched_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Directors table
CREATE TABLE directors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL CHECK (name <> ''),
  birth_year INTEGER,
  nationality VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actors table
CREATE TABLE actors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL CHECK (name <> ''),
  birth_year INTEGER,
  nationality VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE CHECK (name <> ''),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Create Junction/Relationship Tables
-- ============================================

-- Movie-Director relationship (many-to-many)
CREATE TABLE movie_directors (
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  director_id INTEGER NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'director', -- e.g., 'director', 'co-director'
  PRIMARY KEY (movie_id, director_id)
);

-- Movie-Actor relationship (many-to-many)
CREATE TABLE movie_actors (
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  actor_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  character_name VARCHAR(255),
  billing_order INTEGER, -- 1 for lead, 2 for second, etc.
  PRIMARY KEY (movie_id, actor_id)
);

-- Movie-Genre relationship (many-to-many)
CREATE TABLE movie_genres (
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date DATE NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Create Indexes for Better Performance
-- ============================================

-- Indexes on foreign keys
CREATE INDEX idx_movie_directors_movie ON movie_directors(movie_id);
CREATE INDEX idx_movie_directors_director ON movie_directors(director_id);
CREATE INDEX idx_movie_actors_movie ON movie_actors(movie_id);
CREATE INDEX idx_movie_actors_actor ON movie_actors(actor_id);
CREATE INDEX idx_movie_genres_movie ON movie_genres(movie_id);
CREATE INDEX idx_movie_genres_genre ON movie_genres(genre_id);
CREATE INDEX idx_reviews_movie ON reviews(movie_id);

-- Indexes on commonly queried columns
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_release_year ON movies(release_year);
CREATE INDEX idx_movies_rating ON movies(rating);
CREATE INDEX idx_movies_watched ON movies(watched);
CREATE INDEX idx_directors_name ON directors(name);
CREATE INDEX idx_actors_name ON actors(name);

-- ============================================
-- Success Message
-- ============================================

SELECT 'Database schema created successfully!' AS status;
SELECT 'You can now run seed-data.sql to populate with sample data.' AS next_step;

