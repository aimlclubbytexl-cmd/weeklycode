import { User, Challenge, Submission, ForumPost, Announcement } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function handleResponse(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || 'API request failed');
  }
  return body;
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function getChallenges(): Promise<Challenge[]> {
  const response = await fetch(`${API_BASE}/challenges`);
  return handleResponse(response);
}

export async function getChallenge(id: string): Promise<Challenge> {
  const response = await fetch(`${API_BASE}/challenges/${id}`);
  return handleResponse(response);
}

export async function getSubmissions(): Promise<Submission[]> {
  const response = await fetch(`${API_BASE}/submissions`);
  return handleResponse(response);
}

export async function getForumPosts(): Promise<ForumPost[]> {
  const response = await fetch(`${API_BASE}/forum`);
  return handleResponse(response);
}

export async function createForumPost(post: Omit<ForumPost, 'id' | 'timestamp' | 'replies'>): Promise<ForumPost> {
  const response = await fetch(`${API_BASE}/forum`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return handleResponse(response);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(`${API_BASE}/announcements`);
  return handleResponse(response);
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`);
  return handleResponse(response);
}

export async function submitSolution(submission: Omit<Submission, 'id' | 'submittedAt'>): Promise<Submission> {
  const response = await fetch(`${API_BASE}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });
  return handleResponse(response);
}

export async function updateSubmissionStatus(id: string, status: Submission['status']): Promise<Submission> {
  const response = await fetch(`${API_BASE}/submissions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}
