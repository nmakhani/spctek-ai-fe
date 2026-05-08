type ParagraphData = {
	text?: string;
};

type ToolConstructorArgs = {
	data?: ParagraphData;
	readOnly?: boolean;
	api?: {
		blocks?: {
			delete?: (index: number) => void;
			getCurrentBlockIndex?: () => number;
			insert?: (
				type: string,
				data?: ParagraphData,
				config?: Record<string, unknown>,
				index?: number,
				needToFocus?: boolean
			) => void;
		};
	};
};

const TOOLBAR_ACTIONS: Array<{ label: string; command: string; value?: string }> = [
	{ label: 'B', command: 'bold' },
	{ label: 'I', command: 'italic' },
	{ label: 'U', command: 'underline' },
	{ label: '<>', command: 'inlineCode' },
	{ label: 'Highlight', command: 'marker' },
	{ label: 'Hyperlink', command: 'link' },
	{ label: 'Clear Format', command: 'removeFormat' },
];

export default class RichParagraphTool {
	private data: ParagraphData;
	private readOnly: boolean;
	private api: ToolConstructorArgs['api'];
	private wrapper!: HTMLDivElement;
	private editable!: HTMLDivElement;

	static get toolbox() {
		return {
			title: 'Paragraph',
			icon: '<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 5h12v2H6V5zm0 4h12v2H6V9zm0 4h8v2H6v-2zm0 4h8v2H6v-2z" fill="currentColor"/></svg>',
		};
	}

	static get sanitize() {
		return {
			text: true,
		};
	}

	constructor({ data, readOnly, api }: ToolConstructorArgs) {
		this.data = data || {};
		this.readOnly = Boolean(readOnly);
		this.api = api;
	}

	render() {
		this.wrapper = document.createElement('div');
		this.wrapper.className = 'spctek-rich-paragraph';
		this.wrapper.style.position = 'relative';

		if (!this.readOnly) {
			const toolbar = this.createToolbar();
			this.wrapper.appendChild(toolbar);
		}

		this.editable = document.createElement('div');
		this.editable.className = 'spctek-rich-paragraph__content';
		this.editable.contentEditable = String(!this.readOnly);
		this.editable.dataset.placeholder = 'Write your paragraph...';
		this.editable.innerHTML = String(this.data.text || '');

		this.wrapper.appendChild(this.editable);

		return this.wrapper;
	}

	save() {
		return {
			text: this.editable.innerHTML,
		};
	}

	validate(savedData: ParagraphData) {
		return Boolean(String(savedData?.text || '').trim());
	}

	get isEmpty() {
		return !this.editable.textContent?.trim();
	}

	private createToolbar() {
		const toolbar = document.createElement('div');
		toolbar.className = 'spctek-rich-paragraph__toolbar';

		TOOLBAR_ACTIONS.forEach((action) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'spctek-rich-paragraph__btn';
			button.textContent = action.label;
			button.addEventListener('mousedown', (event) => {
				event.preventDefault();
			});
			button.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				this.applyAction(action.command, action.value);
			});
			toolbar.appendChild(button);
		});

		return toolbar;
	}

	private applyAction(command: string, value?: string) {
		this.editable.focus();

		if (command === 'removeFormat') {
			// Only clear formatting for the selected range inside this editable
			const sel = window.getSelection();
			if (!sel || sel.rangeCount === 0) return;
			const range = sel.getRangeAt(0);
			if (range.collapsed) return;
			const plain = range.toString();
			range.deleteContents();
			range.insertNode(document.createTextNode(plain));
			return;
		}

		if (command === 'link') {
			const url = window.prompt('Enter link URL', 'https://');
			if (!url) {
				return;
			}
			document.execCommand('createLink', false, url);
			// ensure created link opens in new tab
			try {
				const sel = window.getSelection();
				const node = sel?.anchorNode ?? null;
				const el = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
				const a = el?.closest('a') as HTMLAnchorElement | null;
				if (a) {
					a.setAttribute('target', '_blank');
					a.setAttribute('rel', 'noopener noreferrer');
				}
			} catch {}
			return;
		}

		if (command === 'inlineCode') {
			const selection = window.getSelection();
			const selectedText = selection?.toString() || '';
			if (!selectedText) {
				return;
			}
			const safeText = selectedText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			document.execCommand('insertHTML', false, `<code>${safeText}</code>`);
			return;
		}

		if (command === 'marker') {
			document.execCommand('backColor', false, '#3f4bf0');
			return;
		}

		document.execCommand(command, false, value);
	}
}
