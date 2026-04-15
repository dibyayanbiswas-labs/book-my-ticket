# Book My Ticket

A RESTful ticket/seat booking application built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**. Users can register, log in, browse available seats, and book them — with JWT-based authentication and refresh token support.

---

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Runtime      | Node.js (ESM)                           |
| Framework    | Express 5                               |
| Language     | TypeScript                              |
| ORM          | Prisma 7 (PostgreSQL adapter)           |
| Database     | PostgreSQL 17                           |
| Auth         | JWT (access + refresh tokens via cookies) |
| Validation   | Zod                                     |
| Dev Tools    | tsx, nodemon, Docker Compose            |

---

## Project Structure

```
book-my-ticket/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Seat, Booking)
│   └── migrations/            # Prisma migration history
├── src/
│   ├── index.ts               # Entry point — creates HTTP server
│   └── app/
│       ├── index.ts           # Express app setup (middleware, routes)
│       ├── common/
│       │   ├── config/        # Prisma client & movie config
│       │   ├── middleware/    # Global error handler
│       │   └── utils/         # API response/error helpers, JWT utils
│       └── modules/
│           ├── auth/          # Register, login, refresh, logout, profile
│           ├── seats/         # List seats, book a seat, my bookings
│           └── healthcheck/   # Health check endpoint
├── public/                    # Static frontend (index.html + script.js)
├── docker-compose.yml         # PostgreSQL container setup
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) & Docker Compose (for the database)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd book-my-ticket
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=8080
DATABASE_URL=your_db_url
NODE_ENV=dev || prod || test

JWT_ACCESS_SECRET_KEY=your_access_secret_key
JWT_ACCESS_EXPIRES_IN=30m
JWT_REFRESH_SECRET_KEY=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=1d

CORS_ORIGIN=*

```

### 4. Start the database

```bash
docker compose up -d
```

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

The server will be available at `http://localhost:5000`.

---

## Available Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start dev server with hot-reload     |
| `npm run build` | Compile TypeScript to `dist/`      |
| `npm start`   | Run compiled production build        |

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Path        | Auth Required | Description              |
|--------|-------------|---------------|--------------------------|
| POST   | `/register` | ❌            | Register a new user      |
| POST   | `/login`    | ❌            | Log in, receive tokens   |
| POST   | `/refresh`  | ❌            | Refresh access token     |
| GET    | `/profile`  | ✅            | Get current user profile |
| POST   | `/logout`   | ✅            | Log out, clear tokens    |

### Seats — `/api/v1/seats`

| Method | Path                | Auth Required | Description              |
|--------|---------------------|---------------|--------------------------|
| GET    | `/`                 | ❌            | List all seats           |
| POST   | `/book/:seatId`     | ✅            | Book a seat by ID        |
| GET    | `/my-bookings`      | ✅            | Get current user bookings |

### Health Check — `/api/v1/healthcheck`

| Method | Path | Auth Required | Description        |
|--------|------|---------------|--------------------|
| GET    | `/`  | ❌            | Server health check |

---

## Database Schema

```
User       — id, username (unique), email (unique), password, salt, refreshToken, createdAt
Seat       — id, username, isBooked, bookings[]
Booking    — id, userId, seatId (unique), bookedAt
```

---

## Docker

The `docker-compose.yml` spins up a PostgreSQL 17 container with persistent storage:

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Stop and remove volumes (wipes DB)
docker compose down -v
```

---

## Authentication

Authentication uses **JWT** with two tokens:

- **Access token** — short-lived (15 min), sent as an HTTP-only cookie
- **Refresh token** — long-lived (7 days), stored in DB and sent as an HTTP-only cookie

Protected routes require a valid access token, validated via the `authenticate` middleware.

---

## License

MIT