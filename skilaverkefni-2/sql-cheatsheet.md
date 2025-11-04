# PostgreSQL Quick Reference Cheatsheet

## Basic Query Structure

```sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1
LIMIT 10;
```

## SELECT Statements

```sql
-- Select all columns
SELECT * FROM movies;

-- Select specific columns
SELECT title, rating FROM movies;

-- Select with alias
SELECT title AS movie_name, rating AS score FROM movies;

-- Select distinct values
SELECT DISTINCT release_year FROM movies;

-- Select with calculations
SELECT title, box_office_millions * 1000000 AS box_office_dollars FROM movies;
```

## WHERE Clause - Filtering

### Comparison Operators

```sql
-- Equals
WHERE rating = 8.5

-- Not equals
WHERE rating != 7.0
WHERE rating <> 7.0  -- Same as !=

-- Greater than / Less than
WHERE rating > 8.0
WHERE rating >= 8.0
WHERE rating < 7.0
WHERE rating <= 7.0

-- Between (inclusive)
WHERE release_year BETWEEN 2010 AND 2020
-- Equivalent to: WHERE release_year >= 2010 AND release_year <= 2020

-- In a list
WHERE release_year IN (1994, 2008, 2019)
-- Equivalent to: WHERE release_year = 1994 OR release_year = 2008 OR release_year = 2019

-- Not in a list
WHERE genre NOT IN ('Horror', 'Documentary')
```

### String Pattern Matching

```sql
-- Contains "Avengers" anywhere
WHERE title LIKE '%Avengers%'

-- Starts with "The"
WHERE title LIKE 'The%'

-- Ends with "Man"
WHERE title LIKE '%Man'

-- Case-insensitive (PostgreSQL specific)
WHERE title ILIKE '%avengers%'

-- Exactly 3 characters (using _ wildcard)
WHERE code LIKE '___'

-- Starts with "S" and has at least 3 more characters
WHERE title LIKE 'S___%'
```

### NULL Checks

```sql
-- Is NULL
WHERE watched_date IS NULL

-- Is NOT NULL
WHERE watched_date IS NOT NULL

-- WRONG - Don't use = with NULL
WHERE watched_date = NULL  -- This doesn't work!
```

### Logical Operators

```sql
-- AND - Both conditions must be true
WHERE rating > 8.0 AND release_year >= 2010

-- OR - At least one condition must be true
WHERE rating > 8.5 OR box_office_millions > 1000

-- NOT - Negates a condition
WHERE NOT release_year < 2000

-- Complex combinations (use parentheses for clarity)
WHERE (rating > 8.0 OR box_office_millions > 500)
  AND release_year >= 2015
  AND watched = TRUE
```

## ORDER BY - Sorting

```sql
-- Sort ascending (default)
SELECT title, rating FROM movies
ORDER BY rating;

-- Sort descending
SELECT title, rating FROM movies
ORDER BY rating DESC;

-- Sort ascending explicitly
SELECT title, rating FROM movies
ORDER BY rating ASC;

-- Sort by multiple columns
SELECT title, release_year, rating FROM movies
ORDER BY release_year DESC, rating DESC;
-- First by year (newest first), then by rating (highest first)

-- Sort by column position (not recommended)
SELECT title, rating FROM movies
ORDER BY 2 DESC;  -- Sorts by 2nd column (rating)
```

## LIMIT and OFFSET - Pagination

```sql
-- Get first 10 rows
SELECT title FROM movies
ORDER BY rating DESC
LIMIT 10;

-- Skip first 10, get next 10 (pagination)
SELECT title FROM movies
ORDER BY rating DESC
LIMIT 10 OFFSET 10;

-- Page 3 with 20 items per page
SELECT title FROM movies
ORDER BY rating DESC
LIMIT 20 OFFSET 40;  -- Skip 40 (2 pages × 20)
```

## Aggregate Functions

```sql
-- Count all rows
SELECT COUNT(*) FROM movies;

-- Count non-NULL values in a column
SELECT COUNT(watched_date) FROM movies;

-- Count distinct values
SELECT COUNT(DISTINCT release_year) FROM movies;

-- Sum
SELECT SUM(box_office_millions) AS total_box_office FROM movies;

-- Average
SELECT AVG(rating) AS average_rating FROM movies;

-- Average with rounding
SELECT ROUND(AVG(rating), 2) AS average_rating FROM movies;

-- Maximum
SELECT MAX(rating) AS highest_rating FROM movies;

-- Minimum
SELECT MIN(release_year) AS oldest_movie FROM movies;

-- Multiple aggregates at once
SELECT
  COUNT(*) AS total_movies,
  AVG(rating) AS avg_rating,
  MAX(box_office_millions) AS biggest_hit,
  MIN(release_year) AS oldest
FROM movies;
```

