import { TIKTOK_CREATOR_INFO_ENDPOINT } from './config';

export interface CreatorInfo {
	nickname: string;
	username: string;
	avatarUrl: string;
	privacyLevelOptions: string[];
	commentDisabled: boolean;
	duetDisabled: boolean;
	stitchDisabled: boolean;
	maxVideoPostDurationSec: number;
}

export class CreatorInfoFetchError extends Error {
	readonly status: number | undefined;

	constructor(message: string, status?: number) {
		super(message);
		this.name = 'CreatorInfoFetchError';
		this.status = status;
	}
}

function isCreatorInfo(value: unknown): value is CreatorInfo {
	if (!value || typeof value !== 'object') return false;

	const creatorInfo = value as Record<string, unknown>;
	return (
		typeof creatorInfo.nickname === 'string' &&
		typeof creatorInfo.username === 'string' &&
		typeof creatorInfo.avatarUrl === 'string' &&
		Array.isArray(creatorInfo.privacyLevelOptions) &&
		creatorInfo.privacyLevelOptions.every((option) => typeof option === 'string') &&
		typeof creatorInfo.commentDisabled === 'boolean' &&
		typeof creatorInfo.duetDisabled === 'boolean' &&
		typeof creatorInfo.stitchDisabled === 'boolean' &&
		typeof creatorInfo.maxVideoPostDurationSec === 'number'
	);
}

export async function fetchCreatorInfo(state: string): Promise<CreatorInfo> {
	const endpoint = new URL(TIKTOK_CREATOR_INFO_ENDPOINT);
	endpoint.searchParams.set('state', state);

	let response: Response;
	try {
		response = await fetch(endpoint, { cache: 'no-store' });
	} catch {
		throw new CreatorInfoFetchError('Unable to reach TikTok creator information.');
	}

	if (!response.ok) {
		let message = `Creator information request failed (${response.status}).`;
		try {
			const errorBody: unknown = await response.json();
			if (
				errorBody &&
				typeof errorBody === 'object' &&
				typeof (errorBody as Record<string, unknown>).error === 'string'
			) {
				message = (errorBody as { error: string }).error;
			}
		} catch {
		}
		throw new CreatorInfoFetchError(message, response.status);
	}

	const responseBody: unknown = await response.json();
	if (!isCreatorInfo(responseBody)) {
		throw new CreatorInfoFetchError('TikTok creator information was returned in an invalid format.');
	}

	return responseBody;
}
