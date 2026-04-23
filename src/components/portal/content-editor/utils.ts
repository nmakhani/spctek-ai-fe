import type { OutputData } from '@editorjs/editorjs';
import { uploadFileToR2 } from '@/lib/r2';

import type { ContentType } from '@/lib/api';
import type { CaseStudyKpi } from './types';
import { EMPTY_EDITOR_DATA, EMPTY_KPIS } from './types';

type JsonObject = Record<string, unknown>;

type ParsedContentPayload = {
	editorData: OutputData;
	kpis: CaseStudyKpi[];
};

function hasEditorBlocks(value: unknown): value is OutputData {
	return Boolean(value && typeof value === 'object' && Array.isArray((value as OutputData).blocks));
}

function extractEditorDataCandidate(parsed: unknown): OutputData | null {
	if (hasEditorBlocks(parsed)) {
		return parsed;
	}

	if (!parsed || typeof parsed !== 'object') {
		return null;
	}

	const record = parsed as Record<string, unknown>;
	const nestedCandidates = [record.editor_data, record.editorData, record.data, record.content];
	for (const candidate of nestedCandidates) {
		if (hasEditorBlocks(candidate)) {
			return candidate;
		}
	}

	return null;
}

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
		const parsed = JSON.parse(content) as unknown;
		const editorData = extractEditorDataCandidate(parsed);
		if (editorData) {
			return editorData;
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

function normalizeKpis(value: unknown): CaseStudyKpi[] {
	if (!Array.isArray(value)) {
		return EMPTY_KPIS.map((item) => ({ ...item }));
	}

	const normalized = value.slice(0, 2).map((item) => {
		if (!item || typeof item !== 'object') {
			return { stat: '', description: '' };
		}
		const record = item as Record<string, unknown>;
		return {
			stat: String(record.stat ?? '').slice(0, 10),
			description: String(record.description ?? '').slice(0, 20),
		};
	});

	while (normalized.length < 2) {
		normalized.push({ stat: '', description: '' });
	}

	return normalized;
}

export function parseContentPayload(content: string): ParsedContentPayload {
	if (!content.trim()) {
		return {
			editorData: { ...EMPTY_EDITOR_DATA },
			kpis: EMPTY_KPIS.map((item) => ({ ...item })),
		};
	}

	try {
		const parsed = JSON.parse(content) as unknown;
		if (parsed && typeof parsed === 'object') {
			const record = parsed as Record<string, unknown>;
			const editorData = extractEditorDataCandidate(parsed);
			return {
				editorData: editorData || { ...EMPTY_EDITOR_DATA },
				kpis: normalizeKpis(record.kpis),
			};
		}
	} catch {
		// Fallback to existing parser for legacy plain-text or legacy editor JSON content.
	}

	return {
		editorData: parseEditorData(content),
		kpis: EMPTY_KPIS.map((item) => ({ ...item })),
	};
}

export function serializeContentPayload(
	contentType: ContentType,
	editorData: OutputData,
	kpis: CaseStudyKpi[]
): string {
	if (contentType !== 'CASE_STUDY') {
		return JSON.stringify(editorData);
	}

	return JSON.stringify({
		time: editorData.time,
		blocks: editorData.blocks,
		kpis: normalizeKpis(kpis),
		version: editorData.version,
	});
}

export function extractPreviewText(content: string): string {
	try {
		const parsed = JSON.parse(content) as unknown;
		const editorData = extractEditorDataCandidate(parsed);
		if (!editorData) {
			return content;
		}
		const firstParagraph = editorData.blocks.find((block) => block.type === 'paragraph');
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
