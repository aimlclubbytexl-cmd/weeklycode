import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;

const DB_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
const pool = DB_URL ? new Pool({ connectionString: DB_URL }) : null;

app.use(cors());
app.use(express.json());

const DATA_PATH = join(__dirname, 'data.json');

async function readData() {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function getDbUserByEmail(email) {
  if (!pool) return null;
  const result = await pool.query(
    `SELECT id, username, email, university, points, streak, role, avatar, badges, password
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );
  if (result.rowCount === 0) return null;
  const user = result.rows[0];
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    university: user.university,
    points: user.points,
    streak: user.streak,
    role: user.role,
    avatar: user.avatar,
    badges: Array.isArray(user.badges) ? user.badges : JSON.parse(user.badges || '[]'),
    password: user.password,
  };
}

async function getDbUsers() {
  if (!pool) return null;
  const result = await pool.query(
    `SELECT id, username, email, university, points, streak, role, avatar, badges
     FROM users`
  );
  return result.rows.map((user) => ({
    ...user,
    badges: Array.isArray(user.badges) ? user.badges : JSON.parse(user.badges || '[]'),
  }));
}

async function getDbChallenges() {
  if (!pool) return null;
  const result = await pool.query(
    `SELECT id, title, description, constraints, sample_input, sample_output, deadline, points, status, category
     FROM challenges`
  );
  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    constraints: Array.isArray(row.constraints) ? row.constraints : JSON.parse(row.constraints || '[]'),
    sampleInput: row.sample_input,
    sampleOutput: row.sample_output,
    deadline: row.deadline,
    points: row.points,
    status: row.status,
    category: row.category,
  }));
}

async function getDbSubmissions() {
  if (!pool) return null;
  const result = await pool.query(
    `SELECT id, challenge_id, user_id, github_link, submitted_at, status, score, remarks, language
     FROM submissions`
  );
  return result.rows.map((row) => ({
    id: row.id,
    challengeId: row.challenge_id,
    userId: row.user_id,
    githubLink: row.github_link,
    submittedAt: row.submitted_at,
    status: row.status,
    score: row.score,
    remarks: row.remarks,
    language: row.language,
  }));
}

async function getDbChallengeById(id) {
  if (!pool) return null;
  const result = await pool.query(
    `SELECT id, title, description, constraints, sample_input, sample_output, deadline, points, status, category
     FROM challenges
     WHERE id = $1
     LIMIT 1`,
    [id]
  );
  if (result.rowCount === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    constraints: Array.isArray(row.constraints) ? row.constraints : JSON.parse(row.constraints || '[]'),
    sampleInput: row.sample_input,
    sampleOutput: row.sample_output,
    deadline: row.deadline,
    points: row.points,
    status: row.status,
    category: row.category,
  };
}

async function createDbChallenge(challenge) {
  if (!pool) return null;
  const id = `c_${Date.now()}`;
  const result = await pool.query(
    `INSERT INTO challenges (id, title, description, constraints, sample_input, sample_output, deadline, points, status, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, title, description, constraints, sample_input, sample_output, deadline, points, status, category`,
    [
      id,
      challenge.title,
      challenge.description,
      JSON.stringify(challenge.constraints || []),
      challenge.sampleInput || '',
      challenge.sampleOutput || '',
      challenge.deadline,
      challenge.points,
      challenge.status,
      challenge.category,
    ]
  );
  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    constraints: Array.isArray(row.constraints) ? row.constraints : JSON.parse(row.constraints || '[]'),
    sampleInput: row.sample_input,
    sampleOutput: row.sample_output,
    deadline: row.deadline,
    points: row.points,
    status: row.status,
    category: row.category,
  };
}

async function deleteDbChallenge(id) {
  if (!pool) return null;
  const result = await pool.query(
    `DELETE FROM challenges WHERE id = $1 RETURNING id, title`,
    [id]
  );
  return result.rowCount ? result.rows[0] : null;
}

async function createDbSubmission(submission) {
  if (!pool) return null;
  const id = `s_${Date.now()}`;
  const result = await pool.query(
    `INSERT INTO submissions (id, challenge_id, user_id, github_link, submitted_at, status, score, remarks, language)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, challenge_id, user_id, github_link, submitted_at, status, score, remarks, language`,
    [
      id,
      submission.challengeId,
      submission.userId,
      submission.githubLink,
      submission.submittedAt,
      submission.status,
      submission.score,
      submission.remarks || '',
      submission.language,
    ]
  );
  const row = result.rows[0];
  return {
    id: row.id,
    challengeId: row.challenge_id,
    userId: row.user_id,
    githubLink: row.github_link,
    submittedAt: row.submitted_at,
    status: row.status,
    score: row.score,
    remarks: row.remarks,
    language: row.language,
  };
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (pool) {
    const dbUser = await getDbUserByEmail(normalizedEmail);
    if (!dbUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _pwd, ...userWithoutPassword } = dbUser;
    return res.json(userWithoutPassword);
  }

  const data = await readData();
  const user = data.users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isAdmin = user.role === 'admin';
  const validPassword = isAdmin ? password === 'admin123' : password === 'password';

  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json(user);
});

app.post('/signup', async (req, res) => {
  const { email, password, username, university } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail || !password || !username || !university) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  if (pool) {
    const existingUser = await getDbUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `u_${Date.now()}`;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    try {
      await pool.query(
        `INSERT INTO users (id, username, email, password, university, points, streak, role, avatar, badges)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [userId, username, normalizedEmail, hashedPassword, university, 0, 0, 'student', avatar, JSON.stringify([])]
      );

      return res.json({
        id: userId,
        username,
        email: normalizedEmail,
        university,
        points: 0,
        streak: 0,
        role: 'student',
        avatar,
        badges: [],
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ message: 'Email already registered' });
      }
      throw err;
    }
  }

  const data = await readData();
  const userExists = data.users.some((u) => u.email === normalizedEmail);

  if (userExists) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const userId = `u_${Date.now()}`;
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  const newUser = {
    id: userId,
    username,
    email: normalizedEmail,
    university,
    points: 0,
    streak: 0,
    role: 'student',
    avatar,
    badges: [],
  };

  data.users.push(newUser);
  await writeData(data);

  res.json(newUser);
});

