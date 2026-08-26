export const TIKTOK_CLIENT_KEY = 'awaualm56js5m3rg';
export const TIKTOK_REDIRECT_URI = 'https://n8n.spctek.com/webhook/auth-sm-posting';
export const TIKTOK_AUTHORIZATION_ENDPOINT = 'https://www.tiktok.com/v2/auth/authorize';
export const TIKTOK_CREATOR_INFO_ENDPOINT = 'https://n8n.spctek.com/webhook/tiktok-creator-info';
export const TIKTOK_USER_STORAGE_KEY = 'tiktok-user';

export const TIKTOK_SCOPES = [
	'user.info.basic',
	'video.publish',
	'video.upload',
] as const;
