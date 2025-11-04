-- ============================================
-- PostgreSQL Workshop - Today's Practice Exercises
-- ============================================
-- Work through these exercises during today's workshop
-- Focus: SQL Fundamentals (CRUD operations, WHERE, aggregates, GROUP BY)
-- Note: JOINs will be covered in the next session!

-- ============================================
-- SECTION 1: WARM-UP (Basic SELECT)
-- ============================================

-- Exercise 1.1: View all movies
-- Write a query to see all data in the movies table
SELECT * FROM movies;


-- Exercise 1.2: View all directors
-- Select all columns from the directors table
SELECT * FROM directors;


-- Exercise 1.3: Count total actors
-- Use COUNT to find how many actors are in the database
SELECT COUNT(*) FROM ACTORS;

-- Exercise 1.4: Preview actors
-- Select just the name and nationality columns from actors
-- Limit to first 10 rows
SELECT (nationality, name) FROM ACTORS;

-- ============================================
-- SECTION 2: CREATE TABLE
-- ============================================

-- Exercise 2.1: Create a simple table
-- Create a table called 'streaming_services' with:
-- - id (SERIAL PRIMARY KEY)
-- - name (VARCHAR(100) NOT NULL)
-- - monthly_price (DECIMAL(5,2))
-- - launch_year (INTEGER)

CREATE TABLE streaming_services (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	monthly_price DECIMAL(5,2),
	launch_yeah INTEGER
);

-- Exercise 2.2: Create a table with constraints
-- Create a table called 'awards' with:
-- - id (SERIAL PRIMARY KEY)
-- - name (VARCHAR(150) NOT NULL)
-- - year (INTEGER CHECK year >= 1900)
-- - category (VARCHAR(100))
CREATE TABLE awards (
	id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	year INT CHECK (year >= 1900),
	category VARCHAR(100)
);

-- Exercise 2.3: Create a junction table
-- Create a table called 'movie_streaming' to link movies to streaming services:
-- - movie_id (INTEGER)
-- - service_id (INTEGER)
-- - available_date (DATE)
-- - PRIMARY KEY should be (movie_id, service_id)
-- Note: We'll add foreign keys later
CREATE TABLE movie_streaming (
    movie_id INT,
    service_id INT,
	available_date DATE,
	PRIMARY KEY(movie_id, service_id)
);

-- ============================================
-- SECTION 3: INSERT - Adding Data
-- ============================================

-- Exercise 3.1: Insert a single movie
-- Add a new movie with these details:
-- title: 'The Matrix Reloaded'
-- release_year: 2003
-- duration_minutes: 138
-- box_office_millions: 742.1
-- rating: 7.2
-- watched: FALSE
INSERT INTO movies (title,release_year,duration_minutes,box_office_millions,rating,watched) VALUES('The Matrix Reloaded', 2003, 138, 742.1, 7.2, false);

SELECT * FROM movies 
WHERE title = 'The Matrix Reloaded';
-- Exercise 3.2: Insert a director
-- Add director: 'Denis Villeneuve', birth_year: 1967, nationality: 'Canadian'
INSERT INTO directors (name, birth_year, nationality) VALUES('Dennis Villeneuve', 1967, 'Canadian');

-- Exercise 3.3: Insert an actor
-- Add actor: 'Timothée Chalamet', birth_year: 1995, nationality: 'American'
INSERT INTO actors (name, birth_year, nationality) VALUES('Timothée Chalamet', 1995, 'American');


-- Exercise 3.4: Insert a genre
-- Add a new genre called 'Horror'


-- Exercise 3.5: Insert multiple movies at once
-- Add these three movies in a single INSERT statement:
-- 1. 'Blade Runner 2049', 2017, 164 min, 267.7M box office, rating 8.0
-- 2. 'Arrival', 2016, 116 min, 203.4M box office, rating 7.9
-- 3. 'Sicario', 2015, 121 min, 84.9M box office, rating 7.6
-- Set watched = FALSE for all


-- Exercise 3.6: Insert with specific columns
-- Insert a new movie but only provide:
-- title: 'Test Movie', release_year: 2024, watched: FALSE
-- Let other columns use their defaults or be NULL


-- Exercise 3.7: Insert a review
-- Add a review for movie_id = 1:
-- reviewer_name: 'Your Name'
-- rating: 5
-- review_text: 'Amazing movie! A perfect conclusion.'
-- review_date: use CURRENT_DATE


