import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingApp from './LandingApp';
import { Auth } from './components/Auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingApp />} />
        <Route path="/login" element={<Auth initialMode="login" onLogin={() => {}} />} />
        <Route path="/signup" element={<Auth initialMode="signup" onLogin={() => {}} />} />
      </Routes>
    </BrowserRouter>
  );
}
