'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
	children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { user, loading } = useAuth();

	const isLoginPage = pathname === '/portal/login';

	useEffect(() => {
		if (!loading && !user && !isLoginPage) {
			router.push('/portal/login');
		}

		if (!loading && user && isLoginPage) {
			router.push('/portal');
		}
	}, [user, loading, router, isLoginPage]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-white">Loading...</p>
			</div>
		);
	}

	if (isLoginPage || user) {
		return <>{children}</>;
	}

	return null;
}
