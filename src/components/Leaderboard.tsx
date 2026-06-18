import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Flame } from 'lucide-react';
import { getUsers } from '../api';
import { User } from '../types';

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError('');
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-4 bg-indigo-100 text-indigo-600 rounded-full mb-2">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Hall of Fame</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Celebrating the best coding talents. Keep solving challenges to climb the ranks!
        </p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading leaderboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
            {[0, 1, 2].map((index) => {
              const user = sortedUsers[index];
              const positionLabels = ['#1', '#2', '#3'];
              const size = index === 0 ? 'w-28 h-28' : 'w-20 h-20';
              const borderStyle = index === 0 ? 'border-4 border-indigo-500 shadow-xl' : 'border-2 border-slate-100 shadow-sm';
              return (
                <div key={index} className="flex flex-col items-center p-6 bg-white rounded-3xl hover:border-slate-200 transition-all group">
                  {user ? (
                    <>
                      <div className="relative">
                        <img src={user.avatar} alt={user.username} className={`${size} rounded-full ${borderStyle} mb-4 group-hover:scale-105 transition-transform`} />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 px-2 py-1 rounded-md text-xs font-bold">
                          {positionLabels[index]}
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{user.username}</h3>
                      <p className="text-slate-500 text-sm mb-4">{user.university}</p>
                      <div className="text-2xl font-black text-indigo-600">{user.points} pts</div>
                    </>
                  ) : (
                    <div className="text-slate-400 text-sm">No user</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${index === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                        <span className="font-semibold text-slate-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{user.university}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{user.points}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-orange-500 font-medium">
                        <Flame size={14} />
                        {user.streak}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
