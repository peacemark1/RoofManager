import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
}

interface Company {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
}

interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { company: Record<string, string>; user: Record<string, string> }) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, company: Company, token: string) => void;
  updateUser: (user: Partial<User>) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error?.message || 'Login failed');
          }

          const { token, user, company } = result.data;
          localStorage.setItem('token', token);
          set({
            user,
            company,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error?.message || 'Registration failed');
          }

          const { token, user, company } = result.data;
          localStorage.setItem('token', token);
          set({
            user,
            company,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        set({
          user: null,
          company: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setAuth: (user, company, token) => {
        localStorage.setItem('token', token);
        set({ user, company, token, isAuthenticated: true });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
