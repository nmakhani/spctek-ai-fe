const POSTS_LIST_ENDPOINT = 'https://n8n.spctek.com/webhook/tiktok-posts-list';
const POST_DETAIL_ENDPOINT = 'https://n8n.spctek.com/webhook/tiktok-post-detail';

export interface TikTokPostSummary {
	id: number;
	title: string;
	mediaKind: 'PHOTO' | 'VIDEO';
	status: 'SCHEDULED' | 'PROCESSING' | 'POSTED' | 'FAILED';
	scheduledAt: string | null;
	createdAt: string;
}

export interface TikTokPostDetail extends TikTokPostSummary {
	description: string;
	mediaUrl: string;
	mediaType: string;
	privacyLevel: string;
	commentsEnabled: boolean;
	duetEnabled: boolean;
	stitchEnabled: boolean;
	brandOrganicToggle: boolean;
	brandContentToggle: boolean;
	errorMessage: string | null;
	updatedAt: string;
	publishId: string | null;
}

export class PostsFetchError extends Error {
	readonly status: number | undefined;

	constructor(message: string, status?: number) {
		super(message);
		this.name = 'PostsFetchError';
		this.status = status;
	}
}

interface RawPostSummaryResponse {
	id: number;
	title: string;
	mediaType: string;
	status: string;
	scheduledAt: string | 0 | null;
	createdAt: string;
}

interface RawPostDetailResponse extends RawPostSummaryResponse {
	description: string | 0 | null;
	mediaUrl: string;
	privacyLevel: string;
	commentsEnabled: number | boolean;
	duetEnabled: number | boolean;
	stitchEnabled: number | boolean;
	brandOrganicToggle: boolean;
	brandContentToggle: boolean;
	updatedAt: string;
	errorMessage: string | 0 | null;
	publishId: string | 0 | null;
}

export function mediaKindFromMime(mimeType: string): 'PHOTO' | 'VIDEO' {
	if (mimeType.startsWith('video/')) return 'VIDEO';
	if (!mimeType.startsWith('image/')) {
		console.warn('[TikTok posts] Unexpected mediaType; defaulting to PHOTO.', {
			received: mimeType,
			expected: 'a MIME type beginning with image/ or video/',
		});
	}
	return 'PHOTO';
}

export function normalizeStatus(raw: string): TikTokPostSummary['status'] {
	const status = raw.toUpperCase();
	if (status === 'SCHEDULED' || status === 'PROCESSING' || status === 'POSTED' || status === 'FAILED') {
		return status;
	}

	console.warn('[TikTok posts] Unexpected status; defaulting to PROCESSING.', {
		received: raw,
		expected: ['Scheduled', 'Processing', 'Posted', 'Failed'],
	});
	return 'PROCESSING';
}

export function normalizeOptionalString(value: unknown): string | null {
	if (typeof value === 'string') return value.trim() === '' ? null : value;
	return null;
}

function normalizeBooleanFlag(value: unknown): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value === 1;
	return false;
}

function logInvalidResponse(endpoint: URL, responseBody: unknown, context: string, details?: Record<string, unknown>) {
	console.error(`[TikTok posts] Invalid ${context} response.`, {
		endpoint: endpoint.toString(),
		...details,
		responseBody,
	});
}

interface ValidationIssue {
	path: string;
	expected: string;
	received: unknown;
}

function valueType(value: unknown) {
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'array';
	return typeof value;
}

function validatePostSummary(value: unknown, path: string): ValidationIssue[] {
	if (!isRecord(value)) {
		return [{ path, expected: 'object', received: value }];
	}

	const issues: ValidationIssue[] = [];
	const requiredFields: Array<[string, string, (field: unknown) => boolean]> = [
		['id', 'number', (field) => typeof field === 'number'],
		['title', 'string', (field) => typeof field === 'string'],
		['mediaType', 'string', (field) => typeof field === 'string'],
		['status', 'string', (field) => typeof field === 'string'],
		['createdAt', 'string', (field) => typeof field === 'string'],
	];

	for (const [fieldName, expected, isValid] of requiredFields) {
		const field = value[fieldName];
		if (!isValid(field)) issues.push({ path: `${path}.${fieldName}`, expected, received: field });
	}

	if (value.scheduledAt !== null && value.scheduledAt !== 0 && typeof value.scheduledAt !== 'string') {
		issues.push({ path: `${path}.scheduledAt`, expected: 'string, 0, or null', received: value.scheduledAt });
	}

	return issues;
}

