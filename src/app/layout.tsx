import './globals.css';

import type { Metadata } from 'next';

import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
	title: 'SPCTEK AI - Build a System. Not a Spreadsheet.',
	description: 'AI-native operations platform.',
	icons: { icon: '/favicon-dark.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className="bg-[#020617] text-white antialiased">
				<ToastProvider />
				{children}
			</body>
		</html>
	);
}
