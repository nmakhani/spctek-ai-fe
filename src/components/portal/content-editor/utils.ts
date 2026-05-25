import { uploadFileToR2 } from '@/lib/r2';
import { EMPTY_KPIS, type CaseStudyKpi } from './types';

type ParsedContentPayload = {
	html: string;
	kpis: CaseStudyKpi[];
};

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
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

export function parseContentPayload(content: string | Record<string, unknown>): ParsedContentPayload {
	const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
	if (!contentStr.trim()) {
		return {
			html: '',
			kpis: EMPTY_KPIS.map((item) => ({ ...item })),
		};
	}

	try {
		const parsed = JSON.parse(contentStr) as unknown;
		if (parsed && typeof parsed === 'object') {
			const record = parsed as Record<string, unknown>;
			const htmlValue =
				typeof record.html === 'string'
					? record.html
					: typeof record.content === 'string'
						? record.content
						: typeof record.body === 'string'
							? record.body
							: contentStr;

			return {
				html: htmlValue,
				kpis: normalizeKpis(record.kpis),
			};
		}
	} catch {
		// Fallback: treat as plain HTML
	}

	return {
		html: contentStr,
		kpis: EMPTY_KPIS.map((item) => ({ ...item })),
	};
}

export async function replaceBlobUrlsInHtml(
	html: string,
	blobFileMap: Record<string, File>,
	uploadedUrlMap: Map<string, string> = new Map()
): Promise<string> {
	const blobRegex = /blob:[^"'\s]+/g;
	const matches = html.match(blobRegex);
	if (!matches) {
		return html;
	}

	let result = html;
	for (const blobUrl of matches) {
		if (!blobFileMap[blobUrl]) {
			console.warn('[content-editor] No file found for blob URL during replacement', {
				blobUrl,
			});
			continue;
		}

		const cached = uploadedUrlMap.get(blobUrl);
		if (cached) {
			result = result.replace(new RegExp(blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), cached);
			continue;
		}

		const uploaded = await uploadFileToR2(blobFileMap[blobUrl]);
		const uploadedUrl = uploaded.publicUrl || uploaded.key;
		console.info('[content-editor] Uploaded blob image to R2', {
			blobUrl,
			uploadedUrl,
		});
		uploadedUrlMap.set(blobUrl, uploadedUrl);
		result = result.replace(new RegExp(blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), uploadedUrl);
	}

	return result;
}

export { sanitizePastedHtml } from './sanitize';

export function minifyHtml(html: string): string {
	if (!html) return html;

	const compact = html
		.trim()
		.replace(/\r?\n+\s*/g, ' ')
		.replace(/>\s+</g, '><')
		.replace(/\s{2,}/g, ' ')
		.trim();

	if (typeof document === 'undefined') {
		return compact;
	}

	const tmp = document.createElement('div');
	tmp.innerHTML = compact;
	return tmp.innerHTML
		.trim()
		.replace(/\r?\n+\s*/g, ' ')
		.replace(/>\s+</g, '><')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

export function prettifyHtml(html: string): string {
	if (!html) return html;

	if (typeof document === 'undefined') {
		return html;
	}

	const tmp = document.createElement('div');
	tmp.innerHTML = html;

	const indentStr = '\t';
	const blockTags = new Set([
		'p',
		'div',
		'blockquote',
		'ul',
		'ol',
		'li',
		'thead',
		'tbody',
		'tr',
		'td',
		'th',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
	]);

	function formatInlineNode(node: Node): string {
		if (node.nodeType === Node.TEXT_NODE) {
			return (node.textContent || '').replace(/\s+/g, ' ').trim();
		}

		if (node.nodeType !== Node.ELEMENT_NODE) return '';

		const element = node as HTMLElement;
		const tagName = element.tagName.toLowerCase();
		const isVoid = ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName);

		let attrs = '';
		for (let i = 0; i < element.attributes.length; i++) {
			const attr = element.attributes[i];
			attrs += ` ${attr.name}="${attr.value}"`;
		}

		if (isVoid) {
			return `<${tagName}${attrs} />`;
		}

		const inner = Array.from(element.childNodes)
			.map((child) => formatInlineNode(child))
			.join('');
		return `<${tagName}${attrs}>${inner}</${tagName}>`;
	}

	function formatNode(node: Node, depth: number): string {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent || '';
			const normalized = text.replace(/\s+/g, ' ').trim();
			return normalized;
		}

		if (node.nodeType !== Node.ELEMENT_NODE) {
			return '';
		}

		const element = node as HTMLElement;
		const tagName = element.tagName.toLowerCase();
		const isVoid = ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName);
		const isBlock = blockTags.has(tagName);

		// Get attributes
		let attrs = '';
		for (let i = 0; i < element.attributes.length; i++) {
			const attr = element.attributes[i];
			attrs += ` ${attr.name}="${attr.value}"`;
		}

		const children = Array.from(element.childNodes);
		const hasTextChildren = children.some((child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim());
		const hasElementChildren = children.some((child) => child.nodeType === Node.ELEMENT_NODE);

		if (isVoid) {
			return indentStr.repeat(depth) + `<${tagName}${attrs} />`;
		}

		if (!isBlock) {
			return formatInlineNode(element);
		}

		if (!hasElementChildren && !hasTextChildren) {
			return indentStr.repeat(depth) + `<${tagName}${attrs}></${tagName}>`;
		}

		const formattedChildren = children.map((child) => formatNode(child, depth + 1)).filter(Boolean);
		const innerContent = formattedChildren.join('\n');
		if (!innerContent) {
			return indentStr.repeat(depth) + `<${tagName}${attrs}></${tagName}>`;
		}

		return `${indentStr.repeat(depth)}<${tagName}${attrs}>\n${innerContent}\n${indentStr.repeat(depth)}</${tagName}>`;
	}

	const formatted = Array.from(tmp.childNodes)
		.map((node) => formatNode(node, 0))
		.filter(Boolean)
		.join('\n');
	return formatted;
}

export function extractHeadingsWithIds(html: string): {
	htmlWithIds: string;
	headings: Array<{ id: string; text: string; level: number; elementId: string }>;
} {
	if (!html) {
		return { htmlWithIds: '', headings: [] };
	}

	const headings: Array<{ id: string; text: string; level: number; elementId: string }> = [];
	let index = 0;

	const htmlWithIds = html.replace(
		/<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/gi,
		(match, level: string, attrs: string, inner: string) => {
			const elementId = `heading-${index++}`;
			const cleanText = inner
				.replace(/<[^>]+>/g, '')
				.replace(/&nbsp;/gi, ' ')
				.trim();
			headings.push({
				id: elementId,
				text: cleanText,
				level: Number(level),
				elementId,
			});

			if (/\sid=/.test(attrs)) {
				return match;
			}

			return `<h${level}${attrs} id="${elementId}">${inner}</h${level}>`;
		}
	);

	return { htmlWithIds, headings };
}
