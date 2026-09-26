import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    
    login: (userData, token) => {
        localStorage.setItem('token', token);
        set({ user: userData, token, isAuthenticated: true });
    },
    
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
    
    checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Need to ideally verify token with backend here, for now simple presence check
            set({ token, isAuthenticated: true });
        }
    }
}));
