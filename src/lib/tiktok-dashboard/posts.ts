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

export function emptyStringToNull(value: string): string | null {
	return value.trim() === '' ? null : value;
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

	if (value.scheduledAt !== null && typeof value.scheduledAt !== 'string') {
		issues.push({ path: `${path}.scheduledAt`, expected: 'string or null', received: value.scheduledAt });
	}

	return issues;
}

function validatePostDetail(value: unknown): ValidationIssue[] {
	const issues = validatePostSummary(value, 'post');
	if (!isRecord(value)) return issues;

	const requiredFields: Array<[string, string]> = [
		['description', 'string'],
		['mediaUrl', 'string'],
		['privacyLevel', 'string'],
		['commentsEnabled', 'boolean'],
		['duetEnabled', 'boolean'],
		['stitchEnabled', 'boolean'],
		['brandOrganicToggle', 'boolean'],
		['brandContentToggle', 'boolean'],
		['updatedAt', 'string'],
		['errorMessage', 'string or null'],
		['publishId', 'string or null'],
	];

	for (const [fieldName, expected] of requiredFields) {
		const field = value[fieldName];
		const isOptionalString = fieldName === 'errorMessage' || fieldName === 'publishId';
		if (isOptionalString ? field !== null && typeof field !== 'string' : valueType(field) !== expected) {
			issues.push({ path: `post.${fieldName}`, expected, received: field });
		}
	}

	return issues;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object';
}

function isPostSummary(value: unknown): value is Record<string, unknown> {
	return (
		isRecord(value) &&
		typeof value.id === 'number' &&
		typeof value.title === 'string' &&
		typeof value.mediaType === 'string' &&
		typeof value.status === 'string' &&
		(value.scheduledAt === null || typeof value.scheduledAt === 'string') &&
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

function isPostDetail(value: unknown): value is Record<string, unknown> {
	return (
		isPostSummary(value) &&
		typeof value.description === 'string' &&
		typeof value.mediaUrl === 'string' &&
		typeof value.privacyLevel === 'string' &&
		typeof value.commentsEnabled === 'boolean' &&
		typeof value.duetEnabled === 'boolean' &&
		typeof value.stitchEnabled === 'boolean' &&
		typeof value.brandOrganicToggle === 'boolean' &&
		typeof value.brandContentToggle === 'boolean' &&
		typeof value.updatedAt === 'string' &&
		(value.errorMessage === null || typeof value.errorMessage === 'string') &&
		(value.publishId === null || typeof value.publishId === 'string')
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

	return response.json();
}

function mapSummary(value: Record<string, unknown>): TikTokPostSummary {
	return {
		id: value.id as number,
		title: value.title as string,
		mediaKind: mediaKindFromMime(value.mediaType as string),
		status: normalizeStatus(value.status as string),
		scheduledAt: value.scheduledAt as string | null,
		createdAt: value.createdAt as string,
	};
}

export async function fetchPostsList(state: string): Promise<TikTokPostSummary[]> {
	const endpoint = new URL(POSTS_LIST_ENDPOINT);
	endpoint.searchParams.set('state', state);
	const responseBody = await getJson(endpoint);

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

	if (!isPostDetail(responseBody)) {
		logInvalidResponse(endpoint, responseBody, 'post detail', {
			validationIssues: validatePostDetail(responseBody),
		});
		throw new PostsFetchError('TikTok post details were returned in an invalid format.');
	}

	return {
		...mapSummary(responseBody),
		description: responseBody.description,
		mediaUrl: responseBody.mediaUrl,
		mediaType: responseBody.mediaType,
		privacyLevel: responseBody.privacyLevel,
		commentsEnabled: responseBody.commentsEnabled,
		duetEnabled: responseBody.duetEnabled,
		stitchEnabled: responseBody.stitchEnabled,
		brandOrganicToggle: responseBody.brandOrganicToggle,
		brandContentToggle: responseBody.brandContentToggle,
		errorMessage: emptyStringToNull(responseBody.errorMessage === null ? '' : responseBody.errorMessage),
		updatedAt: responseBody.updatedAt,
		publishId: emptyStringToNull(responseBody.publishId === null ? '' : responseBody.publishId),
	};
}
