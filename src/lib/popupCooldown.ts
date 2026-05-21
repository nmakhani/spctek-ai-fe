const POPUP_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const POPUP_LAST_SEEN_STORAGE_KEY = 'popup-last-seen';

type PopupLastSeenMap = Record<string, number>;

export function normalizePopupPath(path: string): string {
	const [pathname] = path.split('?');
	return pathname || '/';
}

function readLastSeenMap(): PopupLastSeenMap {
	if (typeof window === 'undefined') return {};

	const rawValue = window.localStorage.getItem(POPUP_LAST_SEEN_STORAGE_KEY);
	if (!rawValue) return {};

	try {
		const parsed = JSON.parse(rawValue) as PopupLastSeenMap;
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
}

function writeLastSeenMap(map: PopupLastSeenMap): void {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(POPUP_LAST_SEEN_STORAGE_KEY, JSON.stringify(map));
}

export function getPopupLastSeen(scope: string): number | null {
	const value = readLastSeenMap()[scope];
	return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function hasCooldownElapsed(scope: string, cooldownMs = POPUP_COOLDOWN_MS): boolean {
	const lastSeen = getPopupLastSeen(scope);
	return lastSeen ? Date.now() - lastSeen >= cooldownMs : true;
}

export function markSeen(scope: string): void {
	const lastSeenMap = readLastSeenMap();
	lastSeenMap[scope] = Date.now();
	writeLastSeenMap(lastSeenMap);
}
