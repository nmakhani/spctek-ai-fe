import { TIKTOK_USER_STORAGE_KEY } from './config';

export interface TikTokUser {
	state: string;
	username: string;
	avatar_url: string;
	privacy_levels?: string[];
}

let cachedStorageValue: string | null | undefined;
let cachedUser: TikTokUser | null = null;

export function isTikTokUser(value: unknown): value is TikTokUser {
	if (!value || typeof value !== 'object') return false;

	const user = value as Record<string, unknown>;
	return (
		typeof user.state === 'string' &&
		user.state.length > 0 &&
		typeof user.username === 'string' &&
		user.username.length > 0 &&
		typeof user.avatar_url === 'string' &&
		user.avatar_url.length > 0 &&
		(user.privacy_levels === undefined ||
			(Array.isArray(user.privacy_levels) && user.privacy_levels.every((level) => typeof level === 'string')))
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

export function clearTikTokUser() {
	window.localStorage.removeItem(TIKTOK_USER_STORAGE_KEY);
	cachedStorageValue = null;
	cachedUser = null;
}
