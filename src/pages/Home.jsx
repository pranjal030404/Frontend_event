import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import PlanCard from '../components/PlanCard';
import CreatePlanModal from '../components/CreatePlanModal';
import { plansAPI } from '../utils/api';
import { usePlanStore } from '../store/store';
import { useToastStore } from '../store/store';
import './Home.css';

const Home = () => {
  const [view, setView] = useState('map'); // 'map' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const { plans, setPlans, addPlan } = usePlanStore();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await plansAPI.getAllPlans();
      const plansData = response.data.plans || [];
      console.log('Plans fetched successfully:', plansData.length);
      setPlans(plansData);
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Keep existing plans or show empty state
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (formData) => {
    try {
      const response = await plansAPI.createPlan(formData);
      addPlan(response.data.plan);
      setShowCreateModal(false);
      addToast('Plan created successfully!', 'success');
    } catch (error) {
      console.error('Error creating plan:', error);
      if (error?.response?.status === 401) {
        addToast('Session expired. Please log in again.', 'warning');
        return;
      }
      addToast(error?.response?.data?.message || 'Failed to create plan. Please try again.', 'error');
    }
  };

  const handleJoinPlan = async (planId) => {
    try {
      const response = await plansAPI.joinPlan(planId);
      // Update plan in store
      setPlans(plans.map(p => p._id === planId ? response.data.plan : p));
      addToast('Successfully joined the plan!', 'success');
    } catch (error) {
      console.error('Error joining plan:', error);
      addToast(error.response?.data?.message || 'Failed to join plan', 'error');
    }
  };

  const handleMarkerClick = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="home">
      <div className="home-header">
        <div className="search-bar">
          <input type="text" placeholder="Search plans, people, places..." />
          <button className="filter-btn">⚙️</button>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
            onClick={() => setView('map')}
          >
            Map
          </button>
          <button
            className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            List
          </button>
        </div>
      </div>

      <div className="home-content">
        {view === 'map' ? (
          <div className="map-view">
            <MapComponent plans={plans} onMarkerClick={handleMarkerClick} />
            {selectedPlan && (
              <div className="selected-plan-info">
                <PlanCard
                  plan={selectedPlan}
                  onClick={() => {}}
                  onJoin={handleJoinPlan}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="list-view">
            {loading ? (
              <p className="loading">Loading plans...</p>
            ) : plans.length === 0 ? (
              <p className="no-plans">No plans found. Create one!</p>
            ) : (
              plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  onClick={() => setSelectedPlan(plan)}
                  onJoin={handleJoinPlan}
                />
              ))
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className="create-btn"
        onClick={() => setShowCreateModal(true)}
        title="Create a new plan"
      >
        ➕
      </button>

      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePlan}
      />
    </div>
  );
};

export default Home;
