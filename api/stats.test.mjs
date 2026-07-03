import assert from 'node:assert/strict';
import { buildUserStatsAfterSubmission } from './stats.js';

const cases = [
  {
    name: 'awards points and increments streak once on first acceptance',
    input: {
      previousStatus: 'pending',
      nextStatus: 'accepted',
      challengePoints: 100,
      currentPoints: 50,
      currentStreak: 2,
    },
    expected: { points: 150, streak: 3, awardedPoints: 100, streakUpdated: true },
  },
  {
    name: 'does not award again for already accepted submissions',
    input: {
      previousStatus: 'accepted',
      nextStatus: 'accepted',
      challengePoints: 100,
      currentPoints: 50,
      currentStreak: 2,
    },
    expected: { points: 50, streak: 2, awardedPoints: 0, streakUpdated: false },
  },
  {
    name: 'does not award for rejected submissions',
    input: {
      previousStatus: 'pending',
      nextStatus: 'rejected',
      challengePoints: 100,
      currentPoints: 50,
      currentStreak: 2,
    },
    expected: { points: 50, streak: 2, awardedPoints: 0, streakUpdated: false },
  },
];

for (const testCase of cases) {
  const actual = buildUserStatsAfterSubmission(testCase.input);
  assert.deepEqual(actual, testCase.expected, testCase.name);
}

console.log('stats tests passed');
