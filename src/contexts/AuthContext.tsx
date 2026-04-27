'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

	useEffect(() => {
		const storedToken = localStorage.getItem('auth_token');
		const storedUser = localStorage.getItem('auth_user');

		if (storedToken && storedUser) {
			try {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setToken(storedToken);
				setUser(JSON.parse(storedUser) as User);
			} catch {
				localStorage.removeItem('auth_token');
				localStorage.removeItem('auth_user');
			}
		}

		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		const response = await authApi.login({ email, password });
		const data = response.data;

		setToken(data.access_token);
		setUser(data.user);

		localStorage.setItem('auth_token', data.access_token);
		localStorage.setItem('auth_user', JSON.stringify(data.user));
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
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
