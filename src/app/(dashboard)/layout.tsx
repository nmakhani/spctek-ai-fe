'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { GlowBackground } from '@/components/portal/GlowBackground';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<ProtectedRoute>
				<div className="relative isolate min-h-screen overflow-x-hidden bg-[#020617]">
					<GlowBackground />
					<div className="relative z-10">{children}</div>
				</div>
			</ProtectedRoute>
		</AuthProvider>
	);
}
