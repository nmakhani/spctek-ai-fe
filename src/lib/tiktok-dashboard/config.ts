export const TIKTOK_CLIENT_KEY = 'sbawqtk1g73h4tjqgy';
export const TIKTOK_REDIRECT_URI = 'https://n8n.spctek.com/webhook/auth-sm-posting';
export const TIKTOK_AUTHORIZATION_ENDPOINT = 'https://www.tiktok.com/v2/auth/authorize';
export const TIKTOK_USER_STORAGE_KEY = 'tiktok-user';

export const TIKTOK_SCOPES = [
	'user.info.basic',
	'user.info.profile',
	'user.info.stats',
	'video.publish',
	'video.upload',
	'video.list',
] as const;
