CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    release_year INT CHECK (release_year BETWEEN 1900 AND 2030),
    duration_minutes INT CHECK (release_year >= 0),
    sales_millions DECIMAL(12,2) CHECK(sales_millions >= 0),
    rating DECIMAL(1,1) CHECK(rating BETWEEN 0 AND 10),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    birth_year INT CHECK (birth_year BETWEEN 1900 AND 2020),
    country VARCHAR(100),
    genre_specialty VARCHAR(100)
);

CREATE TABLE songs (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    duration_seconds INT CHECK(duration_seconds >= 0),
    track_number INT CHECK(track_number >= 0),
    album_id INT
);

CREATE TABLE genres(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

ALTER TABLE albums
ADD COLUMN label VARCHAR(150);

ALTER TABLE albums
ADD COLUMN IS_EXPLICIT BOOLEAN DEFAULT false;

ALTER TABLE artists
ADD COLUMN is_active BOOLEAN DEFAULT true;

ALTER TABLE songs
ALTER COLUMN  duration_seconds DROP NOT NULL;

ALTER TABLE albums
RENAME COLUMN label TO recod_label;

CREATE TABLE album_artists (
    album_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    role VARCHAR(50),
    PRIMARY KEY (album_id, artist_id),
    FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY(artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE song_artists (
    song_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    role VARCHAR(50),
    PRIMARY KEY (song_id, artist_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE album_genres(
    album_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    PRIMARY KEY (album_id, genre_id),
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

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

ALTER TABLE songs
ADD CONSTRAINT fk_songs_album
FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE;

SELECT albums.title, artists.name
FROM albums
JOIN album_artists ON albums.id = album_artists.album_id
JOIN artists ON album_artists.artist_id = artists.id;

SELECT songs.title, albums.title
FROM songs
JOIN albums ON songs.album_id = albums.id;

SELECT albums.title, genres.name
FROM albums
JOIN album_genres ON albums.id = album_genres.album_id
JOIN genres ON album_genres.genre_id = genres.id;

ALTER TABLE albums
RENAME COLUMN recod_label TO record_label;
