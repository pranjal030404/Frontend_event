import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export const usePlanStore = create((set, get) => ({
  plans: [],
  selectedPlan: null,
  setPlans: (plans) => set({ plans }),
  addPlan: (plan) => set((state) => ({ plans: [plan, ...state.plans] })),
  updatePlan: (id, updatedPlan) =>
    set((state) => ({
      plans: state.plans.map((p) => (p._id === id ? updatedPlan : p))
    })),
  deletePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((p) => p._id !== id)
    })),
  setSelectedPlan: (plan) => set({ selectedPlan: plan })
}));

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  }
}));
