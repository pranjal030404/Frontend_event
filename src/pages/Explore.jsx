import React, { useState, useEffect } from 'react';
import { plansAPI } from '../utils/api';
import PlanCard from '../components/PlanCard';
import { useToastStore } from '../store/store';
import './Explore.css';

const Explore = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const addToast = useToastStore((state) => state.addToast);

  const categories = [
    { id: 'all', name: 'All', icon: '🌍' },
    { id: 'casual', name: 'Casual', icon: '😊' },
    { id: 'dating', name: 'Dating', icon: '💕' },
    { id: 'friends', name: 'Friends', icon: '👯' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'nightlife', name: 'Nightlife', icon: '🍻' }
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await plansAPI.getAllPlans();
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = selectedCategory === 'all'
    ? plans
    : plans.filter(plan =>
        plan.tags && plan.tags.some(tag =>
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );

  const handleJoinPlan = async (planId) => {
    try {
      const response = await plansAPI.joinPlan(planId);
      setPlans(plans.map(p => p._id === planId ? response.data.plan : p));
      addToast('Successfully joined the plan!', 'success');
    } catch (error) {
      console.error('Error joining plan:', error);
      addToast(error.response?.data?.message || 'Failed to join plan', 'error');
    }
  };

  return (
    <div className="explore">
      <div className="explore-header">
        <h1>Explore Plans</h1>
        <p>Discover interesting activities near you</p>
      </div>

      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-name">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="explore-content">
        {loading ? (
          <div className="loading">Loading amazing plans...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="no-plans">
            <p>No plans found in this category</p>
            <p style={{ fontSize: '12px', color: '#999' }}>Try another category!</p>
          </div>
        ) : (
          <div className="plans-grid">
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onJoin={handleJoinPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
