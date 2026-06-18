import React from 'react';
import { Bell, Calendar, Award, Megaphone } from 'lucide-react';
import { MOCK_ANNOUNCEMENTS } from '../mockData';

export const Announcements: React.FC = () => {
  const getIcon = (type: string) => {
    if (type === 'winner') return <Award className="text-amber-500" />;
    if (type === 'event') return <Calendar className="text-blue-500" />;
    return <Megaphone className="text-indigo-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
        <p className="text-slate-500 mt-1">Stay up to date with challenge updates, events and winners</p>
      </div>

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((a, index) => (
          <div key={index} className="bg-white p-8 rounded-3xl border border-slate-200 flex gap-6">
            <div className="p-4 rounded-2xl bg-slate-100 h-fit">
              {getIcon(a.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">{a.title}</h3>
                <span className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString()}</span>
              </div>
              <p className="mt-3 text-slate-600 leading-relaxed">{a.content}</p>
              {a.type === 'winner' && (
                <div className="mt-4 inline-block px-4 py-1 text-sm bg-amber-100 text-amber-700 rounded-xl">🏆 Winner Announcement</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm flex gap-3">
        <Bell className="flex-shrink-0 mt-1" size={18} />
        <span>Want to receive these announcements directly in your inbox? Enable email notifications in your profile settings.</span>
      </div>
    </div>
  );
};
