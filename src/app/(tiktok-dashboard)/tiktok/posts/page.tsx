import { redirect } from 'next/navigation';

import { TikTokPostsList } from '@/components/tiktok-dashboard/TikTokPostsList';

interface TikTokPostsPageProps {
	searchParams: Promise<{ state?: string | string[] }>;
}

export default async function TikTokPostsPage({ searchParams }: TikTokPostsPageProps) {
	const params = await searchParams;
	const state = Array.isArray(params.state) ? params.state[0] : params.state;

	if (!state) redirect('/tiktok');

	return <TikTokPostsList state={state} />;
}
