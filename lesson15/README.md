# Lesson 14 - Movie API with PostgreSQL

A RESTful API built with Express.js, TypeScript, and PostgreSQL using pg-promise.

## Setup

1. **Install dependencies:**

   ```powershell
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory with:

   ```
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=your_database_name
   PGUSER=your_username
   PGPASSWORD=your_password
   PORT=3000
   ```

3. **Create the database:**
   Make sure you have PostgreSQL installed and create a database. Then create a movies table:
   ```sql
   CREATE TABLE movies (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     director VARCHAR(255),
     release_year INTEGER,
     genre VARCHAR(100)
   );
   ```

## Running the Application

### Development mode (with auto-reload):

```powershell
npm run dev
```

### Build for production:

```powershell
npm run build
```

### Run production build:

```powershell
npm start
```

## API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get a specific movie by ID
- `POST /api/movies` - Create a new movie
- `PUT /api/movies/:id` - Update a movie
- `DELETE /api/movies/:id` - Delete a movie

## Example Requests

### Create a movie:

```json
POST /api/movies
{
  "title": "The Shawshank Redemption",
  "director": "Frank Darabont",
  "release_year": 1994,
  "genre": "Drama"
}
```

### Update a movie:

```json
PUT /api/movies/1
{
  "title": "The Shawshank Redemption",
  "director": "Frank Darabont",
  "release_year": 1994,
  "genre": "Drama"
}
```

## Project Structure

```
lesson14/
├── src/
│   ├── app.ts           # Express app configuration
│   ├── server.ts        # Server entry point
│   ├── config/
│   │   └── db.ts        # Database configuration
│   ├── models/
│   │   └── movieModel.ts # Movie data access layer
│   └── routes/
│       └── movies.ts     # Movie routes
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

