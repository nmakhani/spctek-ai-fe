'use client';

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 3000,
				style: {
					background: 'rgba(15, 23, 42, 0.82)',
					color: '#e2e8f0',
					border: '1px solid rgba(148, 163, 184, 0.25)',
					borderRadius: '12px',
					backdropFilter: 'blur(10px)',
				},
				success: {
					iconTheme: {
						primary: '#22c55e',
						secondary: '#0f172a',
					},
				},
				error: {
					iconTheme: {
						primary: '#fb7185',
						secondary: '#0f172a',
					},
				},
			}}
		/>
	);
};
