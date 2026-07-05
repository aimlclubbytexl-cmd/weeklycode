import React, { useState, useEffect, useRef } from 'react';
import {
  Code2, Terminal, Trophy, Users, ShieldAlert, Sparkles,
  ChevronRight, Play, LayoutDashboard, Target, History,
  Settings, LogOut, Github, FileArchive, UploadCloud,
  MessageSquare, Clock, Flame, BrainCircuit, X, Send,
  AlertTriangle, CheckCircle, Sun, Moon, TrendingUp,
  Award, FileText, Bell, Search, Code
} from 'lucide-react';

// ==========================================
// --- STYLES/GLOBALS ---
// ==========================================
const GlobalStyles = () => (
  <style>{`
    :root {
      --primary: #2563eb;
      --sidebar-bg: #0f172a;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', system-ui, sans-serif;
      overflow-x: hidden;
      background-color: var(--bg-main);
      color: var(--text-main);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .theme-dark {
      --bg-main: #020617;
      --bg-panel: rgba(255, 255, 255, 0.03);
      --bg-secondary: rgba(30, 41, 59, 0.5);
      --text-main: #ffffff;
      --text-muted: #94a3b8;
      --border-subtle: rgba(255, 255, 255, 0.1);
      --nav-bg: rgba(2, 6, 23, 0.75);
    }

    .theme-light {
      --bg-main: #f8fafc;
      --bg-panel: #ffffff;
      --bg-secondary: #f1f5f9;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-subtle: #e2e8f0;
      --nav-bg: rgba(248, 250, 252, 0.85);
    }

    .bg-main { background-color: var(--bg-main); }
    .bg-panel { background-color: var(--bg-panel); }
    .bg-secondary { background-color: var(--bg-secondary); }
    .text-main { color: var(--text-main); }
    .text-muted { color: var(--text-muted); }
    .border-subtle { border-color: var(--border-subtle); }
    .nav-bg { background-color: var(--nav-bg); }

    .glass-panel {
      background: var(--bg-panel);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .text-gradient {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(to right, #7C3AED, #06B6D4, #3B82F6);
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  `}</style>
);

// ==========================================
// --- DATA/MOCKS ---
// ==========================================
const MOCK_USER = {
  name: 'AlexCode',
  role: 'student',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
  rank: 42,
  points: 1250,
  streak: 5,
  challengesSolved: 87,
  tier: 'Gold'
};

const MOCK_CHALLENGES = [
  { id: 1, title: 'Optimal Path Finder', difficulty: 'Hard', category: 'Algorithms', points: 100, timeLimit: '2 Hours', participants: 1205, deadline: '01/01/2027' },
  { id: 2, title: 'String Compression Pro', difficulty: 'Medium', category: 'Strings', points: 50, timeLimit: '1 Hour', participants: 3421, deadline: 'Past' },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Sarah Connor', points: 45200, streak: 45, solved: 312, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { rank: 2, name: 'John Wick', points: 42100, streak: 30, solved: 298, avatar: 'https://i.pravatar.cc/150?u=john' },
  { rank: 3, name: 'Neo Anderson', points: 41050, streak: 28, solved: 285, avatar: 'https://i.pravatar.cc/150?u=neo' },
];

