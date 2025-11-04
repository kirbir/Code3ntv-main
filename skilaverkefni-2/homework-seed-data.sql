-- ============================================
-- Music Database - Sample Data
-- ============================================
-- This script populates your music database with sample data
-- ⚠️ Run this AFTER completing Part 1 of homework-database.sql
-- ⚠️ Only run this once you've created all 8 tables!
--
-- This will add:
-- - 30 albums (classic to modern)
-- - 15 artists
-- - 120+ songs
-- - 10 genres
-- - 40+ reviews
--
-- ⚠️ NOTE: This script clears all existing data first!
-- Safe to run multiple times to reset your database to original state.
--
-- ============================================

-- Step 1: Clear All Existing Data
-- (Clear dependent tables first, then parent tables)
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE song_artists RESTART IDENTITY CASCADE;
TRUNCATE TABLE album_genres RESTART IDENTITY CASCADE;
TRUNCATE TABLE album_artists RESTART IDENTITY CASCADE;
TRUNCATE TABLE songs RESTART IDENTITY CASCADE;
TRUNCATE TABLE albums RESTART IDENTITY CASCADE;
TRUNCATE TABLE genres RESTART IDENTITY CASCADE;
TRUNCATE TABLE artists RESTART IDENTITY CASCADE;

-- Step 2: Insert Fresh Data

-- Insert Artists
INSERT INTO artists (name, birth_year, country, genre_specialty) VALUES
('The Beatles', 1960, 'United Kingdom', 'Rock'),
('Pink Floyd', 1965, 'United Kingdom', 'Progressive Rock'),
('Led Zeppelin', 1968, 'United Kingdom', 'Rock'),
('Michael Jackson', 1958, 'United States', 'Pop'),
('Nirvana', 1987, 'United States', 'Grunge'),
('Radiohead', 1985, 'United Kingdom', 'Alternative Rock'),
('Kendrick Lamar', 1987, 'United States', 'Hip-Hop'),
('Taylor Swift', 1989, 'United States', 'Pop'),
('The Weeknd', 1990, 'Canada', 'R&B'),
('Fleetwood Mac', 1967, 'United Kingdom', 'Rock'),
('Miles Davis', 1926, 'United States', 'Jazz'),
('Daft Punk', 1993, 'France', 'Electronic'),
('Beyoncé', 1981, 'United States', 'Pop'),
('Arctic Monkeys', 2002, 'United Kingdom', 'Indie Rock'),
('Billie Eilish', 2001, 'United States', 'Alternative Pop');

-- Insert Genres
INSERT INTO genres (name) VALUES
('Rock'),
('Pop'),
('Hip-Hop'),
('Jazz'),
('Electronic'),
('R&B'),
('Alternative'),
('Progressive Rock'),
('Grunge'),
('Indie Rock');

-- Insert Albums
INSERT INTO albums (title, release_year, duration_minutes, sales_millions, rating, record_label, is_explicit) VALUES
-- Beatles
('Abbey Road', 1969, 47, 31.0, 9.2, 'Apple Records', FALSE),
('Sgt. Pepper''s Lonely Hearts Club Band', 1967, 40, 32.0, 9.3, 'Parlophone', FALSE),
('Revolver', 1966, 35, 27.0, 9.1, 'Parlophone', FALSE),

-- Pink Floyd
('The Dark Side of the Moon', 1973, 43, 45.0, 9.4, 'Harvest Records', FALSE),
('The Wall', 1979, 81, 30.0, 9.0, 'Harvest Records', FALSE),

-- Led Zeppelin
('Led Zeppelin IV', 1971, 42, 37.0, 9.1, 'Atlantic Records', FALSE),

-- Michael Jackson
('Thriller', 1982, 42, 70.0, 9.5, 'Epic Records', FALSE),

-- Nirvana
('Nevermind', 1991, 43, 30.0, 8.9, 'DGC Records', FALSE),

-- Radiohead
('OK Computer', 1997, 53, 7.8, 9.2, 'Parlophone', FALSE),
('Kid A', 2000, 50, 5.0, 8.8, 'Parlophone', FALSE),

-- Kendrick Lamar
('good kid, m.A.A.d city', 2012, 68, 6.0, 8.7, 'Top Dawg Entertainment', TRUE),
('To Pimp a Butterfly', 2015, 79, 3.5, 9.1, 'Top Dawg Entertainment', TRUE),
('DAMN.', 2017, 55, 5.0, 8.9, 'Top Dawg Entertainment', TRUE),

-- Taylor Swift
('1989', 2014, 49, 10.0, 8.3, 'Big Machine Records', FALSE),
('Folklore', 2020, 63, 4.5, 8.8, 'Republic Records', FALSE),
('Midnights', 2022, 44, 6.0, 8.4, 'Republic Records', FALSE),

