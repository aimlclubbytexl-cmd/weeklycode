import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Flame, 
  TrendingUp 
} from 'lucide-react';
import { getChallenges } from '../api';
import { Challenge, User } from '../types';

export const Dashboard: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = useMemo<User | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') ?? 'null');
    } catch {
      return null;
    }
  }, []);

  const activeChallenge = challenges.find((c) => c.status === 'active');
  const completedChallenges = challenges.filter((c) => c.status === 'completed');

  useEffect(() => {
    async function loadChallenges() {
      setLoading(true);
      setError('');
      try {
        const data = await getChallenges();
        setChallenges(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenges');
      } finally {
        setLoading(false);
      }
    }

    loadChallenges();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Current Streak</p>
            <p className="text-2xl font-bold text-slate-900">{user?.streak ?? 0} Days</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Points</p>
            <p className="text-2xl font-bold text-slate-900">{user?.points ?? 0} pts</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Global Rank</p>
            <p className="text-2xl font-bold text-slate-900">#{user ? Math.max(1, Math.floor(1000 - user.points / 10)) : 0}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading dashboard...</div>
      ) : (
        <>
          {activeChallenge ? (
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-100 mb-4">
                  <Clock size={18} />
                  <span className="text-sm font-medium uppercase tracking-wider">Active Challenge</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">{activeChallenge.title}</h2>
                <p className="text-indigo-100 text-lg max-w-2xl mb-8">
                  {activeChallenge.description}
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/50 rounded-full text-sm">
                    <Trophy size={16} />
                    <span>{activeChallenge.points} Points</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/50 rounded-full text-sm">
                    <Calendar size={16} />
                    <span>Deadline: {new Date(activeChallenge.deadline).toLocaleDateString()}</span>
                  </div>
                  <Link 
                    to={`/challenges/${activeChallenge.id}`}
                    className="ml-auto flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                  >
                    Solve Now
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-400 rounded-full opacity-30 blur-2xl"></div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
              <h2 className="text-2xl font-bold mb-3">No active challenge available</h2>
              <p className="text-slate-500">Check the challenge list to start solving the next problem.</p>
              <Link to="/challenges" className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
                Browse challenges
              </Link>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Your Activity</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{challenge.title}</h4>
                      <p className="text-sm text-slate-500">{challenge.category} • Completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">+{challenge.points}</p>
                    <p className="text-xs text-slate-400">Points earned</p>
                  </div>
                </div>
              ))}
              {completedChallenges.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500">
                  No completed challenges yet. Start your first one!
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
