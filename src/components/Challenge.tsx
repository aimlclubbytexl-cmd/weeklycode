import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  GitBranch, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Zap 
} from 'lucide-react';
import { getChallenge, submitSolution } from '../api';
import { Challenge, Submission, User } from '../types';

const DEFAULT_LANGUAGE = 'JavaScript';

export const ChallengeDetail: React.FC = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user: User | null = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') ?? 'null');
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!id) {
      setError('Challenge id missing');
      setLoading(false);
      return;
    }

    async function loadChallenge() {
      setLoading(true);
      setError('');
      try {
        const challengeId = id as string;
        const data = await getChallenge(challengeId);
        setChallenge(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenge');
      } finally {
        setLoading(false);
      }
    }

    loadChallenge();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    setIsSubmitting(true);
    setError('');

    try {
      await submitSolution({
        challengeId: id,
        userId: user.id,
        githubLink: submissionLink,
        status: 'pending',
        score: 0,
        remarks: '',
        language,
      } as Omit<Submission, 'id' | 'submittedAt'>);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500">Loading challenge details...</div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Challenge not found</h2>
        <button 
          onClick={() => navigate('/challenges')}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Back to challenges
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">
                {challenge.category}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">
                {challenge.points} Points
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock size={16} />
              <span>Deadline: {new Date(challenge.deadline).toLocaleString()}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{challenge.title}</h1>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-4">
              <FileText size={20} className="text-indigo-600" />
              Problem Statement
            </div>
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>{challenge.description}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-4">
                <Zap size={20} className="text-indigo-600" />
                Constraints
              </div>
              <ul className="space-y-2">
                {challenge.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-sm space-y-4">
              <div>
                <p className="text-slate-500 mb-2 uppercase text-xs font-bold tracking-widest">Sample Input</p>
                <pre className="whitespace-pre-wrap">{challenge.sampleInput}</pre>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-slate-500 mb-2 uppercase text-xs font-bold tracking-widest">Sample Output</p>
                <pre className="whitespace-pre-wrap">{challenge.sampleOutput}</pre>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-100">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl flex items-center gap-4">
                <CheckCircle2 size={32} className="text-green-500" />
                <div>
                  <p className="font-bold text-lg">Submission Successful!</p>
                  <p className="text-sm">Your GitHub repository has been linked. Our team will review it soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-4">
                  <GitBranch size={20} className="text-indigo-600" />
                  Submit Your Solution
                </div>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    type="url"
                    placeholder="https://github.com/username/repository"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    required
                  />
                  <select
                    title="Select language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full max-w-[180px] px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                  </select>
                </div>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Link'}
                  </button>
                  <p className="text-xs text-slate-400 italic">
                    Note: Ensure your repository is public or grant access to our review team.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
