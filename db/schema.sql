-- Schema for challenges and submissions, backing the API in api/index.js.
-- Column names match exactly what the SQL queries in api/index.js expect.

CREATE TABLE IF NOT EXISTS challenges (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  constraints   JSONB NOT NULL DEFAULT '[]'::jsonb,
  sample_input  TEXT NOT NULL DEFAULT '',
  sample_output TEXT NOT NULL DEFAULT '',
  deadline      TIMESTAMPTZ,
  points        INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'active',
  category      TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS submissions (
  id           TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL,
  github_link  TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status       TEXT NOT NULL DEFAULT 'pending',
  score        INTEGER,
  remarks      TEXT NOT NULL DEFAULT '',
  language     TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);

-- Seed: existing challenge from api/data.json (no-op if it already exists).
INSERT INTO challenges (id, title, description, constraints, sample_input, sample_output, deadline, points, status, category)
VALUES (
  'c2',
  'ad',
  'ajja',
  '["ajja","ajja"]'::jsonb,
  'ajja',
  'ama',
  '2026-07-18T00:00:00.000Z',
  100,
  'active',
  'Arrays'
)
ON CONFLICT (id) DO NOTHING;