function validatePostDetail(value: unknown): ValidationIssue[] {
	const issues = validatePostSummary(value, 'post');
	if (!isRecord(value)) return issues;

	const requiredFields: Array<[string, string, (field: unknown) => boolean]> = [
		['description', 'string', (field) => field === undefined || field === null || field === 0 || typeof field === 'string'],
		['mediaUrl', 'string', (field) => typeof field === 'string'],
		['privacyLevel', 'string', (field) => typeof field === 'string'],
		['commentsEnabled', 'boolean or number', (field) => typeof field === 'boolean' || (typeof field === 'number' && (field === 0 || field === 1))],
		['duetEnabled', 'boolean or number', (field) => typeof field === 'boolean' || (typeof field === 'number' && (field === 0 || field === 1))],
		['stitchEnabled', 'boolean or number', (field) => typeof field === 'boolean' || (typeof field === 'number' && (field === 0 || field === 1))],
		['brandOrganicToggle', 'boolean', (field) => typeof field === 'boolean'],
		['brandContentToggle', 'boolean', (field) => typeof field === 'boolean'],
		['updatedAt', 'string', (field) => typeof field === 'string'],
		['errorMessage', 'string or null', (field) => field === null || field === 0 || typeof field === 'string'],
		['publishId', 'string or null', (field) => field === null || field === 0 || typeof field === 'string'],
	];

	for (const [fieldName, expected, isValid] of requiredFields) {
		const field = value[fieldName];
		if (!isValid(field)) {
			issues.push({ path: `post.${fieldName}`, expected, received: field });
		}
	}

	if (value.scheduledAt !== null && value.scheduledAt !== 0 && typeof value.scheduledAt !== 'string') {
		issues.push({ path: 'post.scheduledAt', expected: 'string, 0, or null', received: value.scheduledAt });
	}

	return issues;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object';
}

function isPostSummary(value: unknown): value is RawPostSummaryResponse {
	return (
		isRecord(value) &&
		typeof value.id === 'number' &&
		typeof value.title === 'string' &&
		typeof value.mediaType === 'string' &&
		typeof value.status === 'string' &&
		(value.scheduledAt === null || value.scheduledAt === 0 || typeof value.scheduledAt === 'string') &&
		typeof value.createdAt === 'string'
	);
}

function isNoPostsResponse(value: unknown): boolean {
	return (
		Array.isArray(value) &&
		value.length === 1 &&
		isRecord(value[0]) &&
		typeof value[0].message === 'string' &&
		value[0].message.trim().toLowerCase() === 'no posts found!'
	);
}

function isPostDetail(value: unknown): value is RawPostDetailResponse {
	if (!isRecord(value)) return false;

	const post = value as Record<string, unknown>;
	return (
		typeof post.id === 'number' &&
		typeof post.title === 'string' &&
		(post.description === undefined || post.description === null || post.description === 0 || typeof post.description === 'string') &&
		typeof post.mediaType === 'string' &&
		typeof post.mediaUrl === 'string' &&
		typeof post.privacyLevel === 'string' &&
		(typeof post.commentsEnabled === 'boolean' || (typeof post.commentsEnabled === 'number' && (post.commentsEnabled === 0 || post.commentsEnabled === 1))) &&
		(typeof post.duetEnabled === 'boolean' || (typeof post.duetEnabled === 'number' && (post.duetEnabled === 0 || post.duetEnabled === 1))) &&
		(typeof post.stitchEnabled === 'boolean' || (typeof post.stitchEnabled === 'number' && (post.stitchEnabled === 0 || post.stitchEnabled === 1))) &&
		typeof post.brandOrganicToggle === 'boolean' &&
		typeof post.brandContentToggle === 'boolean' &&
		typeof post.status === 'string' &&
		(post.scheduledAt === null || post.scheduledAt === 0 || typeof post.scheduledAt === 'string') &&
		typeof post.createdAt === 'string' &&
		typeof post.updatedAt === 'string' &&
		(post.errorMessage === null || post.errorMessage === 0 || typeof post.errorMessage === 'string') &&
		(post.publishId === null || post.publishId === 0 || typeof post.publishId === 'string')
	);
}

