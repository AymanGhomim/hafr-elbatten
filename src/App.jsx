import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage    from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const [token, setToken] = useState(
    () => localStorage.getItem('chamber_token') || null
  );

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('chamber_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('chamber_token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/dashboard" replace />
              : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            token
              ? <DashboardPage token={token} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
