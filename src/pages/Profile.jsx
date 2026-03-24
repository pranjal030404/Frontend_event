import React, { useState } from 'react';
import { useAuthStore, useThemeStore, useLocationStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import LocationSetupModal from '../components/LocationSetupModal';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { defaultLocation } = useLocationStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'User',
    email: user?.email || '',
    bio: 'Adventure seeker ✨',
    avatar: user?.avatar || 'https://i.pravatar.cc/150?img=5'
  });

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <img src={formData.avatar} alt="Profile" className="avatar" />
        <h1>{formData.name}</h1>
        <p className="email">{formData.email}</p>
      </div>

      <div className="profile-content">
        {!isEditing ? (
          <div className="profile-info">
            <div className="info-card">
              <div className="info-item">
                <span className="label">Bio</span>
                <span className="value">{formData.bio}</span>
              </div>
              <div className="info-item">
                <span className="label">Member Since</span>
                <span className="value">March 2024</span>
              </div>
              <div className="info-item">
                <span className="label">Plans Created</span>
                <span className="value">3</span>
              </div>
              <div className="info-item">
                <span className="label">Plans Joined</span>
                <span className="value">7</span>
              </div>
            </div>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <div className="edit-form">
            <div className="form-group">
              <label>Profile Picture</label>
              <div className="avatar-upload">
                <img src={formData.avatar} alt="Preview" className="avatar-preview" />
                <input
                  type="file"
                  name="avatar"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="avatar-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                disabled
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows="3"
              />
            </div>

            <div className="button-group">
              <button className="save-btn" onClick={handleSave}>
                💾 Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h3>Settings</h3>
          <button className="settings-item" onClick={() => setShowLocationModal(true)}>
            <span>📍 Location: {defaultLocation.name}</span>
            <span>→</span>
          </button>
          <button className="settings-item" onClick={toggleTheme}>
            <span>{isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            <span>→</span>
          </button>
          <button className="settings-item">
            <span>🔔 Notifications</span>
            <span>→</span>
          </button>
          <button className="settings-item">
            <span>🔒 Privacy</span>
            <span>→</span>
          </button>
          <button className="settings-item">
            <span>❓ Help & Support</span>
            <span>→</span>
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <LocationSetupModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </div>
  );
};

export default Profile;
