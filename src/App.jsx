import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/ToastContainer';
import { useAuthStore, useThemeStore } from './store/store';
import { useToastStore } from './store/store';
import './styles/globals.css';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  const token = useAuthStore((state) => state.token);
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {token && <BottomNav />}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </Router>
  );
}

export default App;
