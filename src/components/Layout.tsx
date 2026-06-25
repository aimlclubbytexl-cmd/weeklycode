import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  Trophy, 
  UserCircle, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  MessageSquare,
  Bell,
  History
} from 'lucide-react';

interface LayoutProps {
  user: any;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Code2, label: 'Challenges', path: '/challenges' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: MessageSquare, label: 'Forum', path: '/forum' },
    { icon: Bell, label: 'Announcements', path: '/announcements' },
    { icon: History, label: 'My History', path: '/history' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ icon: ShieldCheck, label: 'Admin Panel', path: '/admin' });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 h-screen bg-indigo-900 text-white transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 shrink-0">
          <svg viewBox="0 0 1243 581" className="w-16 h-10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <style>{`.circuit-line { fill: none; stroke: #00D9FF; stroke-width: 24; stroke-linecap: round; stroke-linejoin: round; } .circuit-dot { fill: #FFFFFF; } .node-ring { fill: none; stroke: #00D9FF; stroke-width: 3; }`}</style>
            </defs>
            
            {/* AI Letter */}
            <g id="ai-letter">
              {/* A Shape - left side */}
              <path className="circuit-line" d="M 280 450 L 380 150 L 480 450"/>
              {/* A Shape - cross bar */}
              <path className="circuit-line" d="M 320 320 L 440 320"/>
              
              {/* Circuit dots on A */}
              <circle className="circuit-dot" cx="290" cy="380" r="12"/>
              <circle className="circuit-dot" cx="290" cy="280" r="12"/>
              <circle className="circuit-dot" cx="470" cy="380" r="12"/>
              <circle className="circuit-dot" cx="470" cy="280" r="12"/>
              <circle className="circuit-dot" cx="380" cy="480" r="12"/>
              <circle className="circuit-dot" cx="320" cy="320" r="10"/>
              <circle className="circuit-dot" cx="440" cy="320" r="10"/>
            </g>
            
            {/* I Shape */}
            <g id="i-letter">
              <path className="circuit-line" d="M 580 150 L 580 450"/>
              
              {/* Circuit dots on I */}
              <circle className="circuit-dot" cx="580" cy="200" r="12"/>
              <circle className="circuit-dot" cx="580" cy="400" r="12"/>
            </g>
            
            {/* ML Letter */}
            <g id="ml-letter">
              {/* M Shape */}
              <path className="circuit-line" d="M 700 450 L 700 180 L 800 320 L 900 180 L 900 450"/>
              
              {/* Circuit dots on M */}
              <circle className="circuit-dot" cx="700" cy="250" r="12"/>
              <circle className="circuit-dot" cx="800" cy="320" r="12"/>
              <circle className="circuit-dot" cx="900" cy="250" r="12"/>
            </g>
            
            {/* L Shape */}
            <g id="l-letter">
              <path className="circuit-line" d="M 1020 150 L 1020 450 L 1140 450"/>
              
              {/* Circuit dots on L */}
              <circle className="circuit-dot" cx="1020" cy="300" r="12"/>
              <circle className="circuit-dot" cx="1140" cy="450" r="12"/>
              <circle className="circuit-dot" cx="1020" cy="450" r="12"/>
            </g>
            
            {/* Decorative connecting lines */}
            <path className="circuit-line" d="M 600 350 L 680 350" opacity="0.7"/>
          </svg>
          <span className="text-xl font-bold tracking-tight">Coding Challenges</span>
        </div>

        <nav className="flex-1 overflow-y-auto mt-2 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-indigo-800"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="shrink-0 w-full p-4 border-t border-indigo-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-indigo-300 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors hover:bg-red-900/30 text-red-300"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-slate-800">Welcome back, {user?.username}!</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              <Trophy size={14} />
              <span>{user?.points} pts</span>
            </div>
            <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-200" />
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
