type PastedImageHandler = (dataUrl: string, index: number) => string | null;

function sanitizeHref(rawHref: string): string {
	const value = rawHref.trim();
	if (!value) return '';

	if (value.startsWith('#') || value.startsWith('?') || value.startsWith('/')) return value;
	if (value.startsWith('//')) return `https:${value}`;

	const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z\d+\-.]*):/);
	if (schemeMatch) {
		const scheme = schemeMatch[1].toLowerCase();
		if (['http', 'https', 'mailto', 'tel'].includes(scheme)) return value;
		return '';
	}

	return `https://${value}`;
}

function sanitizeImageSrc(rawSrc: string, onDataImage: PastedImageHandler | undefined, imageIndex: number): string {
	const source = rawSrc.trim();
	if (!source) return '';

	if (source.startsWith('data:image/')) {
		return onDataImage?.(source, imageIndex) || '';
	}

	if (source.startsWith('blob:') || source.startsWith('/') || source.startsWith('//')) {
		return source.startsWith('//') ? `https:${source}` : source;
	}

	const schemeMatch = source.match(/^([a-zA-Z][a-zA-Z\d+\-.]*):/);
	if (schemeMatch) {
		const scheme = schemeMatch[1].toLowerCase();
		return ['http', 'https'].includes(scheme) ? source : '';
	}

	return source;
}

function sanitizeImageStyle(rawStyle: string): string {
	const allowed: string[] = [];

	for (const declaration of rawStyle.split(';')) {
		const [rawProperty, ...rawValueParts] = declaration.split(':');
		if (!rawProperty || rawValueParts.length === 0) continue;

		const property = rawProperty.trim().toLowerCase();
		const value = rawValueParts.join(':').trim().toLowerCase();

		if (property === 'max-width' && /^(\d+(\.\d+)?(px|rem|em|%)|none)$/.test(value)) {
			allowed.push(`${property}: ${value}`);
		}

		if (property === 'border-radius' && /^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) {
			allowed.push(`${property}: ${value}`);
		}
	}

	return allowed.join('; ');
}

function isWhitespaceOnlyNode(node: Node): boolean {
	if (node.nodeType === Node.TEXT_NODE) {
		return !(node.textContent || '').trim();
	}

	if (node.nodeType !== Node.ELEMENT_NODE) {
		return false;
	}

	const element = node as HTMLElement;
	if (element.tagName.toLowerCase() === 'br') {
		return true;
	}

	return Array.from(element.childNodes).every((child) => isWhitespaceOnlyNode(child));
}

export function sanitizePastedHtml(html: string, onDataImage?: PastedImageHandler): string {
	if (!html) return '';
	if (typeof document === 'undefined') return html;

	const parser = new DOMParser();
	const sourceDoc = parser.parseFromString(html, 'text/html');
	// Remove common dangerous nodes first
	sourceDoc.querySelectorAll('script, style, meta, link, head').forEach((node) => node.remove());
	// Remove namespaced tags
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
			const parentTag = element.parentElement?.tagName.toLowerCase() || '';
			const style = element.getAttribute('style') || '';
			// Remove any inline styles unconditionally
			if (element.hasAttribute('style')) element.removeAttribute('style');

			if (tag === 'img') {
				const source = element.getAttribute('src') || '';
				if (!source) return;

				const finalSource = sanitizeImageSrc(source, onDataImage, imageIndex);
				if (source.trim().startsWith('data:image/')) imageIndex++;

				if (!finalSource) return;

				const img = targetDoc.createElement('img');
				img.setAttribute('src', finalSource);
				if (element.hasAttribute('alt')) img.setAttribute('alt', element.getAttribute('alt') || '');
				const title = element.getAttribute('title');
				if (title) img.setAttribute('title', title);
				const imageStyle = sanitizeImageStyle(style);
				if (imageStyle) img.setAttribute('style', imageStyle);
				nodes.push(img);
				return;
			}

			if (['p', 'div', 'blockquote', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre'].includes(tag)) {
				if (tag === 'p') {
					const cleanedChildren = sanitizeChildren(element);
					if (cleanedChildren.length === 0 || cleanedChildren.every((node) => isWhitespaceOnlyNode(node))) {
						return;
					}

					// Paragraphs inside list items are usually just wrapper tags from paste/editor output.
					// Unwrap them so list markup stays lean and semantic.
					if (parentTag === 'li') {
						nodes.push(...cleanedChildren);
						return;
					}

					const paragraph = targetDoc.createElement('p');
					paragraph.append(...cleanedChildren);
					nodes.push(paragraph);
					return;
				}

				let finalTag = tag === 'div' ? 'p' : tag;
				if (['h4', 'h5', 'h6'].includes(tag)) finalTag = 'h3';

				const block = targetDoc.createElement(finalTag);
				block.append(...sanitizeChildren(element));
				nodes.push(block);
				return;
			}

			if (tag === 'a') {
				const href = sanitizeHref(element.getAttribute('href') || '');
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

	return container.innerHTML
		.trim()
		.replace(/>\s+</g, '><')
		.replace(/\s{2,}/g, ' ');
}

const sanitizeModule = {};

export default sanitizeModule;
