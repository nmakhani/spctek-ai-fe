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
			// Check if it's legacy EditorJS format
			if (Array.isArray((record as { blocks?: unknown[] }).blocks)) {
				// Legacy format - extract HTML from blocks
				const blocks = (record as { blocks?: unknown[] }).blocks || [];
				let html = '';
				for (const block of blocks) {
					if (typeof block === 'object' && block !== null) {
						const blockData = block as Record<string, unknown>;
						if (blockData.type === 'paragraph' && blockData.data) {
							const text = String((blockData.data as Record<string, unknown>).text || '');
							html += `<p>${text}</p>`;
						} else if (blockData.type === 'header' && blockData.data) {
							const text = String((blockData.data as Record<string, unknown>).text || '');
							const level = Number((blockData.data as Record<string, unknown>).level || 2);
							html += `<h${level}>${text}</h${level}>`;
						} else if (blockData.type === 'list' && blockData.data) {
							const items = ((blockData.data as Record<string, unknown>).items as string[]) || [];
							const style = String((blockData.data as Record<string, unknown>).style || 'unordered');
							const tag = style === 'ordered' ? 'ol' : 'ul';
							html += `<${tag}>${items.map((item) => `<li>${item}</li>`).join('')}</${tag}>`;
						} else if (blockData.type === 'image' && blockData.data) {
							const file = ((blockData.data as Record<string, unknown>).file as Record<string, unknown>) || {};
							const url = String(file.url || '');
							const caption = String((blockData.data as Record<string, unknown>).caption || '');
							html += `<img src="${url}" alt="${caption}" style="max-width:100%;border-radius:0.75rem;" />`;
						}
					}
				}
				return {
					html,
					kpis: normalizeKpis(record.kpis),
				};
			}
			// New format - content is HTML string
			return {
				html: contentStr,
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

type PastedImageHandler = (dataUrl: string, index: number) => string | null;

function parseStyle(style: string): Record<string, string> {
	return style
		.split(';')
		.map((entry) => entry.trim())
		.filter(Boolean)
		.reduce<Record<string, string>>((acc, entry) => {
			const separatorIndex = entry.indexOf(':');
			if (separatorIndex === -1) return acc;
			const key = entry.slice(0, separatorIndex).trim().toLowerCase();
			const value = entry.slice(separatorIndex + 1).trim();
			if (key) acc[key] = value;
			return acc;
		}, {});
}

function isBoldStyle(style: string, tag: string): boolean {
	if (tag === 'b' || tag === 'strong') return true;
	if (!['span', 'font', 'i', 'em', 'u', 's', 'strike', 'a'].includes(tag)) return false;
	const parsed = parseStyle(style);
	const weight = (parsed['font-weight'] || '').toLowerCase();
	return weight === 'bold' || weight === 'bolder' || /^(?:[5-9]00)$/.test(weight);
}

function isHighlightStyle(style: string, tag: string): boolean {
	if (tag === 'mark') return true;
	if (!['span', 'font', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'a'].includes(tag)) return false;
	const parsed = parseStyle(style);
	const background = (parsed['background-color'] || '').toLowerCase();
	if (!background) return false;

	return /^(?:#(?:ffff00|ff0|fff59d|fff2ac)|yellow|rgb\(255,\s*255,\s*0\)|rgba\(255,\s*255,\s*0,\s*[\d.]+\))$/.test(
		background
	);
}

export function sanitizePastedHtml(html: string, onDataImage?: PastedImageHandler): string {
	if (!html) return '';
	if (typeof document === 'undefined') return minifyHtml(html);

	const parser = new DOMParser();
	const sourceDoc = parser.parseFromString(html, 'text/html');
	// Remove common dangerous nodes first
	sourceDoc.querySelectorAll('script, style, meta, link, head').forEach((node) => node.remove());
	// Some pasted HTML (e.g., from Word) includes namespaced tags like o:p which cannot be selected
	// with querySelectorAll using a colon. Remove any element whose localName contains a colon.
	Array.from(sourceDoc.getElementsByTagName('*')).forEach((el) => {
		const ln = (el as Element).localName || '';
		if (ln.includes(':')) {
			el.remove();
		}
	});

	const targetDoc = document.implementation.createHTMLDocument('');
	let imageIndex = 0;

	const sanitizeChildren = (parent: ParentNode): Node[] => {
		const nodes: Node[] = [];

		parent.childNodes.forEach((child) => {
			if (child.nodeType === Node.TEXT_NODE) {
				const text = child.textContent ?? '';
				if (text) nodes.push(targetDoc.createTextNode(text));
				return;
			}

			if (child.nodeType !== Node.ELEMENT_NODE) return;

			const element = child as HTMLElement;
			const tag = element.tagName.toLowerCase();
			const style = element.getAttribute('style') || '';
			const isBodyChild = element.parentElement === sourceDoc.body;
			const hasBlockChildren = Array.from(element.children).some((childEl) =>
				[
					'p',
					'div',
					'blockquote',
					'ul',
					'ol',
					'li',
					'table',
					'tr',
					'td',
					'th',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'pre',
				].includes(childEl.tagName.toLowerCase())
			);

			if (tag === 'img') {
				const source = element.getAttribute('src') || '';
				if (!source) return;

				let finalSource = source;
				if (source.startsWith('data:image/')) {
					finalSource = onDataImage?.(source, imageIndex++) || '';
				}

				if (!finalSource) return;

				const img = targetDoc.createElement('img');
				img.setAttribute('src', finalSource);
				const alt = element.getAttribute('alt');
				if (alt) img.setAttribute('alt', alt);
				const title = element.getAttribute('title');
				if (title) img.setAttribute('title', title);
				img.setAttribute('style', 'max-width:100%;border-radius:0.75rem;');
				nodes.push(img);
				return;
			}

			if (isHighlightStyle(style, tag)) {
				const mark = targetDoc.createElement('mark');
				const inlineStyle = element.getAttribute('style') || '';
				if (inlineStyle) {
					mark.setAttribute('style', 'background-color:#fff59d;color:inherit;');
				}
				mark.append(...sanitizeChildren(element));
				nodes.push(mark);
				return;
			}

			if (isBoldStyle(style, tag)) {
				if (isBodyChild || hasBlockChildren) {
					nodes.push(...sanitizeChildren(element));
					return;
				}

				const strong = targetDoc.createElement('strong');
				strong.append(...sanitizeChildren(element));
				nodes.push(strong);
				return;
			}

			if (['p', 'div', 'blockquote', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre'].includes(tag)) {
				const block = targetDoc.createElement(tag === 'div' ? 'p' : tag);
				block.append(...sanitizeChildren(element));
				nodes.push(block);
				return;
			}

			if (tag === 'a') {
				const href = element.getAttribute('href') || '';
				if (!href) {
					nodes.push(...sanitizeChildren(element));
					return;
				}

				const anchor = targetDoc.createElement('a');
				anchor.setAttribute('href', href);
				anchor.setAttribute('rel', 'noopener noreferrer');
				const target = element.getAttribute('target');
				if (target) anchor.setAttribute('target', target);
				const title = element.getAttribute('title');
				if (title) anchor.setAttribute('title', title);
				anchor.append(...sanitizeChildren(element));
				nodes.push(anchor);
				return;
			}

			const allowedTags = new Set([
				'p',
				'div',
				'br',
				'b',
				'strong',
				'i',
				'em',
				'u',
				's',
				'strike',
				'mark',
				'code',
				'pre',
				'blockquote',
				'ul',
				'ol',
				'li',
				'hr',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
			]);

			if (!allowedTags.has(tag)) {
				nodes.push(...sanitizeChildren(element));
				return;
			}

			const nextTag = tag === 'div' ? 'p' : tag;
			const cleaned = targetDoc.createElement(nextTag);
			cleaned.append(...sanitizeChildren(element));
			nodes.push(cleaned);
		});

		return nodes;
	};

	const container = targetDoc.createElement('div');
	container.append(...sanitizeChildren(sourceDoc.body));

	return minifyHtml(container.innerHTML);
}

export function minifyHtml(html: string): string {
	if (!html) return html;

	// Preserve empty lines by converting them to <br> tags before minifying
	// This ensures line breaks are preserved as semantic HTML rather than whitespace
	const preprocessed = html
		.trim()
		// Convert one or more consecutive newlines to <br> tags
		.replace(/(\r?\n\s*)+/g, '<br>');

	const compact = preprocessed
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
