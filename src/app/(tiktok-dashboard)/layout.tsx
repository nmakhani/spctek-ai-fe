import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'TikTok Dashboard | SPCTEK',
	description: 'Connect your TikTok account to manage videos from your SPCTEK dashboard.',
	icons: { icon: '/favicon.png' },
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
};

export default function TikTokDashboardLayout({ children }: { children: React.ReactNode }) {
	return children;
}
