import React from 'react';
import { Award, Flame, Trophy, Star } from 'lucide-react';
import { User } from '../types';
import { ALL_BADGES, MOCK_SUBMISSIONS, MOCK_CHALLENGES } from '../mockData';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const userSubmissions = MOCK_SUBMISSIONS.filter(s => s.userId === user.id);
  const earnedBadges = ALL_BADGES.filter(b => user.badges.includes(b.id));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-10 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
        <img src={user.avatar} alt={user.username} className="w-28 h-28 rounded-full border-8 border-indigo-100" />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-slate-900">{user.username}</h1>
          <p className="text-slate-500 mt-1">{user.email} • {user.university}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
            <div className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium flex items-center gap-2">
              <Trophy size={14} /> {user.points} Points
            </div>
            <div className="px-4 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium flex items-center gap-2">
              <Flame size={14} /> {user.streak} Day Streak
            </div>
            <div className="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
              Rank #42
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-7">
          <div className="flex items-center gap-2 text-lg font-bold mb-5">
            <Award className="text-indigo-600" /> Your Badges
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.length > 0 ? earnedBadges.map(badge => (
              <div key={badge.id} className="border rounded-2xl p-4 bg-indigo-50/40 flex gap-3">
                <div className="text-2xl">{badge.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{badge.name}</p>
                  <p className="text-xs text-slate-500">{badge.description}</p>
                </div>
              </div>
            )) : <p className="text-slate-500">No badges earned yet.</p>}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-3xl border border-slate-200 p-7">
          <div className="font-bold mb-4 flex items-center gap-2"><Star className="text-indigo-600" /> Quick Stats</div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-3"><span className="text-slate-500">Challenges Solved</span> <span className="font-semibold">{userSubmissions.length}</span></div>
            <div className="flex justify-between border-b pb-3"><span className="text-slate-500">Avg Score</span> <span className="font-semibold">{userSubmissions.length > 0 ? Math.round(userSubmissions.reduce((acc, s) => acc + s.score, 0) / userSubmissions.length) : 0}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Current Rank</span> <span className="font-semibold">#42</span></div>
          </div>
        </div>
      </div>

      {/* Submission History */}
      <div>
        <div className="flex justify-between mb-3 px-1">
          <h2 className="font-bold text-xl">Submission History</h2>
          <a href="/history" className="text-sm text-indigo-600 hover:underline">View All →</a>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left border-b">
                <th className="pl-7 py-3 font-semibold text-slate-500">Challenge</th>
                <th className="py-3 font-semibold text-slate-500">Language</th>
                <th className="py-3 font-semibold text-slate-500">Score</th>
                <th className="py-3 font-semibold text-slate-500">Status</th>
                <th className="pr-7 py-3 font-semibold text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {userSubmissions.map(sub => {
                const ch = MOCK_CHALLENGES.find(c => c.id === sub.challengeId);
                return (
                  <tr key={sub.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="pl-7 py-4 font-medium">{ch?.title}</td>
                    <td className="py-4">{sub.language}</td>
                    <td className="py-4 font-semibold text-indigo-600">{sub.score}</td>
                    <td className="py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${sub.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="pr-7 py-4 text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
