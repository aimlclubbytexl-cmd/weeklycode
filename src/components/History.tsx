import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getChallenges, getSubmissions } from '../api';
import { Challenge, Submission, User } from '../types';

export const History: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'accepted' | 'pending' | 'rejected'>('all');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user: User | null = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') ?? 'null');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      setLoading(true);
      setError('');

      try {
        const [allSubmissions, allChallenges] = await Promise.all([getSubmissions(), getChallenges()]);
        setSubmissions(allSubmissions.filter((sub) => sub.userId === user.id));
        setChallenges(allChallenges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  const filtered = useMemo(
    () =>
      submissions.filter((s) => filter === 'all' || s.status === filter),
    [submissions, filter]
  );

  const getChallengeTitle = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    return challenge?.title ?? 'Unknown challenge';
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto py-20 text-center text-slate-500">Loading submission history...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submission History</h1>
          <p className="text-slate-500">Track all your submissions and results</p>
        </div>
        <select 
          title="Filter submissions by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-slate-200 px-4 py-2 rounded-xl text-sm"
        >
          <option value="all">All Submissions</option>
          <option value="accepted">Accepted</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-slate-500">Challenge</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-500">Submitted</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-500">Language</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-500">GitHub</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-500">Score</th>
              <th className="py-4 px-6 text-left font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50">
                <td className="px-6 py-5 font-medium text-slate-900">{getChallengeTitle(sub.challengeId)}</td>
                <td className="px-6 py-5 text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">{sub.language}</span>
                </td>
                <td className="px-6 py-5">
                  <a href={sub.githubLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline">
                    View Repo
                  </a>
                </td>
                <td className="px-6 py-5 font-bold text-indigo-600">{sub.score}</td>
                <td className="px-6 py-5">
                  <div className="inline-flex items-center gap-1 text-xs font-semibold">
                    {sub.status === 'accepted' && <CheckCircle2 size={15} className="text-emerald-600" />}
                    {sub.status === 'rejected' && <XCircle size={15} className="text-red-600" />}
                    {sub.status === 'pending' && <Clock size={15} className="text-amber-600" />}
                    <span className={`uppercase px-3 py-1 rounded-full tracking-wider ${
                      sub.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 
                      sub.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>{sub.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400">No submissions in this category.</div>
        )}
      </div>
    </div>
  );
};
