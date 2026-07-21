import { TIKTOK_USER_STORAGE_KEY } from './config';

export interface TikTokUser {
	state: string;
	username: string;
	avatar_url: string;
}

let cachedStorageValue: string | null | undefined;
let cachedUser: TikTokUser | null = null;

function isValidAvatarUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' || url.protocol === 'http:';
	} catch {
		return false;
	}
}

export function isTikTokUser(value: unknown): value is TikTokUser {
	if (!value || typeof value !== 'object') return false;

	const user = value as Record<string, unknown>;
	return (
		typeof user.state === 'string' &&
		typeof user.username === 'string' &&
		typeof user.avatar_url === 'string' &&
		isValidAvatarUrl(user.avatar_url)
	);
}

export function getTikTokUser() {
	if (typeof window === 'undefined') return null;

	const storedValue = window.localStorage.getItem(TIKTOK_USER_STORAGE_KEY);
	if (storedValue === cachedStorageValue) return cachedUser;

	cachedStorageValue = storedValue;
	cachedUser = null;

	try {
		const value: unknown = JSON.parse(storedValue ?? 'null');
		cachedUser = isTikTokUser(value) ? value : null;
	} catch {
		cachedUser = null;
	}

	return cachedUser;
}

export function saveTikTokUser(user: TikTokUser) {
	const storedValue = JSON.stringify(user);

	window.localStorage.setItem(TIKTOK_USER_STORAGE_KEY, storedValue);
	cachedStorageValue = storedValue;
	cachedUser = user;
}
