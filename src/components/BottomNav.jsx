import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <span className="icon">🏠</span>
        <span className="label">Home</span>
      </button>
      <button className="nav-item" onClick={() => navigate('/explore')}>
        <span className="icon">🔍</span>
        <span className="label">Explore</span>
      </button>
      <button className="nav-item create" onClick={() => navigate('/create')}>
        <span className="icon">➕</span>
        <span className="label">Create</span>
      </button>
      <button className="nav-item" onClick={() => navigate('/chats')}>
        <span className="icon">💬</span>
        <span className="label">Chats</span>
      </button>
      <button className="nav-item" onClick={() => navigate('/profile')}>
        <span className="icon">👤</span>
        <span className="label">Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;