## GROUP BY - Grouping Data

```sql
-- Basic grouping
SELECT release_year, COUNT(*) AS movie_count
FROM movies
GROUP BY release_year;

-- Group with multiple aggregates
SELECT
  release_year,
  COUNT(*) AS count,
  AVG(rating) AS avg_rating,
  SUM(box_office_millions) AS total_box_office
FROM movies
GROUP BY release_year
ORDER BY release_year DESC;

-- Group by multiple columns
SELECT
  release_year,
  watched,
  COUNT(*) AS count
FROM movies
GROUP BY release_year, watched
ORDER BY release_year DESC, watched;

-- Group by expression (decade)
SELECT
  FLOOR(release_year / 10) * 10 AS decade,
  COUNT(*) AS movie_count
FROM movies
GROUP BY decade
ORDER BY decade DESC;
```

### IMPORTANT: GROUP BY Rules

When using GROUP BY:

1. Every column in SELECT must be either:
   - In the GROUP BY clause, OR
   - Inside an aggregate function (COUNT, AVG, SUM, etc.)

```sql
-- CORRECT ✓
SELECT release_year, COUNT(*), AVG(rating)
FROM movies
GROUP BY release_year;

-- WRONG ✗ - title is not in GROUP BY or aggregate
SELECT release_year, title, COUNT(*)
FROM movies
GROUP BY release_year;

-- CORRECT ✓ - All non-aggregated columns are in GROUP BY
SELECT release_year, watched, COUNT(*)
FROM movies
GROUP BY release_year, watched;
```

## HAVING - Filtering Groups

```sql
-- Filter groups after aggregation
SELECT release_year, COUNT(*) AS count
FROM movies
GROUP BY release_year
HAVING COUNT(*) > 2;  -- Only years with more than 2 movies

-- Multiple HAVING conditions
SELECT release_year, AVG(rating) AS avg_rating
FROM movies
GROUP BY release_year
HAVING AVG(rating) > 8.0 AND COUNT(*) >= 3;

-- Combine WHERE and HAVING
SELECT release_year, AVG(rating) AS avg_rating
FROM movies
WHERE release_year >= 2000     -- Filter rows BEFORE grouping
GROUP BY release_year
HAVING AVG(rating) > 7.5;      -- Filter groups AFTER grouping
```

### WHERE vs HAVING

| WHERE                            | HAVING                               |
| -------------------------------- | ------------------------------------ |
| Filters **rows** before grouping | Filters **groups** after aggregation |
| Cannot use aggregate functions   | Can use aggregate functions          |
| Applied before GROUP BY          | Applied after GROUP BY               |

```sql
-- Example showing both
SELECT genre, AVG(rating) AS avg_rating, COUNT(*) AS count
FROM movies
WHERE release_year >= 2010           -- WHERE: Filter rows first
GROUP BY genre
HAVING COUNT(*) >= 5                 -- HAVING: Filter groups after
ORDER BY avg_rating DESC;
```

## JOINS - Combining Tables

### INNER JOIN

Returns only rows that have matches in both tables.

```sql
-- Basic INNER JOIN
SELECT
  movies.title,
  directors.name AS director
FROM movies
JOIN movie_directors ON movies.id = movie_directors.movie_id
JOIN directors ON movie_directors.director_id = directors.id;

-- Same with table aliases (cleaner)
SELECT
  m.title,
  d.name AS director
FROM movies m
JOIN movie_directors md ON m.id = md.movie_id
JOIN directors d ON md.director_id = d.id;
```

### Multiple JOINs

```sql
-- Join 3+ tables
SELECT
  m.title,
  d.name AS director,
  g.name AS genre
FROM movies m
JOIN movie_directors md ON m.id = md.movie_id
JOIN directors d ON md.director_id = d.id
JOIN movie_genres mg ON m.id = mg.movie_id
JOIN genres g ON mg.genre_id = g.id
ORDER BY m.title;
```

### JOIN with WHERE

```sql
-- Filter after joining
SELECT
  m.title,
  d.name AS director,
  m.rating
FROM movies m
JOIN movie_directors md ON m.id = md.movie_id
JOIN directors d ON md.director_id = d.id
WHERE d.name = 'Christopher Nolan'
  AND m.rating > 8.0;
```

### JOIN with Aggregates

