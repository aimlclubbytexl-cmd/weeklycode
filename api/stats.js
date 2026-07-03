export function buildUserStatsAfterSubmission({ previousStatus, nextStatus, challengePoints, currentPoints, currentStreak }) {
  const awardedPoints = Number(challengePoints || 0);

  if (nextStatus !== 'accepted' || previousStatus === 'accepted') {
    return {
      points: Number(currentPoints || 0),
      streak: Number(currentStreak || 0),
      awardedPoints: 0,
      streakUpdated: false,
    };
  }

  return {
    points: Number(currentPoints || 0) + awardedPoints,
    streak: Number(currentStreak || 0) + 1,
    awardedPoints,
    streakUpdated: true,
  };
}