// ==========================================
// --- COMPONENTS/COMMON ---
// ==========================================
const ParticleBackground = ({ theme }: { theme: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Array<any> = [];
    let width: number;
    let height: number;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      const numParticles = Math.min(120, (width * height) / 8000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 2 + 0.2,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          vz: (Math.random() - 0.5) * 0.01,
          baseRadius: Math.random() * 2 + 1.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (theme === 'dark') {
        ctx.fillStyle = '#050511';
        ctx.fillRect(0, 0, width, height);

        const leftGlow = ctx.createRadialGradient(0, height * 0.4, 0, 0, height * 0.4, width * 0.7);
        leftGlow.addColorStop(0, 'rgba(147, 51, 234, 0.18)');
        leftGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = leftGlow;
        ctx.fillRect(0, 0, width, height);

        const rightGlow = ctx.createRadialGradient(width, height * 0.6, 0, width, height * 0.6, width * 0.7);
        rightGlow.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
        rightGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = rightGlow;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        const centerGlow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
        centerGlow.addColorStop(0, 'rgba(37, 99, 235, 0.05)');
        centerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, width, height);
      }

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      particles.forEach((p: any) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (p.z < 0.2 || p.z > 2.2) p.vz *= -1;
      });

      const sortedParticles = [...particles].sort((a, b) => b.z - a.z);

      for (let i = 0; i < sortedParticles.length; i++) {
        const p1 = sortedParticles[i];
        const p1x = p1.x + (mouseX * 60) / p1.z;
        const p1y = p1.y + (mouseY * 60) / p1.z;

        for (let j = i + 1; j < sortedParticles.length; j++) {
          const p2 = sortedParticles[j];
          const p2x = p2.x + (mouseX * 60) / p2.z;
          const p2y = p2.y + (mouseY * 60) / p2.z;

          const dx = p1x - p2x;
          const dy = p1y - p2y;
          const dz = p1.z - p2.z;
          const distance = Math.sqrt(dx * dx + dy * dy + (dz * dz * 5000));

          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);

            const avgX = (p1x + p2x) / 2;
            const ratio = Math.max(0, Math.min(1, avgX / width));
            const maxAlpha = theme === 'dark' ? 0.5 : 0.15;
            const depthAlpha = 1.2 / ((p1.z + p2.z) / 2);
            let alpha = (1 - (distance / 160)) * maxAlpha * Math.min(1, depthAlpha);

            if (theme === 'dark') {
              const r = Math.round(147 * (1 - ratio) + 6 * ratio);
              const g = Math.round(51 * (1 - ratio) + 182 * ratio);
              const b = Math.round(234 * (1 - ratio) + 212 * ratio);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            } else {
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            }

            ctx.lineWidth = 1.5 / ((p1.z + p2.z) / 2);
            ctx.stroke();
          }
        }
      }

      sortedParticles.forEach((p: any) => {
        const px = p.x + (mouseX * 60) / p.z;
        const py = p.y + (mouseY * 60) / p.z;
        const scale = 1 / p.z;

        ctx.beginPath();
        ctx.arc(px, py, p.baseRadius * scale, 0, Math.PI * 2);

        const ratio = Math.max(0, Math.min(1, px / width));

        if (theme === 'dark') {
          const r = Math.round(180 * (1 - ratio) + 6 * ratio);
          const g = Math.round(80 * (1 - ratio) + 200 * ratio);
          const b = Math.round(255 * (1 - ratio) + 255 * ratio);
          ctx.shadowBlur = 15 * scale;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, 0.4 * scale + 0.4)})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(37, 99, 235, ${Math.min(1, 0.4 * scale + 0.2)})`;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none w-full h-full bg-transparent" />;
};

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, type = 'button' }: any) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20',
    secondary: 'bg-white text-blue-600 hover:bg-slate-50 font-semibold shadow-sm',
    outline: 'border border-border-subtle text-text-main hover:bg-secondary',
    ghost: 'text-muted hover:text-main hover:bg-secondary'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// ==========================================
// --- LAYOUTS ---
// ==========================================
const Sidebar = ({ currentView, setCurrentView, handleLogout, user }: any) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'challenges', label: 'Challenges', icon: Code },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'history', label: 'My History', icon: History },
    { id: 'profile', label: 'Profile', icon: Target },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div className="w-64 bg-[#0a192f] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 text-xl font-bold text-white mb-4">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Code2 size={20} />
        </div>
        CodeChallenge
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              currentView === item.id || (currentView === 'challenge' && item.id === 'challenges')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full bg-blue-100 p-1" />
          <div className="text-left">
            <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
            <p className="text-xs text-blue-400">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

const Topbar = ({ user }: any) => (
  <header className="h-16 flex items-center justify-between px-8 bg-transparent">
    <div className="text-lg text-main">
      Welcome back, <span className="font-semibold">{user.name}!</span>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <Trophy size={16} className="text-blue-500" />
        <span>{user.points} pts</span>
      </div>
      <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full bg-blue-100 p-0.5 border border-border-subtle shadow-sm" />
    </div>
  </header>
);

// ==========================================
// --- PAGES/VIEWS ---
// ==========================================
const DashboardView = ({ user, navigateToChallenge }: any) => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-panel border border-border-subtle rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <Flame size={24} className="text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted font-medium mb-1">Current Streak</p>
            <p className="text-2xl font-bold text-main">{user.streak} Days</p>
          </div>
        </div>

        <div className="bg-panel border border-border-subtle rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Trophy size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted font-medium mb-1">Total Points</p>
            <p className="text-2xl font-bold text-main">{user.points.toLocaleString()} pts</p>
          </div>
        </div>

        <div className="bg-panel border border-border-subtle rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <TrendingUp size={24} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted font-medium mb-1">Global Rank</p>
            <p className="text-2xl font-bold text-main">#{user.rank}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#2563eb] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-black/5 rounded-full blur-2xl translate-y-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-100 text-sm font-medium tracking-wide uppercase">
              <Clock size={16} /> ACTIVE CHALLENGE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Optimal Path Finder</h2>
            <p className="text-blue-100/90 text-sm md:text-base leading-relaxed">
              Find the shortest path between two nodes in a weighted graph with constraints on the maximum number of edges used.
            </p>
            <div className="flex items-center gap-6 pt-2 text-sm font-medium text-blue-50">
              <span className="flex items-center gap-1.5"><Trophy size={16}/> 100 Points</span>
              <span className="flex items-center gap-1.5"><Clock size={16}/> Deadline: 01/01/2027</span>
            </div>
          </div>

          <Button variant="secondary" className="whitespace-nowrap px-6 py-3" onClick={() => navigateToChallenge(1)}>
            Solve Now <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-main">Your Activity</h3>

        <div className="bg-panel border border-border-subtle rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="font-bold text-main">String Compression Pro</p>
              <p className="text-sm text-muted">Strings • Completed</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-main">+50</p>
            <p className="text-xs text-muted">Points earned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ setView }: any) => (
  <div className="min-h-[90vh] flex flex-col justify-center items-center px-4 pt-20 pb-32">
    <div className="max-w-5xl w-full text-center space-y-8 animate-float relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
        <Sparkles size={16} />
        <span>Next-Gen Coding Platform V2.0 is Live</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-main">
        Code. Learn. Compete. <br />
        <span className="text-blue-600 dark:text-blue-500">Grow Exponentially.</span>
      </h1>

      <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
        Join weekly coding challenges, master algorithms with our AI mentor,
        compete with peers globally, and build a verifiable developer profile.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <Button className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => setView('auth')}>
          Start Coding Now
        </Button>
      </div>
    </div>
  </div>
);

const AuthView = ({ onLogin, setView }: any) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative z-10">
      <div className="glass-panel rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-main">Welcome to CodeChallenge</h2>
          <p className="text-muted text-sm mt-2">Enter your university credentials</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Email</label>
            <input type="email" required className="w-full bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-main focus:outline-none focus:border-blue-500 transition-colors" placeholder="student@university.edu" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Password</label>
            <input type="password" required className="w-full bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-main focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
          </div>

          <Button className="w-full py-3 mt-6" type="submit">
            Login to Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
};

export function ReactDemo() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('landing');
  const [activeChallenge, setActiveChallenge] = useState<any>(null);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogin = () => {
    setCurrentUser(MOCK_USER);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const navigateToChallenge = (id: number) => {
    setActiveChallenge(MOCK_CHALLENGES.find(c => c.id === id) || MOCK_CHALLENGES[0]);
    setCurrentView('challenge');
  };

  if (!currentUser) {
    return (
      <div className={`relative min-h-screen ${theme === 'dark' ? 'theme-dark' : 'theme-light'} bg-transparent text-main transition-colors duration-300`}>
        <GlobalStyles />
        <ParticleBackground theme={theme} />

        <nav className="fixed top-0 w-full z-40 nav-bg backdrop-blur-md border-b border-border-subtle transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentView('landing')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="font-bold text-main tracking-tight">CodeChallenge</span>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full text-muted hover:text-main hover:bg-secondary">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Button onClick={() => setCurrentView('auth')}>Sign In</Button>
            </div>
          </div>
        </nav>

        <main className="pt-16 min-h-screen">
          {currentView === 'landing' && <LandingPage setView={setCurrentView} />}
          {currentView === 'auth' && <AuthView onLogin={handleLogin} setView={setCurrentView} />}
        </main>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'theme-dark' : 'theme-light'} bg-main text-main transition-colors duration-300`}>
      <GlobalStyles />
      {theme === 'dark' && <ParticleBackground theme={theme} />}

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        user={currentUser}
      />

      <div className="flex-1 ml-64 flex flex-col relative z-10 h-screen overflow-y-auto bg-main">
        <Topbar user={currentUser} />

        <main className="flex-1">
          {currentView === 'dashboard' && <DashboardView user={currentUser} navigateToChallenge={navigateToChallenge} />}

          {currentView !== 'dashboard' && (
            <div className="p-8 max-w-6xl mx-auto flex items-center justify-center h-full opacity-50">
              <div className="text-center">
                <Settings size={48} className="mx-auto mb-4 text-muted animate-spin-slow" />
                <h2 className="text-2xl font-bold text-main capitalize">{currentView} View</h2>
                <p className="text-muted">This module is under construction in MVP.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ReactDemo;
