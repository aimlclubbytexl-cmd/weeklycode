import React, { useState, useEffect, useRef, ReactNode } from 'react';
import {
  Code2,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  Trophy,
  Users,
  BrainCircuit,
  Globe,
  type LucideIcon,
} from 'lucide-react';

const GlobalStyles = () => (
  <style>{`
    :root {
      --primary: #2563eb;
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
    .text-main { color: var(--text-main); }
    .text-muted { color: var(--text-muted); }
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

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  `}</style>
);

type ParticleBackgroundProps = {
  theme: 'dark' | 'light';
};

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  type?: 'button' | 'submit' | 'reset';
};

const ParticleBackground = ({ theme }: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
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

    let animationFrameId = 0;
    let particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      baseRadius: number;
    }> = [];
    let width = 0;
    let height = 0;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      const numParticles = Math.min(120, (width * height) / 8000);

      for (let i = 0; i < numParticles; i += 1) {
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

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (p.z < 0.2 || p.z > 2.2) p.vz *= -1;
      });

      const sortedParticles = [...particles].sort((a, b) => b.z - a.z);

      for (let i = 0; i < sortedParticles.length; i += 1) {
        const p1 = sortedParticles[i];
        const p1x = p1.x + (mouseX * 60) / p1.z;
        const p1y = p1.y + (mouseY * 60) / p1.z;

        for (let j = i + 1; j < sortedParticles.length; j += 1) {
          const p2 = sortedParticles[j];
          const p2x = p2.x + (mouseX * 60) / p2.z;
          const p2y = p2.y + (mouseY * 60) / p2.z;

          const dx = p1x - p2x;
          const dy = p1y - p2y;
          const dz = p1.z - p2.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz * 5000);

          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);

            const avgX = (p1x + p2x) / 2;
            const ratio = Math.max(0, Math.min(1, avgX / width));
            const maxAlpha = theme === 'dark' ? 0.5 : 0.15;
            const depthAlpha = 1.2 / ((p1.z + p2.z) / 2);
            const alpha = (1 - distance / 160) * maxAlpha * Math.min(1, depthAlpha);

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

      sortedParticles.forEach((p) => {
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

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, type = 'button' }: ButtonProps) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20',
    secondary: 'bg-white text-blue-600 hover:bg-slate-50 font-semibold shadow-sm',
    outline: 'border-2 border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)]',
    ghost: 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)]',
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <BrainCircuit className="text-purple-500 w-8 h-8 mb-4" />,
      title: 'AI-Powered Mentorship',
      description: 'Get real-time feedback and hints tailored to your coding style.',
    },
    {
      icon: <Trophy className="text-blue-500 w-8 h-8 mb-4" />,
      title: 'Global Leaderboards',
      description: 'Compete with peers worldwide and showcase your problem-solving skills.',
    },
    {
      icon: <Users className="text-cyan-500 w-8 h-8 mb-4" />,
      title: 'Community Driven',
      description: 'Join a vibrant community of developers, share solutions, and learn together.',
    },
  ];

  return (
    <div className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">Why Choose CodeChallenge?</h2>
        <p className="text-muted max-w-2xl mx-auto">Everything you need to accelerate your programming journey, built into one powerful platform.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
            {feature.icon}
            <h3 className="text-xl font-bold text-main mb-2">{feature.title}</h3>
            <p className="text-muted leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LandingApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'theme-dark' : 'theme-light'} bg-transparent text-main transition-colors duration-300`}>
      <GlobalStyles />
      <ParticleBackground theme={theme} />
      <nav className="fixed top-0 w-full z-40 nav-bg backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Code2 size={22} className="text-white" />
            </div>
            <span className="font-bold text-xl text-main tracking-tight">CodeChallenge</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden sm:block">
              <Button variant="outline" className="px-5 py-2.5">Log in</Button>
            </div>
            <Button className="px-5 py-2.5">Sign Up</Button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-20">
          <div className="max-w-5xl w-full text-center space-y-8 animate-float relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-2 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Sparkles size={16} />
              <span>Next-Gen Coding Platform V2.0 is Live</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-main">
              Code. Learn. Compete. <br />
              <span className="text-gradient">Grow Exponentially.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              Join weekly coding challenges, master algorithms with our AI mentor,
              compete with peers globally, and build a verifiable developer profile.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button className="w-full sm:w-auto px-8 py-4 text-lg" icon={ChevronRight}>
                Start Coding for Free
              </Button>
              <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg" icon={Globe}>
                Explore Challenges
              </Button>
            </div>

            <div className="pt-12 text-sm text-[var(--text-muted)] flex items-center justify-center gap-8 opacity-70">
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-2xl text-main">100k+</span>
                <span>Active Users</span>
              </div>
              <div className="w-px h-8 bg-[var(--border-subtle)]" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-2xl text-main">5M+</span>
                <span>Submissions</span>
              </div>
            </div>
          </div>
        </div>

        <FeaturesSection />
      </main>

      <footer className="border-t border-[var(--border-subtle)] py-12 text-center text-[var(--text-muted)] relative z-10 bg-[var(--bg-main)]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code2 size={20} className="text-blue-500" />
          <span className="font-bold text-main">CodeChallenge</span>
        </div>
        <p>© {new Date().getFullYear()} CodeChallenge Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
