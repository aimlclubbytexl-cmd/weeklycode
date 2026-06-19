import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, 'data.json');
const DB_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
let pool = null;
if (DB_URL) {
  try {
    pool = new Pool({ connectionString: DB_URL });
  } catch (error) {
    console.error('Failed to initialize DB pool:', error);
    pool = null;
  }
}

const sendJson = (res, data, status = 200) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const getRequestPath = (req) => {
  const url = req.url || '';
  const path = url.split('?')[0];
  if (path.startsWith('/api')) {
    const trimmed = path.replace(/^\/api/, '') || '/';
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
  return path || '/';
};

const readData = async () => {
  const file = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(file);
};

const writeData = async (data) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

const parseJsonBody = async (req) => {
  if (req.method === 'GET' || req.method === 'DELETE') return {};
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
};

const getDbUserByEmail = async (email) => {
  if (!pool) return null;
  try {
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
  } catch (error) {
    console.error('DB get user by email failed:', error);
    return null;
  }
};

const getDbUsers = async () => {
  if (!pool) return null;
  try {
    const result = await pool.query(
      `SELECT id, username, email, university, points, streak, role, avatar, badges
       FROM users`
    );
    return result.rows.map((user) => ({
      ...user,
      badges: Array.isArray(user.badges) ? user.badges : JSON.parse(user.badges || '[]'),
    }));
  } catch (error) {
    console.error('DB get users failed:', error);
    return null;
  }
};

const getDbChallenges = async () => {
  if (!pool) return null;
  try {
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
  } catch (error) {
    console.error('DB get challenges failed:', error);
    return null;
  }
};

const getDbChallengeById = async (id) => {
  if (!pool) return null;
  try {
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
  } catch (error) {
    console.error('DB get challenge by id failed:', error);
    return null;
  }
};

const getDbSubmissions = async () => {
  if (!pool) return null;
  try {
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
  } catch (error) {
    console.error('DB submissions query failed:', error);
    return null;
  }
};
const createDbChallenge = async (challenge) => {
  if (!pool) return null;
  try {
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
  } catch (error) {
    console.error('DB create challenge failed:', error);
    return null;
  }
};

const deleteDbChallenge = async (id) => {
  if (!pool) return null;
  try {
    const result = await pool.query(`DELETE FROM challenges WHERE id = $1 RETURNING id, title`, [id]);
    return result.rowCount ? result.rows[0] : null;
  } catch (error) {
    console.error('DB delete challenge failed:', error);
    return null;
  }
};

const createDbSubmission = async (submission) => {
  if (!pool) return null;
  try {
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
  } catch (error) {
    console.error('DB create submission failed:', error);
    return null;
  }
};

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return sendJson(res, { message: 'OK' }, 200);
  }

  const route = getRequestPath(req);
  const body = await parseJsonBody(req).catch((error) => {
    sendJson(res, { message: 'Invalid JSON body' }, 400);
    return null;
  });
  if (body === null) return;
  console.log('[api] request', req.method, route, { bodyPreview: typeof body === 'object' ? Object.keys(body).slice(0,5) : String(body) });

  try {
    if (route === '/login' && req.method === 'POST') {
      const { email, password } = body;
      const normalizedEmail = String(email || '').trim().toLowerCase();

      if (pool) {
        const dbUser = await getDbUserByEmail(normalizedEmail);
        if (!dbUser) return sendJson(res, { message: 'Invalid credentials' }, 401);
        if (!dbUser.password) {
          console.error('DB user missing password field', { email: normalizedEmail, user: dbUser });
          return sendJson(res, { message: 'Invalid credentials' }, 401);
        }

        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) return sendJson(res, { message: 'Invalid credentials' }, 401);

        const { password: _pwd, ...userWithoutPassword } = dbUser;
        return sendJson(res, userWithoutPassword);
      }

      const data = await readData();
      const user = data.users.find((u) => u.email === normalizedEmail);
      if (!user) return sendJson(res, { message: 'Invalid credentials' }, 401);

      const isAdmin = user.role === 'admin';
      const validPassword = isAdmin ? password === 'admin123' : password === 'password';
      if (!validPassword) return sendJson(res, { message: 'Invalid credentials' }, 401);
      return sendJson(res, user);
    }

    if (route === '/signup' && req.method === 'POST') {
      const { email, password, username, university } = body;
      const normalizedEmail = String(email || '').trim().toLowerCase();

      if (!normalizedEmail || !password || !username || !university) {
        return sendJson(res, { message: 'All fields are required' }, 400);
      }
      if (password.length < 6) {
        return sendJson(res, { message: 'Password must be at least 6 characters' }, 400);
      }

      if (pool) {
        const existingUser = await getDbUserByEmail(normalizedEmail);
        if (existingUser) {
          return sendJson(res, { message: 'Email already registered' }, 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = `u_${Date.now()}`;
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        await pool.query(
          `INSERT INTO users (id, username, email, password, university, points, streak, role, avatar, badges)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [userId, username, normalizedEmail, hashedPassword, university, 0, 0, 'student', avatar, JSON.stringify([])]
        );

        return sendJson(res, {
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
      }

      const data = await readData();
      const userExists = data.users.some((u) => u.email === normalizedEmail);
      if (userExists) return sendJson(res, { message: 'Email already registered' }, 409);

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
      return sendJson(res, newUser);
    }

    if (route === '/challenges' && req.method === 'GET') {
      if (pool) {
        const challenges = await getDbChallenges();
        return sendJson(res, challenges || []);
      }
      const data = await readData();
      return sendJson(res, data.challenges);
    }

    if (route.startsWith('/challenges/') && req.method === 'GET') {
      const challengeId = route.split('/')[2];
      if (pool) {
        const challenge = await getDbChallengeById(challengeId);
        if (!challenge) return sendJson(res, { message: 'Not found' }, 404);
        return sendJson(res, challenge);
      }
      const data = await readData();
      const challenge = data.challenges.find((c) => c.id === challengeId);
      if (!challenge) return sendJson(res, { message: 'Not found' }, 404);
      return sendJson(res, challenge);
    }

    if (route === '/submissions' && req.method === 'GET') {
      if (pool) {
        const submissions = await getDbSubmissions();
        return sendJson(res, submissions || []);
      }
      const data = await readData();
      return sendJson(res, data.submissions);
    }

    if (route.startsWith('/submissions/') && (req.method === 'PATCH' || req.method === 'POST')) {
      const submissionId = route.split('/')[2];
      const { status } = body;
      if (pool) {
        const result = await pool.query(
          `UPDATE submissions SET status = $1 WHERE id = $2 RETURNING id, challenge_id, user_id, github_link, submitted_at, status, score, remarks, language`,
          [status, submissionId]
        );
        if (result.rowCount === 0) return sendJson(res, { message: 'Submission not found' }, 404);
        const row = result.rows[0];
        return sendJson(res, {
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
      const submission = data.submissions.find((s) => s.id === submissionId);
      if (!submission) return sendJson(res, { message: 'Submission not found' }, 404);
      if (status) submission.status = status;
      await writeData(data);
      return sendJson(res, submission);
    }

    if (route === '/forum' && req.method === 'GET') {
      const data = await readData();
      return sendJson(res, data.forumPosts);
    }

    if (route === '/forum' && req.method === 'POST') {
      const data = await readData();
      const payload = body;
      const forumPost = {
        id: `f${data.forumPosts.length + 1}`,
        ...payload,
        timestamp: new Date().toISOString(),
        replies: [],
      };
      data.forumPosts.unshift(forumPost);
      await writeData(data);
      return sendJson(res, forumPost, 201);
    }

    if (route === '/announcements' && req.method === 'GET') {
      const data = await readData();
      return sendJson(res, data.announcements);
    }

    if (route === '/users' && req.method === 'GET') {
      if (pool) {
        const users = await getDbUsers();
        return sendJson(res, users || []);
      }
      const data = await readData();
      return sendJson(res, data.users);
    }

    if (route === '/submit' && req.method === 'POST') {
      const payload = body;
      const submission = {
        id: `s${Date.now()}`,
        ...payload,
        submittedAt: new Date().toISOString(),
      };

      if (pool) {
        const dbSubmission = await createDbSubmission(submission);
        return sendJson(res, dbSubmission, 201);
      }
      const data = await readData();
      data.submissions.push(submission);
      await writeData(data);
      return sendJson(res, submission, 201);
    }

    if (route === '/challenges' && req.method === 'POST') {
      const { title, description, constraints, sampleInput, sampleOutput, points, category, deadline, status } = body;
      if (!title || !description || !points || !category) {
        return sendJson(res, { message: 'Missing required fields' }, 400);
      }
      if (pool) {
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
        return sendJson(res, created, 201);
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
      return sendJson(res, newChallenge, 201);
    }

    if (route.startsWith('/challenges/') && req.method === 'DELETE') {
      const challengeId = route.split('/')[2];
      if (pool) {
        const deleted = await deleteDbChallenge(challengeId);
        if (!deleted) return sendJson(res, { message: 'Challenge not found' }, 404);
        return sendJson(res, { message: 'Challenge deleted', challenge: deleted });
      }
      const data = await readData();
      const index = data.challenges.findIndex((c) => c.id === challengeId);
      if (index === -1) return sendJson(res, { message: 'Challenge not found' }, 404);
      const deletedChallenge = data.challenges.splice(index, 1);
      await writeData(data);
      return sendJson(res, { message: 'Challenge deleted', challenge: deletedChallenge[0] });
    }

    if (route.startsWith('/users/') && req.method === 'DELETE') {
      const userId = route.split('/')[2];
      if (pool) {
        const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
        if (result.rowCount === 0) return sendJson(res, { message: 'User not found' }, 404);
        if (result.rows[0].role === 'admin') return sendJson(res, { message: 'Cannot delete admin users' }, 403);
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        return sendJson(res, { message: 'User deleted' });
      }
      const data = await readData();
      const index = data.users.findIndex((u) => u.id === userId);
      if (index === -1) return sendJson(res, { message: 'User not found' }, 404);
      const user = data.users[index];
      if (user.role === 'admin') return sendJson(res, { message: 'Cannot delete admin users' }, 403);
      data.users.splice(index, 1);
      await writeData(data);
      return sendJson(res, { message: 'User deleted' });
    }

    sendJson(res, { message: 'Not found' }, 404);
  } catch (error) {
    console.error(error);
    sendJson(res, { message: 'Server error' }, 500);
  }
}