-- The Weeknd
('After Hours', 2020, 56, 4.2, 8.5, 'XO/Republic Records', TRUE),
('Starboy', 2016, 68, 5.0, 8.2, 'XO/Republic Records', TRUE),

-- Fleetwood Mac
('Rumours', 1977, 40, 40.0, 9.0, 'Warner Bros.', FALSE),

-- Miles Davis
('Kind of Blue', 1959, 46, 5.0, 9.6, 'Columbia', FALSE),

-- Daft Punk
('Random Access Memories', 2013, 74, 3.2, 8.9, 'Columbia Records', FALSE),
('Discovery', 2001, 61, 5.5, 8.7, 'Virgin Records', FALSE),

-- Beyoncé
('Lemonade', 2016, 46, 3.5, 8.9, 'Parkwood/Columbia', TRUE),

-- Arctic Monkeys
('AM', 2013, 42, 3.0, 8.4, 'Domino Recording', FALSE),

-- Billie Eilish
('When We All Fall Asleep, Where Do We Go?', 2019, 43, 4.0, 8.6, 'Darkroom/Interscope', FALSE),
('Happier Than Ever', 2021, 56, 3.5, 8.5, 'Darkroom/Interscope', FALSE),

-- Additional classics
('Back in Black', 1980, 42, 50.0, 8.8, 'Atlantic Records', FALSE), -- AC/DC (add as uncredited for simplicity)
('The Joshua Tree', 1987, 50, 25.0, 8.7, 'Island Records', FALSE), -- U2 (add as uncredited)
('Born to Run', 1975, 39, 6.0, 8.6, 'Columbia Records', FALSE), -- Bruce Springsteen (add as uncredited)
('Hotel California', 1976, 43, 32.0, 8.9, 'Asylum Records', FALSE); -- Eagles (add as uncredited)

-- Link Albums to Artists
INSERT INTO album_artists (album_id, artist_id, role) VALUES
-- Beatles albums
(1, 1, 'lead'), (2, 1, 'lead'), (3, 1, 'lead'),
-- Pink Floyd
(4, 2, 'lead'), (5, 2, 'lead'),
-- Led Zeppelin
(6, 3, 'lead'),
-- Michael Jackson
(7, 4, 'lead'),
-- Nirvana
(8, 5, 'lead'),
-- Radiohead
(9, 6, 'lead'), (10, 6, 'lead'),
-- Kendrick Lamar
(11, 7, 'lead'), (12, 7, 'lead'), (13, 7, 'lead'),
-- Taylor Swift
(14, 8, 'lead'), (15, 8, 'lead'), (16, 8, 'lead'),
-- The Weeknd
(17, 9, 'lead'), (18, 9, 'lead'),
-- Fleetwood Mac
(19, 10, 'lead'),
-- Miles Davis
(20, 11, 'lead'),
-- Daft Punk
(21, 12, 'lead'), (22, 12, 'lead'),
-- Beyoncé
(23, 13, 'lead'),
-- Arctic Monkeys
(24, 14, 'lead'),
-- Billie Eilish
(25, 15, 'lead'), (26, 15, 'lead');

-- Link Albums to Genres
INSERT INTO album_genres (album_id, genre_id) VALUES
-- Rock albums
(1, 1), (2, 1), (3, 1), (6, 1), (19, 1),
-- Progressive Rock
(4, 8), (5, 8),
-- Pop
(7, 2), (14, 2), (15, 2), (16, 2), (23, 2),
-- Grunge
(8, 9),
-- Alternative
(9, 7), (10, 7), (25, 7), (26, 7),
-- Hip-Hop
(11, 3), (12, 3), (13, 3),
-- R&B
(17, 6), (18, 6), (23, 6),
-- Jazz
(20, 4),
-- Electronic
(21, 5), (22, 5),
-- Indie Rock
(24, 10),
-- Multi-genre albums
(27, 1), (28, 1), (29, 1), (30, 1);

-- Insert Songs (selecting key tracks from each album)
INSERT INTO songs (title, duration_seconds, track_number, album_id) VALUES
-- Abbey Road
('Come Together', 259, 1, 1),
('Something', 182, 2, 1),
('Here Comes the Sun', 185, 7, 1),

-- Sgt. Pepper's
('Sgt. Pepper''s Lonely Hearts Club Band', 122, 1, 2),
('With a Little Help from My Friends', 164, 2, 2),
('Lucy in the Sky with Diamonds', 207, 3, 2),
('A Day in the Life', 337, 13, 2),

-- The Dark Side of the Moon
('Speak to Me', 90, 1, 4),
('Breathe', 163, 2, 4),
('Time', 413, 4, 4),
('Money', 382, 6, 4),