-- Exercise 3.8: Insert into junction table
-- Link movie_id 1 (Avengers: Endgame) to genre_id 3 (Comedy)
-- Note: This is just for practice, Endgame isn't really a comedy!
-- Insert into movie_genres table


-- ============================================
-- SECTION 4: UPDATE - Modifying Data
-- ============================================

-- Exercise 4.1: Mark a movie as watched
-- Update the movie 'Dunkirk' to set watched = TRUE
-- and watched_date = '2024-01-15'
-- Hint: Use WHERE title = 'Dunkirk'


-- Exercise 4.2: Update a movie rating
-- Change the rating of 'Barbie' to 7.2
-- Hint: Find it by title


-- Exercise 4.3: Update box office earnings
-- The box office for 'Dune' increased to 450 million
-- Update the box_office_millions for this movie


-- Exercise 4.4: Update multiple rows
-- Mark ALL movies from 1994 as watched with watched_date = '2020-06-01'


-- Exercise 4.5: Update with calculation
-- Increase the rating of 'Forrest Gump' by 0.1
-- Hint: SET rating = rating + 0.1


-- Exercise 4.6: Update a director's information
-- Update Steven Spielberg's birth year to 1947 (if it's currently 1946)


-- Exercise 4.7: Update multiple columns at once
-- For the movie 'Test Movie' (that you inserted earlier):
-- Set duration_minutes = 120, rating = 6.5, and description = 'A test movie for practice'


-- Exercise 4.8: Update with WHERE and multiple conditions
-- For all movies released after 2020 with rating above 8.0:
-- Set watched = TRUE


-- ============================================
-- SECTION 5: DELETE - Removing Data
-- ============================================

-- ⚠️ WARNING: Always use WHERE clause with DELETE!
-- Without WHERE, you delete ALL rows!

-- Exercise 5.1: Delete a specific review
-- Delete the review you created earlier (the one with your name)
-- Hint: WHERE reviewer_name = 'Your Name'


-- Exercise 5.2: Delete the test movie
-- Delete the movie with title 'Test Movie'


-- Exercise 5.3: Delete old reviews
-- Delete all reviews from before 2010
-- Hint: WHERE review_date < '2010-01-01'


-- Exercise 5.4: Delete movies with low box office
-- Delete movies that made less than 30 million at box office
-- Hint: Only 'The Shawshank Redemption' matches this (made 28.3M)


-- Exercise 5.5: Delete a genre
-- Delete the 'Horror' genre you created earlier


