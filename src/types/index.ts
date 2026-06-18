export interface User {
  id: string;
  username: string;
  email: string;
  university: string;
  points: number;
  streak: number;
  role: 'student' | 'admin';
  avatar?: string;
  badges: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  sampleInput: string;
  sampleOutput: string;
  deadline: string;
  points: number;
  status: 'active' | 'completed' | 'scheduled';
  category: string;
}

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  githubLink: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'plagiarized';
  score: number;
  remarks?: string;
  language: string;
}

export interface ForumPost {
  id: string;
  challengeId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies: ForumReply[];
  type: 'question' | 'discussion' | 'comment';
}

export interface ForumReply {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'update' | 'event' | 'winner';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}
