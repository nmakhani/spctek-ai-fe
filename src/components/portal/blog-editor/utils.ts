import type { OutputData } from '@editorjs/editorjs';
import { uploadFileToR2 } from '@/lib/r2';

import { EMPTY_EDITOR_DATA } from './types';

type JsonObject = Record<string, unknown>;

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

export function parseEditorData(content: string): OutputData {
	if (!content.trim()) {
		return { ...EMPTY_EDITOR_DATA };
	}

	try {
		const parsed = JSON.parse(content) as OutputData;
		if (parsed && Array.isArray(parsed.blocks)) {
			return parsed;
		}
	} catch {
		// Fall back to a paragraph block for plain text content.
	}

	return {
		time: 0,
		version: '2.31.0',
		blocks: [
			{
				type: 'paragraph',
				data: { text: content },
			},
		],
	};
}

export function extractPreviewText(content: string): string {
	try {
		const parsed = JSON.parse(content) as OutputData;
		const firstParagraph = parsed.blocks.find((block) => block.type === 'paragraph');
		if (!firstParagraph) {
			return content;
		}
		const raw = String((firstParagraph.data as Record<string, unknown>)?.text || '');
		return raw.replace(/<[^>]+>/g, '');
	} catch {
		return content;
	}
}

export async function replaceBlobUrlsRecursively(
	value: unknown,
	blobFileMap: Record<string, File>,
	uploadedUrlMap: Map<string, string> = new Map()
): Promise<unknown> {
	if (typeof value === 'string') {
		if (value.startsWith('blob:') && blobFileMap[value]) {
			const cached = uploadedUrlMap.get(value);
			if (cached) {
				return cached;
			}

			const uploaded = await uploadFileToR2(blobFileMap[value]);
			const uploadedUrl = uploaded.publicUrl || uploaded.key;
			uploadedUrlMap.set(value, uploadedUrl);
			return uploadedUrl;
		}
		return value;
	}

	if (Array.isArray(value)) {
		return Promise.all(value.map((item) => replaceBlobUrlsRecursively(item, blobFileMap, uploadedUrlMap)));
	}

	if (value && typeof value === 'object') {
		const entries = Object.entries(value as JsonObject);
		const transformed = await Promise.all(
			entries.map(async ([key, item]) => {
				const next = await replaceBlobUrlsRecursively(item, blobFileMap, uploadedUrlMap);
				return [key, next] as const;
			})
		);
		return Object.fromEntries(transformed);
	}

	return value;
}