async function getJson(url: URL): Promise<unknown> {
	let response: Response;
	try {
		response = await fetch(url, { cache: 'no-store' });
	} catch {
		throw new PostsFetchError('Unable to reach TikTok post information.');
	}

	if (!response.ok) {
		let message = `TikTok post request failed (${response.status}).`;
		try {
			const errorBody: unknown = await response.json();
			if (isRecord(errorBody) && typeof errorBody.error === 'string') message = errorBody.error;
		} catch {
			// Keep the HTTP status message when the response is not JSON.
		}
		throw new PostsFetchError(message, response.status);
	}

	const responseText = await response.text();
	if (!responseText || !responseText.trim()) return null;

	try {
		return JSON.parse(responseText);
	} catch (error) {
		console.warn('[TikTok posts] Non-JSON response body received.', {
			endpoint: url.toString(),
			rawBody: responseText,
			error,
		});
		return null;
	}
}

function mapSummary(value: RawPostSummaryResponse): TikTokPostSummary {
	return {
		id: value.id,
		title: value.title,
		mediaKind: mediaKindFromMime(value.mediaType),
		status: normalizeStatus(value.status),
		scheduledAt: typeof value.scheduledAt === 'string' ? value.scheduledAt : null,
		createdAt: value.createdAt,
	};
}

export async function fetchPostsList(state: string): Promise<TikTokPostSummary[]> {
	const endpoint = new URL(POSTS_LIST_ENDPOINT);
	endpoint.searchParams.set('state', state);
	const responseBody = await getJson(endpoint);

	if (responseBody == null) return [];
	if (isNoPostsResponse(responseBody)) return [];

	if (!Array.isArray(responseBody) || !responseBody.every(isPostSummary)) {
		const validationIssues = Array.isArray(responseBody)
			? responseBody.flatMap((item, index) => validatePostSummary(item, `posts[${index}]`))
			: [{ path: 'response', expected: 'array of post summary objects', received: responseBody }];
		logInvalidResponse(endpoint, responseBody, 'posts list', {
			isArray: Array.isArray(responseBody),
			validationIssues,
		});
		throw new PostsFetchError('TikTok posts list was returned in an invalid format.');
	}

	return responseBody.map(mapSummary);
}

export async function fetchPostDetail(id: number): Promise<TikTokPostDetail> {
	const endpoint = new URL(POST_DETAIL_ENDPOINT);
	endpoint.searchParams.set('id', String(id));
	const responseBody = await getJson(endpoint);

	if (responseBody == null) {
		console.warn('[TikTok posts] Empty post detail response received.', { endpoint: endpoint.toString(), id });
		throw new PostsFetchError('TikTok post detail was empty.');
	}

	if (!isPostDetail(responseBody)) {
		logInvalidResponse(endpoint, responseBody, 'post detail', {
			validationIssues: validatePostDetail(responseBody),
		});
		throw new PostsFetchError('TikTok post details were returned in an invalid format.');
	}

	return {
		...mapSummary(responseBody),
		description: typeof responseBody.description === 'string' ? responseBody.description : '',
		mediaUrl: responseBody.mediaUrl,
		mediaType: responseBody.mediaType,
		privacyLevel: responseBody.privacyLevel,
		commentsEnabled: normalizeBooleanFlag(responseBody.commentsEnabled),
		duetEnabled: normalizeBooleanFlag(responseBody.duetEnabled),
		stitchEnabled: normalizeBooleanFlag(responseBody.stitchEnabled),
		brandOrganicToggle: responseBody.brandOrganicToggle,
		brandContentToggle: responseBody.brandContentToggle,
		errorMessage: normalizeOptionalString(responseBody.errorMessage),
		updatedAt: responseBody.updatedAt,
		publishId: normalizeOptionalString(responseBody.publishId),
	};
}
