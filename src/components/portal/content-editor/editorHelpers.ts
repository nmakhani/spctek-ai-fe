export function execCommand(command: string, value: string | undefined = undefined) {
	document.execCommand(command, false, value);
}

export function normalizePlainTextPaste(text: string): string {
	return text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
		.join('');
}

export function dataUrlToFile(dataUrl: string, fileName: string): File | null {
	const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/i);
	if (!match) return null;

	const mimeType = match[1];
	const base64 = match[2];
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return new File([bytes], fileName, { type: mimeType });
}

export function decodeHtmlEntities(input: string): string {
	if (!input || typeof document === 'undefined') return input;
	const textarea = document.createElement('textarea');
	textarea.innerHTML = input;
	return textarea.value;
}

export function getSelectionRange(): Range | null {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return null;
	return selection.getRangeAt(0);
}

export function wrapSelectionWithElement(createElement: () => HTMLElement): boolean {
	const range = getSelectionRange();
	if (!range || range.collapsed) return false;

	const wrapper = createElement();
	const contents = range.extractContents();
	wrapper.appendChild(contents);
	range.insertNode(wrapper);

	const selection = window.getSelection();
	if (selection) {
		selection.removeAllRanges();
		const nextRange = document.createRange();
		nextRange.selectNodeContents(wrapper);
		selection.addRange(nextRange);
	}

	return true;
}

export function selectNode(node: Node): void {
	const selection = window.getSelection();
	if (!selection) return;

	const range = document.createRange();
	range.selectNode(node);
	selection.removeAllRanges();
	selection.addRange(range);
}

export function normalizeHref(rawHref: string): string {
	const value = rawHref.trim();
	if (!value) return '';

	if (value.startsWith('#') || value.startsWith('?') || value.startsWith('/')) return value;
	if (value.startsWith('//')) return `https:${value}`;
	if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)) return value;

	return `https://${value}`;
}

export function insertLink(href: string): boolean {
	const cleanHref = href.trim();
	const normalizedHref = normalizeHref(cleanHref);
	if (!cleanHref) return false;

	const range = getSelectionRange();
	if (!range) return false;

	try {
		const sel = window.getSelection();
		const node = sel?.anchorNode ?? null;
		const element = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
		const existingAnchor = element?.closest('a') as HTMLAnchorElement | null;
		if (existingAnchor) {
			existingAnchor.setAttribute('href', normalizedHref);
			existingAnchor.target = '_blank';
			existingAnchor.setAttribute('rel', 'noopener noreferrer');
			return true;
		}
	} catch (err) {
		console.error('Error updating existing link:', err);
	}

	if (range.collapsed) {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', normalizedHref);
		anchor.target = '_blank';
		anchor.rel = 'noopener noreferrer';
		anchor.textContent = cleanHref;
		range.insertNode(anchor);
		return true;
	}

	try {
		unwrapElementsInRange(range, 'a');
	} catch (err) {
		console.error('Error unwrapping element in range:', err);
	}

	return wrapSelectionWithElement(() => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', normalizedHref);
		anchor.target = '_blank';
		anchor.rel = 'noopener noreferrer';
		return anchor;
	});
}

export function applyHighlight(): boolean {
	return wrapSelectionWithElement(() => {
		const mark = document.createElement('mark');
		mark.style.backgroundColor = '#fff59d';
		mark.style.color = 'inherit';
		return mark;
	});
}

export function getClosestSelectionElement(tagName: string): HTMLElement | null {
	const selection = window.getSelection();
	if (!selection) return null;

	if (selection.rangeCount > 0) {
		const range = selection.getRangeAt(0);
		if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.ELEMENT_NODE) {
			const container = range.startContainer as Element;
			if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
				return container as HTMLElement;
			}
		}

		const commonAncestor = range.commonAncestorContainer;
		const ancestorElement =
			commonAncestor.nodeType === Node.ELEMENT_NODE ? (commonAncestor as Element) : commonAncestor.parentElement;
		if (ancestorElement) {
			const found = ancestorElement.querySelector(tagName);
			if (found) return found as HTMLElement;
		}
	}

	const node = selection.anchorNode;
	const element = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
	return element?.closest(tagName) as HTMLElement | null;
}

export function unwrapElementsInRange(range: Range, selector: string) {
	const container =
		range.commonAncestorContainer instanceof Element
			? range.commonAncestorContainer
			: (range.commonAncestorContainer.parentElement as Element | null);
	if (!container) return;
	const els = Array.from(container.querySelectorAll(selector));
	for (const el of els) {
		try {
			if (range.intersectsNode(el)) {
				const parent = el.parentNode;
				if (!parent) continue;
				while (el.firstChild) parent.insertBefore(el.firstChild, el);
				parent.removeChild(el);
			}
		} catch (err) {
			console.error('Error unwrapping element in range:', err);
		}
	}
}

export function getSelectedLink(): HTMLAnchorElement | null {
	const sel = window.getSelection();
	if (!sel?.anchorNode) return null;
	const node = sel.anchorNode;
	const el = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
	return el?.closest('a') as HTMLAnchorElement | null;
}

export function removeLink(): boolean {
	const link = getSelectedLink();
	if (!link) return false;
	const parent = link.parentNode;
	if (!parent) return false;
	while (link.firstChild) parent.insertBefore(link.firstChild, link);
	parent.removeChild(link);
	return true;
}

// (duplicate removed) Use exported `unwrapElementsInRange` above.
