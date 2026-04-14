import apiClient from './api';

type PresignedUploadResponse = {
	upload_url: string;
	key: string;
	public_url?: string | null;
};

function normalizePath(value: string): string {
	return value.replace(/^\/+/, '');
}

function getKeyFromCloudflareS3Url(value: string): string | null {
	try {
		const url = new URL(value);
		if (!url.hostname.endsWith('.r2.cloudflarestorage.com')) {
			return null;
		}

		const segments = normalizePath(url.pathname).split('/').filter(Boolean);
		if (!segments.length) {
			return null;
		}

		// Path-style: /bucket/key
		if (segments.length >= 2) {
			return segments.slice(1).join('/');
		}

		// Virtual-hosted style: /key
		return segments[0];
	} catch {
		return null;
	}
}

export function resolveR2PublicUrl(value: string): string {
	if (!value) {
		return '';
	}

	if (value.startsWith('blob:') || value.startsWith('data:')) {
		return value;
	}

	const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL?.replace(/\/$/, '');

	if (/^https?:\/\//i.test(value)) {
		const extractedKey = getKeyFromCloudflareS3Url(value);
		if (extractedKey && publicBaseUrl) {
			return `${publicBaseUrl}/${normalizePath(extractedKey)}`;
		}
		return value;
	}

	if (!publicBaseUrl) {
		return value;
	}

	return `${publicBaseUrl}/${normalizePath(value)}`;
}

export async function uploadFileToR2(file: File): Promise<{ key: string; publicUrl: string }> {
	const response = await apiClient.post<PresignedUploadResponse>('/get-upload-url', {
		filename: file.name,
		content_type: file.type || 'application/octet-stream',
	});

	const data = response.data;

	const putResponse = await fetch(data.upload_url, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type || 'application/octet-stream',
		},
		body: file,
	});

	if (!putResponse.ok) {
		throw new Error('Failed to upload file to R2');
	}

	return {
		key: data.key,
		publicUrl: resolveR2PublicUrl(data.key),
	};
}
