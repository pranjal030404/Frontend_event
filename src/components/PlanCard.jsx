import React from 'react';
import './PlanCard.css';

const PlanCard = ({ plan, onClick, onJoin }) => {
  const distance = Math.random().toFixed(1); // Placeholder - calculate actual distance

  return (
    <div className="plan-card" onClick={onClick}>
      <div className="card-header">
        <div className="creator-info">
          <img src={plan.creator.avatar || 'https://via.placeholder.com/40'} alt={plan.creator.name} className="avatar" />
          <div>
            <h3>{plan.title}</h3>
            <p className="location">📍 {distance} km away</p>
            <p className="time">⏰ {plan.dateTime.date}</p>
          </div>
        </div>
      </div>

      <div className="card-tags">
        {plan.tags && plan.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <button className="join-btn" onClick={(e) => {
        e.stopPropagation();
        onJoin && onJoin(plan._id);
      }}>
        Join
      </button>
    </div>
  );
};

export default PlanCard;
