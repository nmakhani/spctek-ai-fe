'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { isTikTokUser, saveTikTokUser } from '@/lib/tiktok-dashboard/user';

interface TikTokRedirectHandlerProps {
	avatarUrl?: string;
	privacyLevels?: string | string[];
	state?: string;
	username?: string;
}

function normalizePrivacyLevels(privacyLevels?: string | string[]) {
	if (!privacyLevels) return [];

	return (Array.isArray(privacyLevels) ? privacyLevels : [privacyLevels]).flatMap((level) => {
		if (typeof level !== 'string' || level.length === 0) return [];

		try {
			const parsed: unknown = JSON.parse(level);
			if (Array.isArray(parsed)) return parsed.filter((value): value is string => typeof value === 'string' && value.length > 0);
		} catch {
			// Repeated query parameters are already individual privacy values.
		}

		return [level];
	});
}

function getFullAvatarUrl() {
	if (typeof window === 'undefined') return undefined;

	const avatarParameterIndex = window.location.search.indexOf('avatar_url=');
	if (avatarParameterIndex === -1) return undefined;

	const rawAvatarUrl = window.location.search.slice(avatarParameterIndex + 'avatar_url='.length);

	try {
		return decodeURIComponent(rawAvatarUrl);
	} catch {
		return rawAvatarUrl;
	}
}

export function TikTokRedirectHandler({ avatarUrl, privacyLevels, state, username }: TikTokRedirectHandlerProps) {
	const router = useRouter();
	const resolvedAvatarUrl = getFullAvatarUrl() ?? avatarUrl;
	const isValidUser = isTikTokUser({ state, username, avatar_url: resolvedAvatarUrl });
	const resolvedPrivacyLevels = normalizePrivacyLevels(privacyLevels);

	useEffect(() => {
		const user = {
			state,
			username,
			avatar_url: getFullAvatarUrl() ?? avatarUrl,
			privacy_levels: resolvedPrivacyLevels,
		};
		if (!isTikTokUser(user)) return;

		saveTikTokUser(user);
		router.replace('/tiktok/dashboard');
	}, [avatarUrl, resolvedPrivacyLevels, router, state, username]);

	if (!isValidUser) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#020617] px-5 text-center text-white">
				<p className="text-sm text-white/70">TikTok authorization details are missing or invalid.</p>
			</main>
		);
	}

	return (
		<main
			className="flex min-h-screen items-center justify-center bg-[#020617] px-5 text-center text-white"
			role="status"
		>
			<p className="text-sm text-white/70">Finishing TikTok sign-in…</p>
		</main>
	);
}
