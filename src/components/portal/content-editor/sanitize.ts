type PastedImageHandler = (dataUrl: string, index: number) => string | null;

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
			// Remove any inline styles unconditionally
			if (element.hasAttribute('style')) element.removeAttribute('style');

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

	// Minify result via DOM serialization to remove weird spacing
	const tmp = document.createElement('div');
	tmp.appendChild(container);
	return tmp.innerHTML
		.trim()
		.replace(/>\s+</g, '><')
		.replace(/\s{2,}/g, ' ');
}

const sanitizeModule = {};

export default sanitizeModule;
