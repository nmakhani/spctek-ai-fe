import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'TikTok Dashboard | SPCTEK AI',
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
