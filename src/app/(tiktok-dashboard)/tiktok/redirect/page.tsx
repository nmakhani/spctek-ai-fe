import { TikTokRedirectHandler } from '@/components/tiktok-dashboard/TikTokRedirectHandler';

interface TikTokRedirectPageProps {
	searchParams: Promise<{
		avatar_url?: string;
		state?: string;
		username?: string;
	}>;
}

export default async function TikTokRedirectPage({ searchParams }: TikTokRedirectPageProps) {
	const { avatar_url: avatarUrl, state, username } = await searchParams;

	return <TikTokRedirectHandler avatarUrl={avatarUrl} state={state} username={username} />;
}