-- Exercise 5.6: DANGEROUS - Don't actually run this!
-- Write (but DON'T execute) a query that would delete ALL movies
-- This is to understand the danger of DELETE without WHERE
-- Comment it out with /* */
/*


*/


-- ============================================
-- SECTION 6: ALTER TABLE - Modifying Structure
-- ============================================

-- Exercise 6.1: Add a new column
-- Add a column called 'imdb_id' (VARCHAR(20)) to the movies table


-- Exercise 6.2: Add a column with default value
-- Add a column 'is_available' (BOOLEAN) to movies with DEFAULT TRUE


-- Exercise 6.3: Drop a column
-- Remove the 'imdb_id' column you just added from movies table


-- Exercise 6.4: Add a constraint
-- Add a CHECK constraint to movies table ensuring rating is between 0 and 10
-- Hint: ALTER TABLE movies ADD CONSTRAINT ...


-- Exercise 6.5: Rename a column
-- Rename the streaming_services 'monthly_price' column to 'subscription_price'


-- ============================================
-- SECTION 7: WHERE CLAUSES - Deep Dive
-- ============================================

-- Exercise 7.1: Movies from the 21st century
-- Find all movies released in 2000 or later
-- Show: title, release_year
-- Order by release_year


-- Exercise 7.2: High-rated films
-- Find movies with rating of 8.0 or higher
-- Show: title, rating
-- Order by rating (highest first)


-- Exercise 7.3: Short movies
-- Find movies that are less than 120 minutes long
-- Show: title, duration_minutes


-- Exercise 7.4: Box office range
-- Find movies that made between 200 and 600 million dollars
-- Show: title, box_office_millions
-- Order by box office


-- Exercise 7.5: Specific years
-- Find movies released in 2008, 2014, or 2018
-- Show: title, release_year


-- Exercise 7.6: Title pattern search
-- Find all movies that have the word "The" at the start of their title
-- Show: title
-- Hint: Use LIKE 'The%'


-- Exercise 7.7: Find unwatched movies
-- Find all movies where watched is FALSE
-- Show: title, rating
-- Order by rating (highest first)


-- Exercise 7.8: NULL watched dates
-- Find movies where watched_date IS NULL
-- Show: title, watched


-- Exercise 7.9: High-rated recent films
-- Find movies released in 2015 or later with rating above 7.5
-- Show: title, release_year, rating
-- Order by release_year DESC


-- Exercise 7.10: Complex conditions
-- Find movies that are either:
-- - High-rated (rating > 8.5) OR
-- - Blockbusters (box_office > 1000 million)
-- AND were released after 2010
-- Show: title, release_year, rating, box_office_millions


-- Exercise 7.11: Pattern matching - Contains
-- Find all movies with "Man" anywhere in the title
-- Show: title


-- Exercise 7.12: NOT operator
-- Find all movies NOT released in the 1990s (1990-1999)
-- Show: title, release_year


-- ============================================
-- SECTION 8: ORDER BY & LIMIT
-- ============================================

-- Exercise 8.1: Sort by box office
-- Get all movies sorted by box office earnings (highest first)
-- Show: title, box_office_millions
SELECT title, box_office_millions
FROM movies
ORDER BY box_office_millions DESC;


-- Exercise 8.2: Oldest movies first
-- Get all movies sorted by release year (oldest first)
-- Show: title, release_year
SELECT title, release_year
FROM movies
ORDER BY release_year ASC;


-- Exercise 8.3: Multi-column sort
-- Sort movies by release year (newest first), then by rating (highest first)
-- Show: title, release_year, rating
SELECT title, release_year, rating
FROM movies
ORDER BY release_year DESC, rating DESC;


-- Exercise 8.4: Top 5 rated movies
-- Get the 5 highest-rated movies
-- Show: title, rating
SELECT title, rating
FROM movies
ORDER BY rating DESC
LIMIT 5;


-- Exercise 8.5: Top 10 earners
-- Get the 10 highest-grossing movies
-- Show: title, box_office_millions
SELECT title, box_office_millions
FROM movies
ORDER BY box_office_millions DESC
LIMIT 10;


-- Exercise 8.6: Pagination - Page 1
-- Get the first 5 movies sorted by title alphabetically
-- Show: title
SELECT title
FROM movies
ORDER BY title ASC
LIMIT 5;


-- Exercise 8.7: Pagination - Page 3
-- Get movies 11-15 when sorted by title alphabetically (page 3, 5 per page)
-- Show: title
-- Hint: Use LIMIT 5 OFFSET 10
SELECT title
FROM movies
ORDER BY title ASC
LIMIT 5
OFFSET 10;


-- Exercise 8.8: Recently watched
-- Get the 5 most recently watched movies
-- Show: title, watched_date
-- Hint: Filter for watched_date IS NOT NULL first
SELECT title, watched_date
FROM movies
WHERE watched_date IS NOT NULL
ORDER BY watched_date DESC
LIMIT 5;


-- ============================================
-- SECTION 9: AGGREGATE FUNCTIONS
-- ============================================

-- Exercise 9.1: Total movies
-- Count how many movies are in the database


-- Exercise 9.2: Count unwatched
-- Count how many movies have NOT been watched


-- Exercise 9.3: Average movie rating
-- Calculate the average rating of all movies
-- Round to 2 decimal places


-- Exercise 9.4: Total box office
-- Calculate the total box office earnings of all movies combined


-- Exercise 9.5: Longest and shortest
-- Find the maximum and minimum duration_minutes in one query
-- Show both as separate columns


-- Exercise 9.6: Average duration
-- Calculate the average movie duration
-- Round to 0 decimal places (whole number)


-- Exercise 9.7: Count distinct years
-- Count how many different release years appear in the movies table


-- Exercise 9.8: Multiple aggregates
-- In one query, show:
-- - Total count of movies
-- - Average rating (rounded to 2 decimals)
-- - Total box office
-- - Oldest release year
-- - Newest release year


-- Exercise 9.9: Conditional count
-- Count how many movies have a rating above 8.5


-- Exercise 9.10: Average of recent movies
-- Calculate the average rating of movies released in 2020 or later


-- ============================================
-- SECTION 10: GROUP BY & HAVING
-- ============================================

-- Exercise 10.1: Count movies per year
-- Group movies by release_year and count them
-- Show: release_year, count
-- Order by year (newest first)


-- Exercise 10.2: Average rating per year
-- Group by release_year and calculate average rating
-- Show: release_year, average_rating (rounded to 2 decimals), movie_count
-- Order by average rating (highest first)


-- Exercise 10.3: Box office by year
-- Group by release_year and sum the total box office
-- Show: release_year, total_box_office
-- Order by total box office (highest first)


-- Exercise 10.4: Group by decade
-- Group movies by decade and count them
-- Show: decade, movie_count
-- Hint: Use FLOOR(release_year / 10) * 10 AS decade
-- Order by decade (newest first)


-- Exercise 10.5: Statistics by watched status
-- Group by watched status and show count and average rating
-- Show: watched, count, average_rating (rounded to 2 decimals)


-- Exercise 10.6: Average box office by decade
-- Group by decade and calculate average box office earnings
-- Show: decade, average_box_office (rounded to 2 decimals), movie_count
-- Order by decade DESC


-- Exercise 10.7: Productive years (HAVING)
-- Find years that had 3 or more movies released
-- Show: release_year, movie_count
-- Order by movie_count (highest first)


-- Exercise 10.8: High-performing years (HAVING)
-- Find years where the average rating was above 8.0
-- Show: release_year, average_rating (rounded to 2 decimals), movie_count
-- Order by average rating DESC


-- Exercise 10.9: Blockbuster decades (HAVING)
-- Find decades where total box office exceeded 5000 million
-- Show: decade, total_box_office, movie_count
-- Order by total box office DESC


-- Exercise 10.10: Combined WHERE and HAVING
-- For movies released after 2000:
-- - Group by release_year
-- - Show years where average rating > 7.5
-- - Show: release_year, average_rating, movie_count
-- - Order by year DESC


-- ============================================
-- SECTION 11: PUTTING IT ALL TOGETHER
-- ============================================

-- Challenge 11.1: Data cleanup
-- Write queries to:
-- a) Find all movies with NULL description
-- b) Update those movies to set description = 'No description available'
-- c) Verify the update worked


