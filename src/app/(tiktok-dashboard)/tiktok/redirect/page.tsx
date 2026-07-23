import { TikTokRedirectHandler } from '@/components/tiktok-dashboard/TikTokRedirectHandler';

interface TikTokRedirectPageProps {
	searchParams: Promise<{
		avatar_url?: string;
		privacy?: string | string[];
		privacy_levels?: string | string[];
		state?: string;
		username?: string;
	}>;
}

export default async function TikTokRedirectPage({ searchParams }: TikTokRedirectPageProps) {
	const { avatar_url: avatarUrl, privacy, privacy_levels: privacyLevels, state, username } = await searchParams;

	return (
		<TikTokRedirectHandler
			avatarUrl={avatarUrl}
			privacyLevels={privacy ?? privacyLevels}
			state={state}
			username={username}
		/>
	);
}
