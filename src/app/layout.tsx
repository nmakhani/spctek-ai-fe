import './globals.css';

import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';

import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
	title: 'SPCTEK AI - Build a System. Not a Spreadsheet.',
	description: 'AI-native operations platform.',
	icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<GoogleTagManager gtmId="GTM-MD27LC69" />
			<body className="text-white antialiased">
				<ToastProvider />
				{children}
			</body>
		</html>
	);
}
