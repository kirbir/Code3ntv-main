CREATE TABLE watchlist (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	year INTEGER,
	watched BOOLEAN DEFAULT false,
	date_added TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
release_year INTEGER,
description TEXT
);

CREATE TABLE users(
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE,
date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlist_entries(
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id),
	movie_id INTEGER NOT NULL REFERENCES movies(id),
	rating INTEGER,
	date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(user_id, movie_id)
);

ALTER TABLE watchlist_entries
ADD CONSTRAINT unique_user_movie_watchlist

ALTER TABLE users 
ADD COLUMN name VARCHAR(255) NOT NULL;

INSERT INTO users(username, email) values('gummi', 'gummi@gmail.com');

INSERT INTO watchlist(title) values('The Matrix');
INSERT INTO movies(title, release_year, description) values('The Matrix 6', 1993, 'nerdy film about hackers');

INSERT INTO watchlist_entries(user_id, movie_id, rating) values(2,1,10);

UPDATE watchlist
SET watched = true
WHERE title = 'The Matrix';

UPDATE watchlist
SET year = 1999
WHERE title = 'The Matrix';