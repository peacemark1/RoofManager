import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (emailOrUser: string | User, passwordOrToken?: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (emailOrUser: string | User, passwordOrToken?: string) => {
                if (typeof emailOrUser === 'object') {
                    // Direct login with user object and token
                    const user = emailOrUser;
                    const token = passwordOrToken as string;
                    localStorage.setItem('token', token);
                    set({ user, token, isAuthenticated: true, isLoading: false });
                    return;
                }

                // API login with email and password
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: emailOrUser, password: passwordOrToken }),
                    });

                    if (!response.ok) {
                        throw new Error('Login failed');
                    }

                    const result = await response.json();
                    const data = result.data || result;
                    const token = data.token;
                    const user = data.user;

                    localStorage.setItem('token', token);
                    set({
                        user,
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
                set({ user: null, token: null, isAuthenticated: false, isLoading: false });
            },

            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null
                })),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
