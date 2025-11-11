-- ============================================
-- PostgreSQL Workshop - Sample Data
-- ============================================
-- This script populates the database with realistic movie data
-- Run this AFTER running 01-setup.sql
--
-- ⚠️ NOTE: This script clears all existing data first!
-- Safe to run multiple times to reset your database to original state.
--
-- If you've corrupted your data during practice exercises,
-- simply re-run this file to restore everything.

-- ============================================
-- Step 1: Clear All Existing Data
-- ============================================

-- Note: CASCADE ensures related data in junction tables is also removed
-- RESTART IDENTITY resets auto-increment counters to 1
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE movie_actors RESTART IDENTITY CASCADE;
TRUNCATE TABLE movie_directors RESTART IDENTITY CASCADE;
TRUNCATE TABLE movie_genres RESTART IDENTITY CASCADE;
TRUNCATE TABLE movies RESTART IDENTITY CASCADE;
TRUNCATE TABLE actors RESTART IDENTITY CASCADE;
TRUNCATE TABLE directors RESTART IDENTITY CASCADE;
TRUNCATE TABLE genres RESTART IDENTITY CASCADE;

-- ============================================
-- Step 2: Insert Directors
-- ============================================

INSERT INTO directors (name, birth_year, nationality) VALUES
('Christopher Nolan', 1970, 'British-American'),
('Quentin Tarantino', 1963, 'American'),
('Anthony Russo', 1970, 'American'),
('Joe Russo', 1971, 'American'),
('Greta Gerwig', 1983, 'American'),
('James Gunn', 1966, 'American'),
('Jon Favreau', 1966, 'American'),
('Damien Chazelle', 1985, 'American'),
('Denis Villeneuve', 1967, 'Canadian'),
('The Wachowskis', 1965, 'American'),
('Steven Spielberg', 1946, 'American'),
('Patty Jenkins', 1971, 'American'),
('Ryan Coogler', 1986, 'American'),
('Taika Waititi', 1975, 'New Zealand');

-- ============================================
-- Step 3: Insert Actors
-- ============================================

INSERT INTO actors (name, birth_year, nationality) VALUES
('Robert Downey Jr.', 1965, 'American'),
('Scarlett Johansson', 1984, 'American'),
('Chris Hemsworth', 1983, 'Australian'),
('Chris Evans', 1981, 'American'),
('Mark Ruffalo', 1967, 'American'),
('Tom Holland', 1996, 'British'),
('Zendaya', 1996, 'American'),
('Margot Robbie', 1990, 'Australian'),
('Ryan Gosling', 1980, 'Canadian'),
('Cillian Murphy', 1976, 'Irish'),
('Leonardo DiCaprio', 1974, 'American'),
('Tom Hanks', 1956, 'American'),
('Samuel L. Jackson', 1948, 'American'),
('Uma Thurman', 1970, 'American'),
('John Travolta', 1954, 'American'),
('Keanu Reeves', 1964, 'Canadian'),
('Carrie-Anne Moss', 1967, 'Canadian'),
('Christian Bale', 1974, 'British'),
('Gal Gadot', 1985, 'Israeli'),
('Chadwick Boseman', 1976, 'American'),
('Lupita Nyongo', 1983, 'Kenyan-Mexican'),
('Chris Pratt', 1979, 'American'),
('Zoe Saldana', 1978, 'American'),
('Matthew McConaughey', 1969, 'American'),
('Anne Hathaway', 1982, 'American');

-- ============================================
-- Step 4: Insert Genres
-- ============================================

INSERT INTO genres (name) VALUES
('Action'),
('Drama'),
('Comedy'),
('Sci-Fi'),
('Thriller'),
('Adventure'),
('Fantasy'),
('Crime'),
('Biography'),
('Romance');

-- ============================================
-- Step 5: Insert Movies
-- ============================================