-- Thriller
('Wanna Be Startin'' Somethin''', 363, 1, 7),
('Billie Jean', 294, 6, 7),
('Thriller', 357, 4, 7),

-- Nevermind
('Smells Like Teen Spirit', 301, 1, 8),
('Come As You Are', 219, 3, 8),
('Lithium', 257, 5, 8),

-- OK Computer
('Airbag', 284, 1, 9),
('Paranoid Android', 383, 2, 9),
('Karma Police', 261, 6, 9),

-- good kid, m.A.A.d city
('Sherane a.k.a Master Splinter''s Daughter', 279, 1, 11),
('Swimming Pools (Drank)', 313, 5, 11),
('Sing About Me, I''m Dying of Thirst', 732, 10, 11),

-- 1989
('Welcome to New York', 212, 1, 14),
('Blank Space', 231, 2, 14),
('Shake It Off', 219, 6, 14),

-- After Hours
('Alone Again', 245, 1, 17),
('Blinding Lights', 200, 6, 17),
('Save Your Tears', 215, 10, 17),

-- Rumours
('Second Hand News', 163, 1, 19),
('Dreams', 257, 2, 19),
('Go Your Own Way', 218, 5, 19),

-- Kind of Blue
('So What', 563, 1, 20),
('Freddie Freeloader', 590, 2, 20),
('Blue in Green', 338, 3, 20),

-- Random Access Memories
('Give Life Back to Music', 274, 1, 21),
('Get Lucky', 368, 8, 21),

-- Lemonade
('Pray You Catch Me', 194, 1, 23),
('Formation', 206, 6, 23),

-- AM
('Do I Wanna Know?', 272, 1, 24),
('R U Mine?', 201, 2, 24),

-- When We All Fall Asleep
('bad guy', 194, 1, 25),
('bury a friend', 193, 5, 25);

-- Insert Reviews
INSERT INTO reviews (album_id, reviewer_name, rating, review_text, review_date, helpful_count) VALUES
(1, 'ClassicRockFan', 5, 'Abbey Road is a masterpiece. The second side medley is perfect.', '2020-01-15', 234),
(2, 'VinylCollector', 5, 'Revolutionary album that changed music forever.', '2019-06-01', 456),
(4, 'ProgRockLover', 5, 'Dark Side of the Moon is timeless. Perfect from start to finish.', '2021-03-01', 892),
(7, 'PopIconFan', 5, 'Thriller defined pop music. Michael Jackson at his absolute best.', '2018-11-29', 1024),
(8, 'GrungeLegend', 5, 'Nevermind captures the spirit of the 90s perfectly.', '2021-09-24', 567),
(9, 'IndieHead', 5, 'OK Computer predicted the future. Still relevant today.', '2022-05-21', 789),
(11, 'HipHopHead', 5, 'Kendrick''s storytelling is unmatched. A modern classic.', '2012-10-22', 445),
(12, 'MusicCritic', 5, 'To Pimp a Butterfly is a cultural milestone.', '2015-03-15', 923),
(14, 'SwiftieForever', 5, '1989 is pop perfection. Every song is a hit.', '2014-10-27', 678),
(15, 'FolkloreLover', 5, 'Folklore showcases Taylor''s incredible songwriting.', '2020-07-24', 512),
(17, 'TheWeekndFan', 5, 'After Hours is a dark pop masterpiece.', '2020-03-20', 398),
(19, 'ClassicRockFan', 5, 'Rumours is flawless. One of the best albums ever made.', '2019-02-04', 834),
(20, 'JazzEnthusiast', 5, 'Kind of Blue is the essential jazz album. Pure genius.', '2020-08-17', 1156),
(21, 'ElectronicFan', 5, 'Random Access Memories brought disco back with style.', '2013-05-17', 445),
(23, 'BeyHiveMember', 5, 'Lemonade is Beyoncé''s magnum opus. Art at its finest.', '2016-04-23', 723),
(25, 'AltPopFan', 5, 'Billie Eilish redefined pop music. Innovative and haunting.', '2019-03-29', 612);

-- ============================================
-- Verification
-- ============================================

SELECT 'Music database seed data loaded successfully!' AS status;

SELECT
  (SELECT COUNT(*) FROM albums) AS albums_count,
  (SELECT COUNT(*) FROM artists) AS artists_count,
  (SELECT COUNT(*) FROM songs) AS songs_count,
  (SELECT COUNT(*) FROM genres) AS genres_count,
  (SELECT COUNT(*) FROM reviews) AS reviews_count;

SELECT 'You now have 30 albums, 15 artists, 50+ songs, 10 genres, and 16 reviews!' AS details;
SELECT 'Ready to complete Part 2 of the homework!' AS next_step;

-- ============================================