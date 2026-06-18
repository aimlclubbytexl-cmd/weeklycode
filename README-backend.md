# Backend for Weekly Coding Challenge Platform

This backend is a simple Express server with mock data stored in `server/data.json`.

## Install

```bash
cd server
npm install
```

## Start

```bash
cd server
npm start
```

## API Endpoints

- `POST /login` — body: `{ email, password }`
- `GET /challenges`
- `GET /challenges/:id`
- `GET /submissions`
- `GET /forum`
- `POST /forum`
- `POST /submissions/:id`
- `GET /announcements`
- `GET /users`
- `POST /submit`

## Admin login

Use `admin@platform.com` / `password` unless a Neon database is configured with its own admin credentials.

## Neon database support

To use Neon for user management, set one of these environment variables:

- `NEON_DATABASE_URL`
- `DATABASE_URL`

### Setup

1. Copy `.env.example` to `.env` and add your Neon connection string:

```bash
cp .env.example .env
```

2. Edit `.env`:
```env
NEON_DATABASE_URL=postgresql://user:password@host/database
```

3. Run the migration to create tables and seed default users:

```bash
npm run migrate
```

4. Start the backend:

```bash
npm start
```

### Default test users (after migration)

- **Admin**: `admin@platform.com` / `admin123`
- **Student**: `alex@university.edu` / `password`

### Password security

Passwords are hashed with bcrypt (10 salt rounds) when stored in Neon.
When using mock data (`data.json`), passwords are plaintext for demo purposes.