```sql
-- Count movies per director
SELECT
  d.name AS director,
  COUNT(m.id) AS movie_count,
  AVG(m.rating) AS avg_rating
FROM directors d
JOIN movie_directors md ON d.id = md.director_id
JOIN movies m ON md.movie_id = m.id
GROUP BY d.name
ORDER BY movie_count DESC;
```

## Common SQL Functions

### String Functions

```sql
-- Concatenate strings
SELECT CONCAT(title, ' (', release_year, ')') AS full_title FROM movies;

-- Alternative: Use ||
SELECT title || ' (' || release_year || ')' AS full_title FROM movies;

-- Uppercase
SELECT UPPER(title) FROM movies;

-- Lowercase
SELECT LOWER(title) FROM movies;

-- String length
SELECT title, LENGTH(title) AS title_length FROM movies;

-- Substring
SELECT SUBSTRING(title FROM 1 FOR 10) AS short_title FROM movies;

-- Aggregate multiple values into comma-separated string
SELECT
  movie_id,
  STRING_AGG(genre_name, ', ') AS genres
FROM movie_genres
GROUP BY movie_id;
```

### Date Functions

```sql
-- Current date
SELECT CURRENT_DATE;

-- Current timestamp
SELECT CURRENT_TIMESTAMP;
SELECT NOW();  -- Same as CURRENT_TIMESTAMP

-- Extract parts of date
SELECT
  watched_date,
  EXTRACT(YEAR FROM watched_date) AS year,
  EXTRACT(MONTH FROM watched_date) AS month,
  EXTRACT(DAY FROM watched_date) AS day
FROM movies;

-- Date difference
SELECT
  title,
  watched_date,
  CURRENT_DATE - watched_date AS days_since_watched
FROM movies
WHERE watched_date IS NOT NULL;
```

### Math Functions

```sql
-- Round
SELECT ROUND(AVG(rating), 2) FROM movies;

-- Floor (round down)
SELECT FLOOR(release_year / 10) * 10 AS decade FROM movies;

-- Ceiling (round up)
SELECT CEIL(rating) FROM movies;

-- Absolute value
SELECT ABS(-5);  -- Returns 5
```

## Query Execution Order

Understanding the order helps write correct queries:

```
1. FROM        - Get data from tables
2. JOIN        - Combine tables
3. WHERE       - Filter rows
4. GROUP BY    - Group rows
5. HAVING      - Filter groups
6. SELECT      - Choose columns
7. DISTINCT    - Remove duplicates
8. ORDER BY    - Sort results
9. LIMIT       - Restrict number of rows
```

## Common Mistakes & How to Avoid Them

### 1. Forgetting WHERE in UPDATE/DELETE

```sql
-- DANGEROUS ⚠️ - Updates ALL rows!
UPDATE movies SET watched = TRUE;

-- SAFE ✓ - Updates only one row
UPDATE movies SET watched = TRUE WHERE id = 1;

-- DANGEROUS ⚠️ - Deletes ALL rows!
DELETE FROM movies;

-- SAFE ✓ - Deletes specific rows
DELETE FROM movies WHERE id = 1;
```

### 2. GROUP BY Errors

```sql
-- WRONG ✗ - title not in GROUP BY or aggregate
SELECT release_year, title, COUNT(*)
FROM movies
GROUP BY release_year;

-- CORRECT ✓
SELECT release_year, COUNT(*)
FROM movies
GROUP BY release_year;
```

### 3. NULL Comparisons

```sql
-- WRONG ✗ - Doesn't work with NULL
WHERE rating = NULL

-- CORRECT ✓
WHERE rating IS NULL
```

### 4. Using WHERE with Aggregates

```sql
-- WRONG ✗ - Can't use aggregates in WHERE
SELECT genre, AVG(rating)
FROM movies
WHERE AVG(rating) > 8.0
GROUP BY genre;

-- CORRECT ✓ - Use HAVING for aggregates
SELECT genre, AVG(rating)
FROM movies
GROUP BY genre
HAVING AVG(rating) > 8.0;
```

## Useful pgAdmin Shortcuts

- **F5** - Execute query
- **F7** - Explain query plan
- **Ctrl+Shift+C** - Comment/uncomment selection
- **Ctrl+Space** - Auto-complete
- **Ctrl+/** - Toggle comment

## Best Practices

1. **Use meaningful aliases** - Make queries readable
2. **Format your SQL** - Use indentation and line breaks
3. **Test with LIMIT** - Start with small result sets
4. **Comment complex queries** - Explain your logic
5. **Use WHERE before JOIN when possible** - Improves performance
6. **Always use WHERE with UPDATE/DELETE** - Avoid accidents
7. **Use transactions for important changes** - Can rollback if needed
