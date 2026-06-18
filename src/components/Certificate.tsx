import React from 'react';
import { Download, Share2, Award, RotateCcw } from 'lucide-react';

interface CertificateProps {
  userName: string;
  challengeName: string;
  date: string;
  rank: string;
}

export const Certificate: React.FC<CertificateProps> = ({ userName, challengeName, date, rank }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your Achievement</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Share2 size={16} />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Certificate Design */}
      <div className="relative bg-white p-12 rounded-3xl shadow-2xl border-[16px] border-indigo-900 text-center overflow-hidden" id="certificate">
        {/* Background patterns */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-full translate-x-1/2 translate-y-1/2 opacity-50"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            <div className="p-4 bg-indigo-50 rounded-full">
              <Award size={64} className="text-indigo-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-5xl font-serif font-bold text-slate-900 uppercase tracking-widest">Certificate</h2>
            <p className="text-indigo-600 font-medium text-xl">of Excellence</p>
          </div>

          <div className="py-8">
            <p className="text-slate-500 italic text-lg mb-4">This is to certify that</p>
            <h3 className="text-4xl font-bold text-slate-900 border-b-2 border-slate-200 inline-block px-8 pb-2">
              {userName}
            </h3>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-slate-600 text-lg leading-relaxed">
              has successfully completed the <span className="font-bold text-slate-900">{challengeName}</span> 
              coding challenge with a distinguished rank of <span className="font-bold text-indigo-600">{rank}</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-12">
            <div className="text-center">
              <div className="border-b border-slate-300 w-48 mx-auto mb-2"></div>
              <p className="text-sm font-bold text-slate-900">Dr. Alan Turing</p>
              <p className="text-xs text-slate-500">Program Director</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-300 w-48 mx-auto mb-2"></div>
              <p className="text-sm font-bold text-slate-900">{date}</p>
              <p className="text-xs text-slate-500">Date of Issue</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
        >
          <RotateCcw size={18} />
          Print Certificate
        </button>
      </div>
    </div>
  );
};
