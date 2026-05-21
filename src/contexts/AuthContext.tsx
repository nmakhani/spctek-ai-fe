'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { authApi } from '@/lib/api';

interface User {
	id: string;
	email: string;
	username: string;
	user_role: 'BASIC' | 'ADMIN';
	created_at: string;
	updated_at: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const clearAuthState = useCallback(() => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
	}, []);

	useEffect(() => {
		const initializeAuth = async () => {
			const storedToken = localStorage.getItem('auth_token');

			if (!storedToken) {
				setLoading(false);
				return;
			}

			try {
				const response = await authApi.me();
				setToken(storedToken);
				setUser(response.data as User);
				localStorage.setItem('auth_user', JSON.stringify(response.data));
			} catch {
				clearAuthState();
			} finally {
				setLoading(false);
			}
		};

		void initializeAuth();
	}, [clearAuthState]);

	const login = async (email: string, password: string) => {
		const response = await authApi.login({ email, password });
		const data = response.data;

		setToken(data.access_token);
		setUser(data.user);

		localStorage.setItem('auth_token', data.access_token);
		localStorage.setItem('auth_user', JSON.stringify(data.user));
	};

	const logout = () => {
		clearAuthState();
	};

	const value = {
		user,
		token,
		loading,
		login,
		logout,
		isAdmin: user?.user_role === 'ADMIN',
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
