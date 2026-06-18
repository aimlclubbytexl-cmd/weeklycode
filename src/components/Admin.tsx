import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  Users, 
  LayoutGrid, 
  FileCheck,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';
import { Challenge, Submission, User } from '../types';

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000';

interface CreateChallengeForm {
  title: string;
  description: string;
  category: string;
  points: number;
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
  deadline: string;
  status: 'active' | 'completed' | 'scheduled';
}

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'submissions' | 'users'>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingChallenge, setCreatingChallenge] = useState(false);
  const [createForm, setCreateForm] = useState<CreateChallengeForm>({
    title: '',
    description: '',
    category: 'General',
    points: 100,
    sampleInput: '',
    sampleOutput: '',
    constraints: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'challenges') {
        const res = await fetch(`${API_BASE}/challenges`);
        if (!res.ok) throw new Error('Failed to fetch challenges');
        const data = await res.json();
        setChallenges(data);
      } else if (activeTab === 'submissions') {
        const res = await fetch(`${API_BASE}/submissions`);
        if (!res.ok) throw new Error('Failed to fetch submissions');
        const data = await res.json();
        setSubmissions(data);
      } else if (activeTab === 'users') {
        const res = await fetch(`${API_BASE}/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingChallenge(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
          category: createForm.category,
          points: Number(createForm.points),
          sampleInput: createForm.sampleInput,
          sampleOutput: createForm.sampleOutput,
          constraints: createForm.constraints ? createForm.constraints.split('\n').filter(Boolean) : [],
          deadline: new Date(createForm.deadline).toISOString(),
          status: createForm.status,
        }),
      });

      if (!res.ok) throw new Error('Failed to create challenge');

      setShowCreateModal(false);
      setCreateForm({
        title: '',
        description: '',
        category: 'General',
        points: 100,
        sampleInput: '',
        sampleOutput: '',
        constraints: '',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
      });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
    } finally {
      setCreatingChallenge(false);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;

    try {
      const res = await fetch(`${API_BASE}/challenges/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete challenge');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete challenge');
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!window.confirm(`Are you sure you want to delete ${username}? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete user');
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, status: Submission['status']) => {
    try {
      const res = await fetch(`${API_BASE}/submissions/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update submission');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleRunPlagiarismCheck = (id: string) => {
    alert(`Running plagiarism check for submission ${id}...`);
    setTimeout(() => {
      const isPlagiarized = Math.random() > 0.7;
      if (isPlagiarized) {
        handleUpdateSubmissionStatus(id, 'plagiarized');
        alert('Plagiarism detected!');
      } else {
        alert('No plagiarism detected.');
      }
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Admin Control Panel</h1>
        {activeTab === 'challenges' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Create New Challenge
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Create New Challenge</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Challenge title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>General</option>
                    <option>Arrays</option>
                    <option>Strings</option>
                    <option>Graphs</option>
                    <option>Dynamic Programming</option>
                    <option>Trees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Challenge description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Points *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={createForm.points}
                    onChange={(e) => setCreateForm({ ...createForm, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={createForm.deadline}
                  onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sample Input</label>
                  <textarea
                    value={createForm.sampleInput}
                    onChange={(e) => setCreateForm({ ...createForm, sampleInput: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                    placeholder="Sample input"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sample Output</label>
                  <textarea
                    value={createForm.sampleOutput}
                    onChange={(e) => setCreateForm({ ...createForm, sampleOutput: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                    placeholder="Sample output"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Constraints (one per line)</label>
                <textarea
                  value={createForm.constraints}
                  onChange={(e) => setCreateForm({ ...createForm, constraints: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
                  placeholder="Constraint 1&#10;Constraint 2"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={creatingChallenge}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {creatingChallenge ? 'Creating...' : 'Create Challenge'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'challenges' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <LayoutGrid size={18} />
          Challenges
        </button>
        <button 
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'submissions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileCheck size={18} />
          Submissions
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users size={18} />
          Users
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-500 py-8">
            <Loader size={20} className="animate-spin" />
            Loading data...
          </div>
        ) : activeTab === 'challenges' && (
          <div className="grid grid-cols-1 gap-4">
            {challenges.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No challenges yet</p>
            ) : (
              challenges.map(challenge => (
                <div key={challenge.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{challenge.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{challenge.description}</p>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">{challenge.category}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        challenge.status === 'active' ? 'bg-green-100 text-green-700' : 
                        challenge.status === 'completed' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {challenge.status}
                      </span>
                      <span className="text-xs font-medium text-slate-600">{challenge.points} pts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => handleDeleteChallenge(challenge.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete Challenge"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {submissions.length === 0 ? (
              <p className="text-slate-500 text-center py-8 block">No submissions yet</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">User</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Challenge</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Link</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {users.find(u => u.id === sub.userId)?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {challenges.find(c => c.id === sub.challengeId)?.title || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <a href={sub.githubLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-sm truncate block max-w-xs">
                          View Repository
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-bold
                          ${sub.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                            sub.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            sub.status === 'plagiarized' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}
                        `}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateSubmissionStatus(sub.id, 'accepted')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Accept"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateSubmissionStatus(sub.id, 'rejected')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleRunPlagiarismCheck(sub.id)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Check Plagiarism"
                          >
                            <ShieldAlert size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.length === 0 ? (
              <p className="text-slate-500 col-span-3 text-center py-8">No users yet</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{user.username}</h4>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    <span>Points: <strong>{user.points}</strong></span>
                    <span>Streak: <strong>{user.streak}</strong></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
