'use client';

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 5000,
				style: {
					background: 'rgba(17, 23, 42, 0.9)',
					color: '#f8fafc',
					border: '1px solid rgba(160, 166, 252, 0.28)',
					borderRadius: '16px',
					boxShadow: '0 18px 40px rgba(2, 6, 23, 0.45)',
					backdropFilter: 'blur(14px)',
					padding: '12px 14px',
					fontSize: '14px',
					fontWeight: 500,
				},
				success: {
					style: {
						background: 'rgba(37, 45, 82, 0.96)',
						border: '1px solid rgba(129, 140, 248, 0.45)',
					},
					iconTheme: {
						primary: '#8c96ff',
						secondary: '#f8fafc',
					},
				},
				error: {
					style: {
						background: 'rgba(48, 19, 25, 0.96)',
						border: '1px solid rgba(251, 113, 133, 0.4)',
					},
					iconTheme: {
						primary: '#fb7185',
						secondary: '#f8fafc',
					},
				},
			}}
		/>
	);
};
