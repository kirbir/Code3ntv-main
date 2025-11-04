-- ============================================
-- PostgreSQL Homework - Music Database
-- ============================================
--
-- ⚠️ IMPORTANT: This homework has TWO PARTS
--
-- PART 1: Build Your Music Database (Can start right away)
--   - Create all tables from scratch
--   - Practice ALTER TABLE
--   - Basic single-table queries
--   - Create relationships and foreign keys (AFTER Session 0ct. 28)
--   - Practice basic JOINs (AFTER Session Oct. 28)
--
-- PART 2: Load Data & Advanced Queries (AFTER Session Oct. 28)
--   - Run homework-seed-data.sql to populate your database
--   - Practice complex multi-table queries
--   - Aggregates, GROUP BY with JOINs
--   - Real-world API scenarios
--
-- ⚠️ DO NOT RUN homework-seed-data.sql UNTIL YOU COMPLETE PART 1!
--
-- SETUP INSTRUCTIONS:
-- 1. Create a new database called 'music_homework'
-- 2. Work through PART 1 (Sections 1-3)
-- 3. After Session Oct. 28, complete PART 1 (Sections 4-5)
-- 4. Then run homework-seed-data.sql
-- 5. Complete PART 2 (Sections 6-10)
-- 6. Submit this completed file
--
-- ============================================

-- ============================================
-- PART 1: BUILD YOUR MUSIC DATABASE
-- ============================================
CREATE DATABASE music_homework;

-- ============================================
-- SECTION 1: Create Core Tables
-- ============================================

-- Exercise 1.1: Create the albums table
-- Create a table called 'albums' with the following columns:
-- - id: Auto-incrementing primary key
-- - title: Text up to 255 characters, required
-- - release_year: Whole number, required, must be between 1900 and 2030
-- - duration_minutes: Whole number, must be positive
-- - sales_millions: Decimal number with 2 decimal places, cannot be negative
-- - rating: Decimal number with 1 decimal place, must be between 0 and 10
-- - created_at: Timestamp, automatically set to current time when row is created
--
-- Hint: Use SERIAL for auto-increment, CHECK constraints for validations, DEFAULT for automatic values
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    release_year INT CHECK (release_year BETWEEN 1900 AND 2030),
    duration_minutes INT CHECK (release_year >= 0),
    sales_millions DECIMAL(12,2) CHECK(sales_millions >= 0),
    rating DECIMAL(3,1) CHECK(rating BETWEEN 0 AND 10),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Exercise 1.2: Create the artists table
-- Create a table called 'artists' with:
-- - id: Auto-incrementing primary key
-- - name: Text up to 255 characters, required
-- - birth_year: Whole number, must be between 1900 and 2020
-- - country: Text up to 100 characters, optional
-- - genre_specialty: Text up to 100 characters, optional
--
-- Hint: Similar structure to albums table
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    birth_year INT CHECK (birth_year BETWEEN 1900 AND 2020),
    country VARCHAR(100),
    genre_specialty VARCHAR(100)
);


