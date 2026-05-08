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

function stripFontStyles(style: string): string {
	const parsed = parseStyle(style);
	const stylesToRemove = ['font-family', 'font-size', 'font-weight'];
	const filtered = Object.entries(parsed)
		.filter(([key]) => !stylesToRemove.includes(key))
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ');
	return filtered;
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
			const style = stripFontStyles(element.getAttribute('style') || '');
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
				const headingStyles: Record<string, string> = {
					h1: 'font-family: Gued, Outfit, system-ui, sans-serif; font-size: 2.25em; font-weight: normal',
					h2: 'font-family: Gued, Outfit, system-ui, sans-serif; font-size: 1.5em; font-weight: normal',
					h3: 'font-family: Gued, Outfit, system-ui, sans-serif; font-size: 1.2em; font-weight: 500',
				};

				let finalTag = tag === 'div' ? 'p' : tag;
				// Convert h4-h6 to h3
				if (['h4', 'h5', 'h6'].includes(tag)) {
					finalTag = 'h3';
				}

				const block = targetDoc.createElement(finalTag);

				// Apply heading styles if it's a heading
				if (headingStyles[finalTag]) {
					block.setAttribute('style', headingStyles[finalTag]);
				}

				// For headings, strip styles from children to enforce the heading style
				if (headingStyles[finalTag]) {
					const children = Array.from(element.childNodes);
					children.forEach((child) => {
						if (child.nodeType === Node.ELEMENT_NODE) {
							const childEl = child as HTMLElement;
							childEl.removeAttribute('style');
						}
					});
				}

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

	function formatNode(node: Node, depth: number): string {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent || '';
			if (text.trim()) {
				return text;
			}
			return '';
		}

		if (node.nodeType !== Node.ELEMENT_NODE) {
			return '';
		}

		const element = node as HTMLElement;
		const tagName = element.tagName.toLowerCase();
		const isVoid = ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName);

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

		if (!hasElementChildren && !hasTextChildren) {
			return indentStr.repeat(depth) + `<${tagName}${attrs}></${tagName}>`;
		}

		// Format children preserving order
		const formattedChildren = children
			.map((child) => formatNode(child, hasElementChildren ? depth + 1 : 0))
			.filter(Boolean);

		if (hasTextChildren && !hasElementChildren) {
			// Text-only element: put content on its own line
			const innerText = formattedChildren.join('').trim();
			return `${indentStr.repeat(depth)}<${tagName}${attrs}>\n${innerText}\n${indentStr.repeat(depth)}</${tagName}>`;
		}

		if (hasElementChildren) {
			// Has element children: join with newlines for structure
			const innerContent = formattedChildren.join('\n');
			return `${indentStr.repeat(depth)}<${tagName}${attrs}>\n${innerContent}\n${indentStr.repeat(depth)}</${tagName}>`;
		}

		return `${indentStr.repeat(depth)}<${tagName}${attrs}></${tagName}>`;
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
