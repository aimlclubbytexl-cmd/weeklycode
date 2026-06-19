# Backend / API for Weekly Coding Challenge Platform

This project uses a Vercel serverless API located in `api/[...slug].js`.
There is no separate Express `server/` folder in the current codebase.

## Local development

Install dependencies and run the frontend:

```bash
npm install
npm run dev
```

If you want to run the serverless function locally, use the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

## API Endpoints

- `POST /api/login` — body: `{ email, password }`
- `GET /api/challenges`
- `GET /api/challenges/:id`
- `GET /api/submissions`
- `GET /api/forum`
- `POST /api/forum`
- `PUT /api/submissions/:id`
- `GET /api/announcements`
- `GET /api/users`
- `POST /api/submit`

## Admin login

Use `admin@platform.com` / `password` unless a Neon database is configured with its own admin credentials.

## Neon database support

The serverless API supports Neon/PostgreSQL when one of these environment variables is set:

- `NEON_DATABASE_URL`
- `DATABASE_URL`

When a database is not configured, the API falls back to mock data in `api/data.json`.

### Example environment

Create `.env` and set:

```env
NEON_DATABASE_URL=postgresql://user:password@host/database
```

### Notes

- The API is deployed as a Vercel serverless function.
- Mock data lives in `api/data.json`.
- Passwords stored in mock data are plaintext for demo purposes.
