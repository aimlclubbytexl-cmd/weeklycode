import { User, Challenge, Submission, ForumPost, Announcement, Badge } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'AlexCode',
    email: 'alex@university.edu',
    university: 'Tech University',
    points: 1250,
    streak: 5,
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    badges: ['first-blood', 'consistency', 'polyglot', 'bug-hunter'],
  },
  {
    id: 'u2',
    username: 'SarahDev',
    email: 'sarah@university.edu',
    university: 'State College',
    points: 1100,
    streak: 3,
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    badges: ['first-blood', 'consistency'],
  },
  {
    id: 'u3',
    username: 'Admin',
    email: 'admin@weeklycode.com',
    university: 'Global Academy',
    points: 0,
    streak: 0,
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    badges: [],
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Optimal Path Finder',
    description: 'Find the shortest path between two nodes in a weighted graph with constraints on the maximum number of edges used.',
    constraints: [
      'Number of nodes N <= 10^5',
      'Number of edges M <= 2*10^5',
      'Weights are positive integers',
    ],
    sampleInput: '4 4\n1 2 10\n2 3 5\n1 3 20\n3 4 2\n1 4',
    sampleOutput: '17',
    deadline: '2026-12-31T23:59:59Z',
    points: 100,
    status: 'active',
    category: 'Graphs',
  },
  {
    id: 'c2',
    title: 'String Compression Pro',
    description: 'Implement a custom compression algorithm that reduces space by 30% while maintaining O(n) time complexity for decompression.',
    constraints: [
      'String length up to 10^6 characters',
      'Charset: ASCII',
    ],
    sampleInput: 'aaabbccccd',
    sampleOutput: 'a3b2c4d1',
    deadline: '2026-12-20T23:59:59Z',
    points: 50,
    status: 'completed',
    category: 'Strings',
  },
  {
    id: 'c3',
    title: 'Quantum Sorting',
    description: 'Sort a list of floating point numbers with extreme precision using a modified mergesort approach.',
    constraints: [
      'Precision up to 15 decimal places',
      'List size up to 10^5',
    ],
    sampleInput: '3.14, 1.59, 2.65, 0.58',
    sampleOutput: '0.58, 1.59, 2.65, 3.14',
    deadline: '2027-01-05T23:59:59Z',
    points: 150,
    status: 'scheduled',
    category: 'Sorting',
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    challengeId: 'c1',
    userId: 'u1',
    githubLink: 'https://github.com/AlexCode/optimal-path',
    submittedAt: '2026-12-25T10:00:00Z',
    status: 'accepted',
    score: 100,
    remarks: 'Perfect implementation of Dijkstra.',
    language: 'Python',
  },
  {
    id: 's2',
    challengeId: 'c1',
    userId: 'u2',
    githubLink: 'https://github.com/SarahDev/path-finder',
    submittedAt: '2026-12-25T11:00:00Z',
    status: 'pending',
    score: 0,
    remarks: '',
    language: 'C++',
  },
  {
    id: 's3',
    challengeId: 'c2',
    userId: 'u1',
    githubLink: 'https://github.com/AlexCode/string-compress',
    submittedAt: '2026-12-18T15:00:00Z',
    status: 'accepted',
    score: 50,
    remarks: 'Efficient approach.',
    language: 'Java',
  },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'f1',
    challengeId: 'c1',
    userId: 'u2',
    username: 'SarahDev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'Can someone explain how to implement the Dijkstra variant here? I keep getting a timeout.',
    timestamp: '2026-12-26T09:20:00Z',
    type: 'question',
    replies: [
      {
        id: 'r1',
        userId: 'u1',
        username: 'AlexCode',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        content: 'You can optimize it by using a priority queue and avoiding revisiting visited nodes.',
        timestamp: '2026-12-26T10:00:00Z',
      },
    ],
  },
  {
    id: 'f2',
    challengeId: 'c1',
    userId: 'u1',
    username: 'AlexCode',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: 'Has anyone tried using Fibonacci heap for this challenge? It passed the sample tests.',
    timestamp: '2026-12-25T18:00:00Z',
    type: 'discussion',
    replies: [],
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'December Challenge Winner Announced!',
    content: 'Congratulations to AlexCode for solving the Optimal Path Finder challenge with a perfect score!',
    date: '2026-12-26T12:00:00Z',
    type: 'winner',
  },
  {
    id: 'a2',
    title: 'Weekly Update: New Challenge Released',
    content: 'Quantum Sorting challenge is now available. The deadline is January 5th. Good luck!',
    date: '2026-12-26T08:00:00Z',
    type: 'update',
  },
  {
    id: 'a3',
    title: 'Live Q&A Session This Friday',
    content: 'Join us on Friday at 5PM for a live discussion on graph algorithms with our mentors.',
    date: '2026-12-25T14:00:00Z',
    type: 'event',
  },
];

export const ALL_BADGES: Badge[] = [
  { id: 'first-blood', name: 'First Blood', description: 'Completed your first challenge', icon: '🔥', earned: true },
  { id: 'consistency', name: 'Consistency', description: '7-day streak', icon: '📅', earned: true },
  { id: 'polyglot', name: 'Polyglot', description: 'Submitted solutions in 3+ languages', icon: '🌐', earned: true },
  { id: 'bug-hunter', name: 'Bug Hunter', description: 'Found 5+ edge cases', icon: '🐞', earned: true },
  { id: 'top-performer', name: 'Top Performer', description: 'Ranked top 10 globally', icon: '🏆', earned: false },
  { id: 'speedster', name: 'Speedster', description: 'Solved a challenge in under 1 hour', icon: '⚡', earned: false },
];