-- Challenge 11.2: Create a test dataset
-- a) CREATE a table called 'directors_backup'
-- b) INSERT the top 5 directors (by movie count) into it
-- Note: You'll need to manually insert since we haven't learned subqueries yet
-- c) SELECT all from the backup table to verify


-- Challenge 11.3: Rating adjustment
-- Some ratings might need adjustment:
-- a) Find all movies with rating < 7.0
-- b) Increase ratings for all movies from 2023 by 0.2
-- c) Show the updated ratings


-- Challenge 11.4: Report generation
-- Create a "box office report" showing:
-- - Decade
-- - Number of movies
-- - Total box office
-- - Average box office per movie
-- - Highest-grossing movie of that decade (you'll need to look this up separately)
-- Order by decade (newest first)


-- Challenge 11.5: Database maintenance
-- Write queries to:
-- a) Delete all movies with NULL ratings
-- b) Count how many movies are left
-- c) Re-run 02-seed-data.sql if you want your data back!


-- ============================================
-- End of Workshop Exercises
-- ============================================

-- Great work! You've practiced:
-- ✅ CREATE TABLE
-- ✅ INSERT (adding data)
-- ✅ UPDATE (modifying data)
-- ✅ DELETE (removing data)
-- ✅ ALTER TABLE (changing structure)
-- ✅ SELECT with WHERE (filtering)
-- ✅ ORDER BY & LIMIT (sorting and pagination)
-- ✅ Aggregate functions (COUNT, AVG, SUM, etc.)
-- ✅ GROUP BY & HAVING (grouping and filtering groups)

-- Coming in the next session:
-- 🔜 JOINs (combining data from multiple tables)
-- 🔜 Relationships (foreign keys, one-to-many, many-to-many)
-- 🔜 Complex multi-table queries

-- Remember:
-- - Always use WHERE with UPDATE and DELETE!
-- - Test queries with LIMIT first
-- - Re-run 02-seed-data.sql if you mess up your data
-- - Ask your instructor if you're stuck!

-- Good luck!