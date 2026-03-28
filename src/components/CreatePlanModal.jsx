import React, { useState } from 'react';
import { useLocationStore } from '../store/store';
import './CreatePlanModal.css';

const CreatePlanModal = ({ isOpen, onClose, onSubmit }) => {
  const defaultLocation = useLocationStore((state) => state.defaultLocation);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      name: defaultLocation.name,
      latitude: defaultLocation.latitude,
      longitude: defaultLocation.longitude
    },
    dateTime: '',
    tags: [],
    privacy: {
      whoCanJoin: 'Anyone',
      ageRange: { min: 21, max: 35 }
    },
    maxParticipants: 10
  });

  const tagOptions = ['Casual', 'Dating', 'Friends', 'Nightlife', 'Outdoors', 'Sports', 'Movie', 'Dining'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else if (name.includes('ageRange.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          ageRange: { ...prev.privacy.ageRange, [field]: parseInt(value) }
        }
      }));
    } else if (name.includes('privacy.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        privacy: { ...prev.privacy, [field]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSliderChange = (e, type) => {
    const value = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        ageRange: {
          ...prev.privacy.ageRange,
          [type]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a plan title');
      return;
    }
    if (!formData.location.name.trim()) {
      alert('Please enter a location');
      return;
    }
    if (!formData.dateTime) {
      alert('Please select a date and time');
      return;
    }

    // Create the formatted data to send
    const submitData = {
      ...formData,
      dateTime: new Date(formData.dateTime).toISOString()
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create Plan</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Plan Title */}
          <div className="form-group">
            <label>Plan Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Coffee Meetup"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Looking for someone to grab coffee and check out the new pastry shop downtown."
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input-field"
            />
          </div>

          {/* Where & When */}
          <h3 className="section-title">Where & When</h3>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location.name"
              placeholder="e.g., Blue Bottle Coffee Downtown"
              value={formData.location.name}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>

          {/* Tags */}
          <h3 className="section-title">Tags</h3>
          <div className="tags-container">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${formData.tags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Privacy & Filters */}
          <h3 className="section-title">Privacy & Filters</h3>
          <div className="form-group">
            <label>Who can join?</label>
            <div className="radio-group">
              {['Anyone', 'Women', 'Men'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`privacy-btn ${formData.privacy.whoCanJoin === option ? 'active' : ''}`}
                  onClick={() => setFormData((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, whoCanJoin: option }
                  }))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="form-group">
            <label>Age Range: {formData.privacy.ageRange.min} - {formData.privacy.ageRange.max}</label>
            <div className="slider-container">
              <input
                type="range"
                min="18"
                max="65"
                value={formData.privacy.ageRange.min}
                onChange={(e) => handleSliderChange(e, 'min')}
                className="slider"
              />
              <input
                type="range"
                min="18"
                max="65"
                value={formData.privacy.ageRange.max}
                onChange={(e) => handleSliderChange(e, 'max')}
                className="slider"
              />
            </div>
          </div>

          <button type="submit" className="post-plan-btn">Post Plan</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;