INSERT INTO movies (title, release_year, duration_minutes, box_office_millions, rating, description, watched, watched_date) VALUES
-- Marvel Cinematic Universe
('Avengers: Endgame', 2019, 181, 2797.50, 8.4, 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.', TRUE, '2019-05-01'),
('Avengers: Infinity War', 2018, 149, 2048.40, 8.4, 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos.', TRUE, '2018-04-27'),
('Iron Man', 2008, 126, 585.80, 7.9, 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.', TRUE, '2008-05-02'),
('Black Panther', 2018, 134, 1347.60, 7.3, 'TChalla, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future.', TRUE, '2018-02-16'),
('Guardians of the Galaxy', 2014, 121, 773.30, 8.0, 'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.', TRUE, '2014-08-01'),
('Thor: Ragnarok', 2017, 130, 854.00, 7.9, 'Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarok.', TRUE, '2017-11-03'),
('Spider-Man: No Way Home', 2021, 148, 1921.80, 8.2, 'With Spider-Mans identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.', TRUE, '2021-12-17'),

-- Christopher Nolan Films
('Oppenheimer', 2023, 180, 952.00, 8.3, 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', TRUE, '2023-07-21'),
('Inception', 2010, 148, 836.80, 8.8, 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', TRUE, '2010-07-16'),
('The Dark Knight', 2008, 152, 1005.00, 9.0, 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests to fight injustice.', TRUE, '2008-07-18'),
('Interstellar', 2014, 169, 701.80, 8.7, 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', TRUE, '2014-11-07'),
('Dunkirk', 2017, 106, 530.40, 7.8, 'Allied soldiers from Belgium, the British Commonwealth and France are surrounded by the German Army and evacuated during a fierce battle in World War II.', FALSE, NULL),

-- Other Major Blockbusters
('Barbie', 2023, 114, 1445.60, 6.8, 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.', TRUE, '2023-07-21'),
('The Matrix', 1999, 136, 467.20, 8.7, 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', TRUE, '2000-03-31'),
('Pulp Fiction', 1994, 154, 213.90, 8.9, 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', TRUE, '1995-10-14'),
('Forrest Gump', 1994, 142, 678.20, 8.8, 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.', TRUE, '1994-07-06'),
('The Shawshank Redemption', 1994, 142, 28.30, 9.3, 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', TRUE, '1995-02-17'),
('Toy Story', 1995, 81, 373.60, 8.3, 'A cowboys jealousy of a new spaceman figure in a boys toy collection leads to adventure.', TRUE, '1995-11-22'),
('Jurassic Park', 1993, 127, 1029.20, 8.2, 'A pragmatic paleontologist touring an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the parks cloned dinosaurs to run loose.', TRUE, '1993-06-11'),

-- Recent Hits
('Everything Everywhere All at Once', 2022, 139, 141.00, 7.8, 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes.', TRUE, '2022-04-08'),
('Top Gun: Maverick', 2022, 130, 1488.70, 8.2, 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a detachment of Top Gun graduates for a specialized mission.', TRUE, '2022-05-27'),
('Dune', 2021, 155, 402.00, 8.0, 'Feature adaptation of Frank Herbert''s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.', TRUE, '2021-10-22'),
('La La Land', 2016, 128, 472.00, 8.0, 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.', TRUE, '2016-12-09'),
('Wonder Woman', 2017, 141, 822.30, 7.3, 'When a pilot crashes and tells of conflict in the outside world, Diana leaves home convinced she can stop the threat.', TRUE, '2017-06-02'),

-- Classics
('The Godfather', 1972, 175, 250.00, 9.2, 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', TRUE, '1972-03-24'),
('Saving Private Ryan', 1998, 169, 482.30, 8.6, 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.', TRUE, '1998-07-24'),
('Schindlers List', 1993, 195, 322.20, 9.0, 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.', FALSE, NULL),

-- Animation
('Spider-Man: Into the Spider-Verse', 2018, 117, 384.30, 8.4, 'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions.', TRUE, '2019-01-14'),
('Up', 2009, 96, 735.10, 8.3, 'An elderly widower uses thousands of balloons to fly his house to Paradise Falls in South America.', TRUE, '2009-05-29'),
('WALL-E', 2008, 98, 532.70, 8.4, 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.', TRUE, '2008-06-27');

-- ============================================
-- Step 6: Link Movies to Directors
-- ============================================

-- Christopher Nolan films
INSERT INTO movie_directors (movie_id, director_id, role) VALUES
(8, 1, 'director'),   -- Oppenheimer
(9, 1, 'director'),   -- Inception
(10, 1, 'director'),  -- The Dark Knight
(11, 1, 'director'),  -- Interstellar
(12, 1, 'director');  -- Dunkirk

-- Russo Brothers films (co-directors)
INSERT INTO movie_directors (movie_id, director_id, role) VALUES
(1, 3, 'co-director'),  -- Endgame - Anthony Russo
(1, 4, 'co-director'),  -- Endgame - Joe Russo
(2, 3, 'co-director'),  -- Infinity War - Anthony
(2, 4, 'co-director');  -- Infinity War - Joe

-- Other directors
INSERT INTO movie_directors (movie_id, director_id, role) VALUES
(3, 7, 'director'),   -- Iron Man - Jon Favreau
(4, 13, 'director'),  -- Black Panther - Ryan Coogler
(5, 6, 'director'),   -- Guardians - James Gunn
(6, 14, 'director'),  -- Thor Ragnarok - Taika Waititi
(13, 5, 'director'),  -- Barbie - Greta Gerwig
(14, 10, 'director'), -- The Matrix - Wachowskis
(15, 2, 'director'),  -- Pulp Fiction - Tarantino
(23, 12, 'director'), -- Wonder Woman - Patty Jenkins
(22, 8, 'director'),  -- La La Land - Damien Chazelle
(21, 9, 'director'),  -- Dune - Denis Villeneuve
(25, 11, 'director'), -- Saving Private Ryan - Spielberg
(26, 11, 'director'), -- Schindlers List - Spielberg
(18, 11, 'director'); -- Jurassic Park - Spielberg

-- ============================================
-- Step 7: Link Movies to Actors
-- ============================================

-- Avengers: Endgame
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(1, 1, 'Tony Stark / Iron Man', 1),
(1, 4, 'Steve Rogers / Captain America', 2),
(1, 3, 'Thor', 3),
(1, 5, 'Bruce Banner / Hulk', 4),
(1, 2, 'Natasha Romanoff / Black Widow', 5);

-- Avengers: Infinity War
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(2, 1, 'Tony Stark / Iron Man', 1),
(2, 3, 'Thor', 2),
(2, 5, 'Bruce Banner / Hulk', 3),
(2, 2, 'Natasha Romanoff / Black Widow', 4);

-- Iron Man
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(3, 1, 'Tony Stark / Iron Man', 1);

-- Black Panther
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(4, 20, 'TChalla / Black Panther', 1),
(4, 21, 'Nakia', 2);

-- Guardians of the Galaxy
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(5, 22, 'Peter Quill / Star-Lord', 1),
(5, 23, 'Gamora', 2);

-- Thor: Ragnarok
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(6, 3, 'Thor', 1),
(6, 5, 'Bruce Banner / Hulk', 2);

-- Spider-Man: No Way Home
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(7, 6, 'Peter Parker / Spider-Man', 1),
(7, 7, 'MJ', 2);

-- Oppenheimer
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(8, 10, 'J. Robert Oppenheimer', 1);

-- Inception
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(9, 11, 'Dom Cobb', 1);

-- The Dark Knight
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(10, 18, 'Bruce Wayne / Batman', 1);

-- Interstellar
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(11, 24, 'Cooper', 1),
(11, 25, 'Brand', 2);

-- Barbie
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(13, 8, 'Barbie', 1),
(13, 9, 'Ken', 2);

-- The Matrix
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(14, 16, 'Neo', 1),
(14, 17, 'Trinity', 2);

-- Pulp Fiction
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(15, 15, 'Vincent Vega', 1),
(15, 13, 'Jules Winnfield', 2),
(15, 14, 'Mia Wallace', 3);

-- Forrest Gump
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(16, 12, 'Forrest Gump', 1);

-- La La Land
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(22, 9, 'Sebastian', 1),
(22, 7, 'Mia', 2);

-- Wonder Woman
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(23, 19, 'Diana Prince / Wonder Woman', 1);

-- Saving Private Ryan
INSERT INTO movie_actors (movie_id, actor_id, character_name, billing_order) VALUES
(25, 12, 'Captain Miller', 1);

-- ============================================
-- Step 8: Link Movies to Genres
-- ============================================

-- Action movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (10, 1), (20, 1), (23, 1), (25, 1);

-- Sci-Fi movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 4), (2, 4), (3, 4), (5, 4), (9, 4), (11, 4), (14, 4), (18, 4), (21, 4), (28, 4), (29, 4);

-- Drama movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(8, 2), (9, 2), (10, 2), (11, 2), (15, 2), (16, 2), (17, 2), (19, 2), (24, 2), (25, 2), (26, 2);

-- Adventure movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 6), (2, 6), (4, 6), (5, 6), (6, 6), (11, 6), (18, 6), (21, 6), (29, 6);

-- Comedy movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(6, 3), (13, 3), (17, 3);

-- Crime movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(15, 8), (24, 8);

-- Thriller movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(9, 5), (10, 5), (14, 5);

-- Fantasy movies
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(6, 7), (13, 7), (23, 7);

-- Biography
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(8, 9), (26, 9);

-- Romance
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(22, 10);

-- ============================================
-- Step 9: Insert Reviews
-- ============================================

-- Reviews for Avengers: Endgame
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(1, 'MovieBuff2019', 5, 'An epic conclusion to the Infinity Saga. Perfectly balances fan service with emotional storytelling.', '2019-05-02', 245),
(1, 'CinemaLover', 5, 'Three hours flew by. A masterpiece that delivered on every level.', '2019-05-03', 189),
(1, 'CasualViewer', 4, 'Great movie but maybe a bit too long. Still worth watching!', '2019-05-10', 67);

-- Reviews for Inception
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(9, 'MindBender', 5, 'Nolan at his finest. A cerebral thriller that demands multiple viewings.', '2010-07-20', 412),
(9, 'ActionFan', 4, 'Visually stunning with great action, though the plot can be confusing.', '2010-07-25', 178),
(9, 'FilmCritic99', 5, 'Revolutionary filmmaking. The practical effects are incredible.', '2010-08-01', 290);

-- Reviews for The Dark Knight
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(10, 'GothamFan', 5, 'Heath Ledgers Joker is unforgettable. A perfect superhero film.', '2008-07-20', 892),
(10, 'ComicReader', 5, 'This isn''t just a comic book movie, it''s a crime epic.', '2008-07-22', 654),
(10, 'MovieAddict', 5, 'The best Batman movie ever made. Period.', '2008-07-25', 521),
(10, 'PopcornEater', 4, 'Amazing performances but quite dark and intense.', '2008-08-05', 145);

-- Reviews for Oppenheimer
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(8, 'HistoryBuff', 5, 'A haunting and powerful biopic. Cillian Murphy deserves an Oscar.', '2023-07-22', 156),
(8, 'FilmStudent', 5, 'Nolan''s most mature work. The sound design is phenomenal.', '2023-07-23', 143),
(8, 'TheaterGoer', 4, 'Dense and demanding but ultimately rewarding. See it in IMAX.', '2023-07-28', 89);

-- Reviews for The Matrix
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(14, 'SciFiFan1999', 5, 'Revolutionary. Changed action movies forever.', '1999-04-05', 678),
(14, 'PhilosophyNerd', 5, 'Action-packed but also intellectually stimulating.', '1999-04-10', 445),
(14, 'RetroReviewer', 5, 'Still holds up 20+ years later. A timeless classic.', '2021-03-31', 234);

-- Reviews for Pulp Fiction
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(15, 'TarantinoFan', 5, 'Tarantinos masterpiece. The dialogue is perfection.', '1994-10-20', 567),
(15, 'IndieFilmLover', 5, 'Non-linear storytelling at its best. Iconic and influential.', '1994-10-25', 423),
(15, 'ClassicCinema', 5, 'Every scene is memorable. A cultural phenomenon.', '1995-01-15', 389);

-- Reviews for Barbie
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(13, 'PopCultureFan', 4, 'Fun and surprisingly deep. A commentary on modern society.', '2023-07-22', 234),
(13, 'FamilyMovieNight', 4, 'Colorful, entertaining, and thought-provoking.', '2023-07-28', 178),
(13, 'CriticalThinker', 3, 'Visually impressive but the message is a bit heavy-handed.', '2023-08-05', 92);

-- Reviews for The Shawshank Redemption
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(17, 'PrisonDramaFan', 5, 'The best movie ever made. Perfect in every way.', '1995-02-20', 1245),
(17, 'DramaLover', 5, 'Hope and friendship in the darkest places. Masterful storytelling.', '1995-03-01', 987),
(17, 'ClassicMovieBuff', 5, 'Timeless. Gets better with each viewing.', '2000-01-01', 654);

-- Reviews for Interstellar
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(11, 'SpaceNerd', 5, 'Emotionally powerful and scientifically fascinating.', '2014-11-10', 456),
(11, 'NolanFanatic', 5, 'Nolan''s most ambitious film. The ending gave me chills.', '2014-11-12', 389),
(11, 'CasualMoviegoer', 4, 'Beautiful but confusing at times. The music is too loud.', '2014-11-20', 167);

-- Reviews for Guardians of the Galaxy
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(5, 'MarvelFan', 5, 'The most fun Marvel movie. Great soundtrack!', '2014-08-05', 345),
(5, 'SpaceOperaLover', 4, 'A perfect blend of humor, action, and heart.', '2014-08-10', 278),
(5, 'ComicBookGeek', 5, 'Proof that Marvel can take risks and succeed.', '2014-08-15', 234);

-- Reviews for Spider-Man: No Way Home
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(7, 'SpideyFan', 5, 'A love letter to Spider-Man fans. Absolutely incredible.', '2021-12-18', 567),
(7, 'MCUAddict', 5, 'Everything I wanted and more. The cameos were perfect.', '2021-12-20', 489),
(7, 'WebHead', 4, 'Great nostalgia trip but the plot has some holes.', '2021-12-28', 201);

-- Reviews for Dune
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(21, 'BookReader', 5, 'Finally, a worthy adaptation of Herbert''s novel.', '2021-10-25', 312),
(21, 'VisualEffectsFan', 5, 'Stunning cinematography. A visual masterpiece.', '2021-10-27', 289),
(21, 'SciFiEnthusiast', 4, 'Epic in scale but feels incomplete. Can''t wait for part 2.', '2021-11-02', 178);

-- Reviews for Everything Everywhere All at Once
INSERT INTO reviews (movie_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(19, 'IndieFilmFan', 5, 'Wildly creative and emotionally resonant. A true original.', '2022-04-10', 234),
(19, 'MultiverseTheory', 5, 'Chaotic brilliance. Michelle Yeoh is phenomenal.', '2022-04-15', 198),
(19, 'ArtHouseViewer', 4, 'Inventive but exhausting. Not for everyone.', '2022-04-20', 123);

-- ============================================
-- Verification Queries
-- ============================================

-- Show summary statistics
SELECT 'Data Import Summary:' AS info;
SELECT COUNT(*) AS total_movies FROM movies;
SELECT COUNT(*) AS total_directors FROM directors;
SELECT COUNT(*) AS total_actors FROM actors;
SELECT COUNT(*) AS total_genres FROM genres;
SELECT COUNT(*) AS total_reviews FROM reviews;

-- Success message
SELECT 'Sample data loaded successfully!' AS status;
SELECT 'You now have 30 movies, 14 directors, 25 actors, and 40 reviews!' AS details;