-- Exercise 1.3: Create the songs table
-- Create a table called 'songs' with:
-- - id: Auto-incrementing primary key
-- - title: Text up to 255 characters, required
-- - duration_seconds: Whole number, must be positive
-- - track_number: Whole number, must be positive
-- - album_id: Whole number (optional for now, we'll link it to albums later)
CREATE TABLE songs (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    duration_seconds INT CHECK(duration_seconds >= 0),
    track_number INT CHECK(track_number >= 0),
    album_id INT
);


-- Exercise 1.4: Create the genres table
-- Create a table called 'genres' with:
-- - id: Auto-incrementing primary key
-- - name: Text up to 50 characters, required, must be unique (no duplicate genre names)
CREATE TABLE genres(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);


-- Exercise 1.5: Verify your tables
-- Write a query to list all tables you just created (should show: albums, artists, songs, genres)
--
-- Hint: Query information_schema.tables, filter by table_schema = 'public'
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


-- ============================================
-- SECTION 2: ALTER TABLE Practice
-- ============================================

-- Exercise 2.1: Add a column to albums
-- Add a column called 'label' to the albums table that can hold up to 150 characters of text
ALTER TABLE albums
ADD COLUMN label VARCHAR(150);


-- Exercise 2.2: Add a column with a default value
-- Add a column called 'is_explicit' to the albums table
-- This should be a true/false value that defaults to false
ALTER TABLE albums
ADD COLUMN IS_EXPLICIT BOOLEAN DEFAULT false;


-- Exercise 2.3: Add a column to artists
-- Add a column called 'is_active' to the artists table
-- This should be a true/false value that defaults to true
ALTER TABLE artists
ADD COLUMN is_active BOOLEAN DEFAULT true;


-- Exercise 2.4: Modify a column
-- The duration_seconds column in the songs table currently requires a value
-- Change it to allow NULL values (optional)
--
-- Hint: Use ALTER COLUMN with DROP NOT NULL
ALTER TABLE songs
ALTER COLUMN  duration_seconds DROP NOT NULL;


-- Exercise 2.5: Rename a column
-- Rename the 'label' column in the albums table to 'record_label'
ALTER TABLE albums
RENAME COLUMN label TO record_label;


-- ============================================
-- SECTION 3: Basic Single-Table Queries
-- ============================================
-- Note: These tables are empty for now, but write the queries anyway
-- They'll work once you load data in Part 2

-- Exercise 3.1: Select all albums
-- Retrieve all information about every album in the database
SELECT * FROM ALBUMS;


-- Exercise 3.2: Count total albums
-- How many albums are in the database?
SELECT COUNT(*) FROM ALBUMS;


-- Exercise 3.3: Filter albums by year
-- Find all albums released after 2010
-- Show the title and release year
-- Sort by newest first
SELECT title, release_year FROM albums
WHERE release_year >= 2010
ORDER BY release_year DESC;



-- Exercise 3.4: High-rated albums
-- Find all albums with a rating of 8.0 or higher
-- Show the title, rating, and release year
-- Sort by highest rating first
SELECT rating, title, release_year FROM ALBUMS
WHERE rating >= 8.0
ORDER BY rating DESC;



-- Exercise 3.5: Albums from a specific decade
-- Find all albums released in the 2010s (2010-2019)
-- Show the title, release year, and rating
SELECT title,release_year, rating FROM albums
WHERE release_year BETWEEN 2010 AND 2019;



-- Exercise 3.6: Top 10 best-selling albums
-- Find the 10 best-selling albums
-- Show the title, sales in millions, and release year
-- Sort by highest sales first
SELECT title, sales_millions, release_year FROM albums
ORDER BY sales_millions DESC
LIMIT 10;



-- Exercise 3.7: Average album rating
-- Calculate the average rating across all albums
-- Round the result to 2 decimal places
SELECT AVG(rating)::NUMERIC(3,2) FROM albums;


-- Exercise 3.8: Count albums by decade
-- Group albums by decade (1960s, 1970s, 1980s, etc.) and count how many are in each
-- Show the decade and count of albums
-- Sort by most recent decade first
SELECT 
    FLOOR(release_year / 10) * 10 AS decade,
    COUNT(*) AS album_count 
from albums
GROUP BY FLOOR(release_year / 10) * 10
ORDER BY decade DESC;




-- Exercise 3.9: Albums with specific keywords
-- Find all albums where the title contains the word 'Love' (case-insensitive)
SELECT title FROM ALBUMS
WHERE title ILIKE '%love%';


-- Exercise 3.10: Pagination
-- Get albums 11-20 when sorted by release year (newest first)
-- This is like showing "page 2" of results, with 10 albums per page
SELECT release_year, title FROM ALBUMS
ORDER BY release_year DESC
LIMIT 10
OFFSET 10;


-- ============================================
-- SECTION 4: Create Relationship Tables
-- ============================================
-- ⚠️ COMPLETE THIS SECTION AFTER SESSION OCT 28TH (JOINs session)

-- Exercise 4.1: Create the album_artists junction table
-- This table links albums and artists in a many-to-many relationship
--
-- Columns needed:
-- - album_id: Whole number, required
-- - artist_id: Whole number, required
-- - role: Text up to 50 characters, optional (examples: 'lead', 'featuring', 'producer')
--
-- Constraints:
-- - The combination of album_id and artist_id should be the primary key (no duplicate pairings)
-- - album_id must reference the id column in the albums table
-- - artist_id must reference the id column in the artists table
-- - When an album is deleted, automatically delete related rows in this table
-- - When an artist is deleted, automatically delete related rows in this table
--
-- Hint: Use composite PRIMARY KEY (album_id, artist_id), FOREIGN KEY with ON DELETE CASCADE
CREATE TABLE album_artists (
    album_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    role VARCHAR(50),
    PRIMARY KEY (album_id, artist_id),
    FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY(artist_id) REFERENCES artists(id) ON DELETE CASCADE
);


-- Exercise 4.2: Create the song_artists junction table
-- This table links songs and artists (useful for featuring artists on individual tracks)
--
-- Columns needed:
-- - song_id: Whole number, required
-- - artist_id: Whole number, required
-- - role: Text up to 50 characters, optional (examples: 'lead', 'featuring')
--
-- Constraints:
-- - The combination of song_id and artist_id should be the primary key
-- - song_id must reference the id column in the songs table with cascade delete
-- - artist_id must reference the id column in the artists table with cascade delete
--
-- Hint: Similar structure to album_artists table
CREATE TABLE song_artists (
    song_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    role VARCHAR(50),
    PRIMARY KEY (song_id, artist_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);


-- Exercise 4.3: Create the album_genres junction table
-- This table links albums and genres (an album can have multiple genres)
--
-- Columns needed:
-- - album_id: Whole number, required
-- - genre_id: Whole number, required
--
-- Constraints:
-- - The combination of album_id and genre_id should be the primary key
-- - album_id must reference albums table with cascade delete
-- - genre_id must reference genres table with cascade delete
CREATE TABLE album_genres(
    album_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    PRIMARY KEY (album_id, genre_id),
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);


-- Exercise 4.4: Create the reviews table
-- This table stores user reviews for albums (each album can have many reviews)
--
-- Columns needed:
-- - id: Auto-incrementing primary key
-- - album_id: Whole number, required
-- - reviewer_name: Text up to 255 characters, required
-- - rating: Whole number, required, must be between 1 and 5 stars
-- - review_text: Long text, optional
-- - review_date: Date, required, automatically set to today's date when review is created
-- - helpful_count: Whole number, default to 0, cannot be negative
--
-- Constraints:
-- - album_id must reference the albums table with cascade delete
--
-- Hint: Use TEXT for long text, DATE for dates, DEFAULT CURRENT_DATE for automatic date
CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    album_id INT NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    helpful_count INT DEFAULT 0 CHECK (helpful_count >= 0),
    FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE
);


-- Exercise 4.5: Add foreign key to songs table
-- Remember when we created the songs table, we added an album_id column but didn't link it yet?
-- Now add a foreign key constraint to link songs.album_id to the albums table
-- Name the constraint 'fk_songs_album'
-- When an album is deleted, automatically delete its songs
--
-- Hint: Use ALTER TABLE...ADD CONSTRAINT...FOREIGN KEY
ALTER TABLE songs
ADD CONSTRAINT fk_songs_album
FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE;


-- Exercise 4.6: Verify your schema
-- List all your tables to confirm you now have 8 tables total
-- Expected: albums, artists, songs, genres, album_artists, song_artists, album_genres, reviews

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


-- ============================================
-- SECTION 5: Practice Basic JOINs
-- ============================================
-- ⚠️ COMPLETE THIS SECTION AFTER JOINs SESSION Oct. 28
-- Note: These tables are still empty, but write the queries anyway

-- Exercise 5.1: Albums with their artists
-- Show each album's title along with its artist's name
-- You'll need to join three tables: albums, album_artists, and artists
   SELECT albums.title, artist.name
   FROM albums
   JOIN album_artists ON albums.id = album_artists.album_id
   JOIN artists ON album_artists.artist_id = artist.id;


-- Exercise 5.2: Songs with their album titles
-- Show each song's title along with the album title it belongs to
    SELECT songs.title, albums.title
    FROM songs
    JOIN albums ON songs.album_id = albums.id;


-- Exercise 5.3: Albums with their genres
-- Show each album's title along with its genre name
-- You'll need to join three tables
   SELECT albums.title, genres.name
   FROM albums
   JOIN album_genres ON albums.id = album_genres.album_id
   JOIN genres ON album_genres.genre_id = genres.id;


-- Exercise 5.4: Count albums per artist
-- For each artist, show their name and how many albums they have
-- Sort by the artists with the most albums first
SELECT artists.name, COUNT(*) as album_count
FROM artists
JOIN album_artists ON artists.id = album_artists.artist_id
GROUP BY artists.name
ORDER BY album_count DESC;


-- Exercise 5.5: Count songs per album
-- For each album, show the album title and how many songs it has
-- Include albums even if they don't have any songs yet
-- Group by album title
SELECT albums.title, COUNT(songs.id) as song_count
FROM albums
LEFT JOIN songs ON albums.id = songs.album_id
GROUP BY albums.title
ORDER BY song_count DESC;


-- ============================================
-- PART 2: LOAD DATA & ADVANCED QUERIES
-- ============================================
-- ⚠️ BEFORE STARTING PART 2:
-- Run homework-seed-data.sql to populate your database with sample data
-- This will add ~30 albums, 15 artists, 100+ songs, genres, and reviews

-- ============================================
-- SECTION 6: Verify Loaded Data
-- ============================================

-- Exercise 6.1: Count loaded albums
-- How many albums are now in the database? (Expected: ~30)
SELECT COUNT(*) FROM albums;


-- Exercise 6.2: Count loaded artists
-- How many artists are now in the database? (Expected: ~15)
SELECT COUNT(*) FROM artists;


-- Exercise 6.3: Count loaded songs
-- How many songs are now in the database? (Expected: ~50+)
SELECT COUNT(*) FROM songs;


-- Exercise 6.4: Verify highest-rated album
-- Which album has the highest rating? Show its title, rating, and release year
SELECT rating, title, release_year FROM albums
ORDER BY rating DESC
LIMIT 1;


-- Exercise 6.5: View sample data
-- Display 5 albums showing the album title, artist name, and genre name together
-- This verifies the relationships are working correctly
SELECT albums.title, artists.name AS artist_name, genres.name AS genre_name
FROM albums
JOIN album_artists ON albums.id = album_artists.album_id
JOIN artists ON album_artists.artist_id = artists.id
JOIN album_genres ON albums.id = album_genres.album_id
JOIN genres ON album_genres.genre_id = genres.id
LIMIT 5;

-- ============================================
-- SECTION 7: Multi-Table JOINs
-- ============================================

-- Exercise 7.1: Albums with complete information
-- Display the 10 most recent albums with all their details:
-- Album title, release year, rating, all artist names as one comma-separated string,
-- and all genre names as one comma-separated string
SELECT albums.title, albums.release_year, albums.rating,
    STRING_AGG(genres.name, ', ') AS all_genres,
    STRING_AGG(artists.name, ', ') AS all_artists
FROM albums
JOIN album_artists ON albums.id = album_artists.album_id
JOIN artists ON album_artists.artist_id = artists.id
JOIN album_genres ON albums.id = album_genres.album_id
JOIN genres ON album_genres.genre_id = genres.id
GROUP BY albums.id, albums.title, albums.release_year, albums.rating
ORDER BY release_year DESC
LIMIT 10;


-- Exercise 7.2: Artist discography
-- Find all albums by The Beatles (or another artist of your choice)
-- Show the artist name, album title, release year, and rating
-- Sort chronologically by release year
SELECT albums.title, albums.release_year, albums.rating, artists.name
FROM albums
JOIN album_artists ON albums.id = album_artists.album_id
JOIN artists ON album_artists.artist_id = artists.id

WHERE artists.name = 'The Beatles'
ORDER BY release_year ASC;



-- Exercise 7.3: Songs from an album
-- Display all songs from the album "Abbey Road" (or another album of your choice)
-- Show the song title, track number, and duration in seconds
-- Sort by track number
SELECT songs.title, songs.track_number, songs.duration_seconds
FROM songs
JOIN albums ON songs.album_id = albums.id
WHERE albums.title = 'Abbey Road'
ORDER BY songs.track_number ASC;


-- Exercise 7.4: Albums in a specific genre
-- Find all Rock albums (or another genre of your choice)
-- Display the album title, release year, artist name, and rating
-- Sort by highest rating first
SELECT albums.title, albums.release_year, albums.rating, artists.name
FROM ALBUMS
JOIN album_genres ON albums.id = album_genres.album_id
JOIN genres ON album_genres.genre_id = genres.id
JOIN album_artists ON albums.id = album_artists.album_id
JOIN artists ON album_artists.artist_id = album_artists.album_id
WHERE genres.name = 'Rock'
ORDER BY albums.rating DESC


-- Exercise 7.5: Artists who work in multiple genres
-- Which artists have albums in 2 or more different genres?
-- Show the artist name and count of distinct genres they work in
-- Sort by artists with the most genre diversity first
SELECT artists.name, COUNT(DISTINCT genres.id) AS genre_count
FROM artists
JOIN album_artists ON artists.id = album_artists.artist_id
JOIN albums ON album_artists.album_id = albums.id
JOIN album_genres ON albums.id = album_genres.album_id
JOIN genres ON album_genres.genre_id = genres.id
GROUP BY artists.id, artists.name
HAVING COUNT(DISTINCT genres.id) >= 2
ORDER BY genre_count DESC;


-- ============================================
-- SECTION 8: Aggregates with JOINs
-- ============================================

-- Exercise 8.1: Average rating by genre
-- For each genre, show the genre name, average album rating (2 decimals),
-- and count of albums in that genre
-- Sort by highest average rating first
SELECT 
    genres.name, 
    ROUND(AVG(albums.rating), 2) AS average_rating,
    COUNT(albums.id) AS album_count
FROM genres
JOIN album_genres ON genres.id = album_genres.genre_id
JOIN albums ON album_genres.album_id = albums.id
GROUP BY genres.id, genres.name
ORDER BY average_rating DESC;


-- Exercise 8.2: Most prolific artists
-- Find the 10 artists who have released the most albums
-- Show the artist name, how many albums they have, and their average album rating
-- Sort by most albums first
SELECT 
    artists.name,
    COUNT(albums.id) AS album_count,
    ROUND(AVG(albums.rating), 2) AS average_rating
FROM artists
JOIN album_artists ON artists.id = album_artists.artist_id
JOIN albums ON album_artists.album_id = albums.id
GROUP BY artists.id, artists.name
ORDER BY album_count DESC
LIMIT 10;


-- Exercise 8.3: Albums with review statistics
-- For albums that have reviews, show the album title, average review rating (2 decimals),
-- and count of reviews
-- Show the top 10 by average review rating
SELECT 
    albums.title,
    ROUND(AVG(reviews.rating), 2) AS average_review_rating,
    COUNT(reviews.id) AS review_count
FROM albums
JOIN reviews ON albums.id = reviews.album_id
GROUP BY albums.id, albums.title
ORDER BY average_review_rating DESC
LIMIT 10;


-- Exercise 8.4: Total sales by artist
-- Calculate the total sales across all albums for each artist
-- Show the artist name, total sales in millions, and number of albums
-- Sort by highest total sales first
SELECT 
    artists.name,
    SUM(albums.sales_millions) AS total_sales,
    COUNT(albums.id) AS album_count
FROM artists
JOIN album_artists ON artists.id = album_artists.artist_id
JOIN albums ON album_artists.album_id = albums.id
GROUP BY artists.id, artists.name
ORDER BY total_sales DESC;


-- Exercise 8.5: Decade analysis
-- For each decade (1960s, 1970s, etc.), calculate:
-- The decade, count of albums released, average rating, and total sales
-- Sort by most recent decade first
SELECT 
    FLOOR(release_year / 10) * 10 AS decade,
    COUNT(*) AS album_count,
    ROUND(AVG(rating), 2) AS average_rating,
    SUM(sales_millions) AS total_sales
FROM albums
GROUP BY FLOOR(release_year / 10) * 10
ORDER BY decade DESC;


-- ============================================
-- SECTION 9: Complex Queries
-- ============================================

-- Exercise 9.1: High-rated albums with many songs
-- Find albums that have both a high rating (8.0 or higher) AND at least 10 songs
-- Show the album title, rating, song count, and artist name
-- Sort by highest rating first
SELECT 
    albums.title,
    albums.rating,
    COUNT(songs.id) AS song_count,
    artists.name AS artist_name
FROM albums
JOIN songs ON albums.id = songs.album_id
JOIN album_artists ON albums.id = album_artists.album_id
JOIN artists ON album_artists.artist_id = artists.id
WHERE albums.rating >= 8.0
GROUP BY albums.id, albums.title, albums.rating, artists.name
HAVING COUNT(songs.id) >= 10
ORDER BY albums.rating DESC;


-- Exercise 9.2: Artists with no albums in certain genres
-- Find all artists who have never released a Pop album (or choose another genre)
-- Show just the artist names
SELECT artists.name
FROM artists
WHERE artists.id NOT IN (
    SELECT DISTINCT album_artists.artist_id
    FROM album_artists
    JOIN album_genres ON album_artists.album_id = album_genres.album_id
    JOIN genres ON album_genres.genre_id = genres.id
    WHERE genres.name = 'Pop'
);


-- Exercise 9.3: Albums with above-average ratings
-- Find all albums that have a rating higher than the average across all albums
-- Show the title, rating, and how much higher it is than average (as "difference")
-- Sort by highest rating first
SELECT 
    title,
    rating,
    ROUND(rating - (SELECT AVG(rating) FROM albums), 2) AS difference
FROM albums
WHERE rating > (SELECT AVG(rating) FROM albums)
ORDER BY rating DESC;


-- Exercise 9.4: Most reviewed albums
-- Which albums have received the most reviews?
-- Show the album title, count of reviews, and average review rating
-- Show the top 10
SELECT 
    albums.title,
    COUNT(reviews.id) AS review_count,
    ROUND(AVG(reviews.rating), 2) AS average_review_rating
FROM albums
JOIN reviews ON albums.id = reviews.album_id
GROUP BY albums.id, albums.title
ORDER BY review_count DESC
LIMIT 10;


-- Exercise 9.5: Genre popularity by decade
-- For albums released in the 2010s (2010-2019), which genre was most popular?
-- Show the genre name, count of albums, and average rating
-- Sort by most albums first
SELECT 
    genres.name,
    COUNT(albums.id) AS album_count,
    ROUND(AVG(albums.rating), 2) AS average_rating
FROM genres
JOIN album_genres ON genres.id = album_genres.genre_id
JOIN albums ON album_genres.album_id = albums.id
WHERE albums.release_year BETWEEN 2010 AND 2019
GROUP BY genres.id, genres.name
ORDER BY album_count DESC;


-- ============================================
-- SECTION 10: Practical API Scenarios
-- ============================================

-- Exercise 10.1: GET /albums endpoint
-- Simulate an API endpoint: GET /albums?genre=Rock&minRating=8.0&limit=10
-- Return the top 10 Rock albums with rating 8.0 or higher
-- Show: album id, title, rating, release_year
-- Sort by highest rating first
SELECT 
    albums.id,
    albums.title,
    albums.rating,
    albums.release_year
FROM albums
JOIN album_genres ON albums.id = album_genres.album_id
JOIN genres ON album_genres.genre_id = genres.id
WHERE genres.name = 'Rock'
  AND albums.rating >= 8.0
ORDER BY albums.rating DESC
LIMIT 10;


-- Exercise 10.2: GET /albums/:id with full details
-- Simulate an API endpoint that returns complete album details
-- Pick any album from your database and show:
-- All album information (title, year, rating, sales, etc.) PLUS
-- a comma-separated list of artist names, a comma-separated list of genres,
-- a comma-separated list of song titles, the count of reviews, and average review rating
SELECT 
    albums.id,
    albums.title,
    albums.release_year,
    albums.duration_minutes,
    albums.sales_millions,
    albums.rating,
    albums.record_label,
    albums.is_explicit,
    STRING_AGG(DISTINCT artists.name, ', ') AS artists,
    STRING_AGG(DISTINCT genres.name, ', ') AS genres,
    STRING_AGG(DISTINCT songs.title, ', ') AS songs,
    COUNT(DISTINCT reviews.id) AS review_count,
    ROUND(AVG(reviews.rating), 2) AS average_review_rating
FROM albums
LEFT JOIN album_artists ON albums.id = album_artists.album_id
LEFT JOIN artists ON album_artists.artist_id = artists.id
LEFT JOIN album_genres ON albums.id = album_genres.album_id
LEFT JOIN genres ON album_genres.genre_id = genres.id
LEFT JOIN songs ON albums.id = songs.album_id
LEFT JOIN reviews ON albums.id = reviews.album_id
WHERE albums.title = 'Abbey Road'  -- Pick any album title
GROUP BY albums.id, albums.title, albums.release_year, albums.duration_minutes, 
         albums.sales_millions, albums.rating, albums.record_label, albums.is_explicit;


-- Exercise 10.3: GET /artists/:id/albums
-- Simulate an API endpoint that returns all albums by a specific artist
-- Pick any artist from your database and show all their albums with:
-- Album title, release year, rating, sales in millions, and genres (comma-separated)
-- Sort by most recent first



-- Exercise 10.4: Search functionality
-- Simulate a search feature: find all albums, artists, or songs with "Love" in the name
-- Return results from all three types combined
-- Show what type it is ('album', 'artist', or 'song') and the name
-- Include some related information for context



-- Exercise 10.5: Top genres by average rating
-- Find high-quality genres that have both:
-- - An average album rating above 7.5
-- - At least 3 albums in that genre
-- Show the genre name, average rating, and album count
-- Sort by highest average rating first



-- ============================================
-- End of Homework
-- ============================================