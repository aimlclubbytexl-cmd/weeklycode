import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Challenges } from './components/Challenges';
import { ChallengeDetail } from './components/Challenge';
import { Leaderboard } from './components/Leaderboard';
import { Forum } from './components/Forum';
import { Announcements } from './components/Announcements';
import { History } from './components/History';
import { Profile } from './components/Profile';
import { Admin } from './components/Admin';
import { Certificate } from './components/Certificate';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData: User) => {
    const userWithBadges = {
      ...userData,
      badges: userData.badges || ['first-blood', 'consistency'],
    };
    setUser(userWithBadges);
    sessionStorage.setItem('user', JSON.stringify(userWithBadges));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/" />} />

        <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="forum" element={<Forum />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="admin" element={user.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
          <Route
            path="certificate"
            element={
              <Certificate
                userName={user.username}
                challengeName="Optimal Path Finder"
                date={new Date().toLocaleDateString()}
                rank="Gold"
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