app.get('/challenges', async (req, res) => {
  if (pool) {
    const challenges = await getDbChallenges();
    if (challenges) return res.json(challenges);
  }

  const data = await readData();
  res.json(data.challenges);
});

app.get('/challenges/:id', async (req, res) => {
  if (pool) {
    const result = await pool.query(
      `SELECT id, title, description, constraints, sample_input, sample_output, deadline, points, status, category
       FROM challenges
       WHERE id = $1
       LIMIT 1`,
      [req.params.id]
    );

    if (result.rowCount > 0) {
      const row = result.rows[0];
      return res.json({
        id: row.id,
        title: row.title,
        description: row.description,
        constraints: Array.isArray(row.constraints) ? row.constraints : JSON.parse(row.constraints || '[]'),
        sampleInput: row.sample_input,
        sampleOutput: row.sample_output,
        deadline: row.deadline,
        points: row.points,
        status: row.status,
        category: row.category,
      });
    }
  }

  const data = await readData();
  const challenge = data.challenges.find((c) => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ message: 'Not found' });
  res.json(challenge);
});

app.get('/submissions', async (req, res) => {
  if (pool) {
    const submissions = await getDbSubmissions();
    if (submissions) return res.json(submissions);
  }

  const data = await readData();
  res.json(data.submissions);
});

app.post('/submissions/:id', async (req, res) => {
  const { status } = req.body;

  if (pool) {
    const result = await pool.query(
      `UPDATE submissions SET status = $1 WHERE id = $2 RETURNING id, challenge_id, user_id, github_link, submitted_at, status, score, remarks, language`,
      [status, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const row = result.rows[0];
    return res.json({
      id: row.id,
      challengeId: row.challenge_id,
      userId: row.user_id,
      githubLink: row.github_link,
      submittedAt: row.submitted_at,
      status: row.status,
      score: row.score,
      remarks: row.remarks,
      language: row.language,
    });
  }

  const data = await readData();
  const submission = data.submissions.find((s) => s.id === req.params.id);

  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  if (status) submission.status = status;

  await writeData(data);
  res.json(submission);
});

app.get('/forum', async (req, res) => {
  const data = await readData();
  res.json(data.forumPosts);
});

app.post('/forum', async (req, res) => {
  const data = await readData();
  const payload = req.body;
  const forumPost = {
    id: `f${data.forumPosts.length + 1}`,
    ...payload,
    timestamp: new Date().toISOString(),
    replies: [],
  };
  data.forumPosts.unshift(forumPost);
  await writeData(data);
  res.status(201).json(forumPost);
});

app.get('/announcements', async (req, res) => {
  const data = await readData();
  res.json(data.announcements);
});

app.get('/users', async (req, res) => {
  if (pool) {
    const users = await getDbUsers();
    return res.json(users);
  }

  const data = await readData();
  res.json(data.users);
});

app.post('/submit', async (req, res) => {
  const payload = req.body;
  const submission = {
    id: `s${Date.now()}`,
    ...payload,
    submittedAt: new Date().toISOString(),
  };

  if (pool) {
    try {
      const dbSubmission = await createDbSubmission(submission);
      return res.status(201).json(dbSubmission);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save submission' });
    }
  }

  const data = await readData();
  data.submissions.push(submission);
  await writeData(data);
  res.status(201).json(submission);
});

app.post('/challenges', async (req, res) => {
  const { title, description, constraints, sampleInput, sampleOutput, points, category, deadline, status } = req.body;

  if (!title || !description || !points || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (pool) {
    try {
      const created = await createDbChallenge({
        title,
        description,
        constraints: constraints || [],
        sampleInput: sampleInput || '',
        sampleOutput: sampleOutput || '',
        points,
        category,
        deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: status || 'active',
      });
      return res.status(201).json(created);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save challenge' });
    }
  }

  const data = await readData();
  const newChallenge = {
    id: `c${data.challenges.length + 1}`,
    title,
    description,
    constraints: constraints || [],
    sampleInput: sampleInput || '',
    sampleOutput: sampleOutput || '',
    points,
    category,
    deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: status || 'active',
  };

  data.challenges.push(newChallenge);
  await writeData(data);
  res.status(201).json(newChallenge);
});

app.delete('/challenges/:id', async (req, res) => {
  if (pool) {
    const deleted = await deleteDbChallenge(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    return res.json({ message: 'Challenge deleted', challenge: deleted });
  }

  const data = await readData();
  const index = data.challenges.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  const deletedChallenge = data.challenges.splice(index, 1);
  await writeData(data);
  res.json({ message: 'Challenge deleted', challenge: deletedChallenge[0] });
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  if (pool) {
    try {
      const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result.rows[0];
      if (user.role === 'admin') {
        return res.status(403).json({ message: 'Cannot delete admin users' });
      }

      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      return res.json({ message: 'User deleted' });
    } catch (err) {
      return res.status(500).json({ message: 'Database error' });
    }
  }

  const data = await readData();
  const index = data.users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = data.users[index];
  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Cannot delete admin users' });
  }

  data.users.splice(index, 1);
  await writeData(data);
  res.json({ message: 'User deleted' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
