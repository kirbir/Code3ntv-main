# Tix API

Event ticketing API built with Express, TypeScript, and PostgreSQL. Users can browse events, book tickets, and manage their bookings.

> **Note:** This is a final project for 3rd semester Programming at NTV. Not affiliated with the official tix.is.

## What's Inside

- User authentication with JWT
- Event browsing with filters and sorting
- Ticket booking with availability tracking
- Booking management (view history, cancel bookings)
- 24-hour cancellation policy
- Profile management

## Tech Stack

- Express.js + TypeScript
- PostgreSQL with pg-promise
- JWT authentication
- Zod validation
- Vitest + Supertest (31 integration tests)

## Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm

### Installation

```bash
git clone <your-repo-url>
cd lokaverkefni
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Database (required)
PGHOST=localhost
PGPORT=5433
PGDATABASE=tix
PGUSER=your_username
PGPASSWORD=your_password

# Test database (used automatically when running tests)
PGDATABASE_TEST=tix_test_data

# JWT (optional - has defaults)
# JWT_SECRET=your_secret_key_here
# JWT_EXPIRES_IN=7d

# Server (optional)
# PORT=3000
```

**Notes:**
- The app automatically uses `tix_test_data` when running tests
- JWT variables are optional (defaults: secret = "your-secret-key-change-in-production", expires = "24h")
- PORT is optional (defaults to 3000)

### Database Setup

1. Create the databases:

```sql
CREATE DATABASE tix;
CREATE DATABASE tix_test_data;
```

2. Load the schema and seed data (production only):

```bash
psql -h localhost -p 5433 -U your_username -d tix -f sql/db-seed-data.sql
```

The test database schema is created automatically when you run tests.

## Running the App

Development mode (with hot reload):

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

Server runs at `http://localhost:3000`

## Running Tests

Run all tests (watch mode):

```bash
npm test
```

Run once:

```bash
npm test -- --run
```

Run specific file:

```bash
npm test -- auth.test.ts
```

**Test coverage:**
- Authentication (5 tests)
- Events (6 tests)
- Venues (4 tests)
- Bookings (8 tests)
- User Profile (8 tests)

Total: 31 integration tests ✓

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication

- `POST /api/users/register` - Register
- `POST /api/users/login` - Login

### Events

- `GET /api/events` - List events (supports filters/sorting)
- `GET /api/events/:id` - Event details
- `GET /api/events/:id/tickets` - Available tickets

### Venues

- `GET /api/venues/:id` - Venue details
- `GET /api/venues/:id/events` - Upcoming events at venue

### Bookings (requires auth)

- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Booking history
- `DELETE /api/bookings/:id` - Cancel booking

### Profile (requires auth)

- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/profile` - Delete account

## Example Requests

Register:

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123!"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123!"}'
```

Create booking (requires token from login):

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"event_id": 1, "tickets": [{"ticket_id": 1, "quantity": 2}]}'
```

## Project Structure

```
lokaverkefni/
├── src/
│   ├── config/
│   │   └── db.ts           # Database connection
│   ├── controllers/        # Request handlers
│   ├── models/             # Database queries
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, validation, errors
│   ├── schemas/            # Zod validation
│   ├── utils/              # JWT helpers
│   ├── app.ts              # Express setup
│   └── server.ts           # Entry point
├── tests/                  # Integration tests
├── sql/
│   └── db-seed-data.sql    # Schema and seed data
├── .env                    # Config (create this)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Business Logic

**Ticket Availability:**
- Real-time tracking prevents overbooking
- Cancelled bookings return tickets to the pool

**Cancellation Policy:**
- Bookings can only be cancelled 24+ hours before the event
- Automatic ticket availability updates

**Security:**
- Bcrypt password hashing
- JWT authentication
- Input validation with Zod
- Parameterized queries (SQL injection prevention)

## Troubleshooting

**Can't connect to database?**
- Check PostgreSQL is running
- Verify credentials in `.env`

**Tests failing?**
- Make sure `tix_test_data` database exists
- Only the database needs to exist; schema is auto-created

**Port 3000 in use?**
- Change `PORT` in `.env`
