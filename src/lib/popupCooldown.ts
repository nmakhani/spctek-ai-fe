const POPUP_COOLDOWN_MS = 0.5 * 60 * 1000;
// const POPUP_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const POPUP_LAST_SEEN_STORAGE_KEY = 'popup-last-seen';

type PopupLastSeenMap = Record<string, number>;

export function normalizePopupPath(path: string): string {
	const [pathname] = path.split('?');
	return pathname || '/';
}

function readLastSeenMap(): PopupLastSeenMap {
	if (typeof window === 'undefined') {
		return {};
	}

	const rawValue = window.localStorage.getItem(POPUP_LAST_SEEN_STORAGE_KEY);
	if (!rawValue) {
		return {};
	}

	try {
		const parsed = JSON.parse(rawValue) as PopupLastSeenMap;
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
}

function writeLastSeenMap(map: PopupLastSeenMap): void {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(POPUP_LAST_SEEN_STORAGE_KEY, JSON.stringify(map));
}

export function getPopupLastSeen(scope: string): number | null {
	const lastSeenMap = readLastSeenMap();
	const value = lastSeenMap[scope];
	return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function hasCooldownElapsed(scope: string, cooldownMs = POPUP_COOLDOWN_MS): boolean {
	const lastSeen = getPopupLastSeen(scope);
	if (lastSeen === null) {
		console.log(`[${scope}] No timestamp, elapsed: true`);
		return true;
	}

	const timePassedMs = Date.now() - lastSeen;
	const isElapsed = timePassedMs >= cooldownMs;

	if (process.env.NEXT_PUBLIC_DEV_MODE === '1')
		console.log(`[${scope}]\nCooldown: ${formatDuration(cooldownMs)}\nTime passed: ${formatDuration(timePassedMs)}`);

	return isElapsed;
}

export function markSeen(scope: string): void {
	const lastSeenMap = readLastSeenMap();
	lastSeenMap[scope] = Date.now();
	writeLastSeenMap(lastSeenMap);
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const parts: string[] = [];
	if (hours > 0) parts.push(`${hours} hours`);
	if (minutes > 0) parts.push(`${minutes} minutes`);
	if (seconds > 0 || parts.length === 0) parts.push(`${seconds} seconds`);

	return parts.join(' ');
}
