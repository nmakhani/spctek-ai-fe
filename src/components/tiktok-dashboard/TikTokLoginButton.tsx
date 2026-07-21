'use client';

import {
	TIKTOK_AUTHORIZATION_ENDPOINT,
	TIKTOK_CLIENT_KEY,
	TIKTOK_REDIRECT_URI,
	TIKTOK_SCOPES,
} from '@/lib/tiktok-dashboard/config';

function generateStateToken() {
	const randomValues = new Uint8Array(16);
	const digits: number[] = [];

	while (digits.length < 16) {
		crypto.getRandomValues(randomValues);

		for (const value of randomValues) {
			if (value < 250) digits.push(value % 10);
			if (digits.length === 16) break;
		}
	}

	return digits.join('');
}

function buildTikTokAuthorizationUrl(state: string) {
	const url = new URL(TIKTOK_AUTHORIZATION_ENDPOINT);

	url.searchParams.set('client_key', TIKTOK_CLIENT_KEY);
	url.searchParams.set('state', state);
	url.searchParams.set('scope', TIKTOK_SCOPES.join(','));
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('redirect_uri', TIKTOK_REDIRECT_URI);

	return url.toString();
}

export function TikTokLoginButton() {
	const handleContinue = () => {
		const state = generateStateToken();

		window.location.assign(buildTikTokAuthorizationUrl(state));
	};

	return (
		<button
			type="button"
			onClick={handleContinue}
			className="inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-2xl bg-[#606bfa] px-7 py-4 text-base font-semibold text-white shadow-[0_0_28px_rgba(96,107,250,0.36)] transition hover:bg-[#6f79ff] hover:shadow-[0_0_34px_rgba(96,107,250,0.58)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc] focus-visible:ring-offset-4 focus-visible:ring-offset-[#020617] active:scale-[0.99]"
		>
			Continue with TikTok
		</button>
	);
}
