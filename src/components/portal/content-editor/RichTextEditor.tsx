'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';

import { minifyHtml, sanitizePastedHtml } from './utils';

interface RichTextEditorProps {
	value: string;
	onChange: (html: string) => void;
	onBlobFileMapChange: (map: Record<string, File>) => void;
	placeholder?: string;
}

function execCommand(command: string, value: string | undefined = undefined) {
	document.execCommand(command, false, value);
}

function normalizePlainTextPaste(text: string): string {
	return text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
		.join('');
}

function dataUrlToFile(dataUrl: string, fileName: string): File | null {
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

function getSelectionRange(): Range | null {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return null;
	return selection.getRangeAt(0);
}

function wrapSelectionWithElement(createElement: () => HTMLElement): boolean {
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

function selectNode(node: Node): void {
	const selection = window.getSelection();
	if (!selection) return;

	const range = document.createRange();
	range.selectNode(node);
	selection.removeAllRanges();
	selection.addRange(range);
}

function normalizeHref(rawHref: string): string {
	const value = rawHref.trim();
	if (!value) return '';

	// Keep anchors, query-only links, root-relative paths, protocol-relative URLs, and explicit schemes.
	if (value.startsWith('#') || value.startsWith('?') || value.startsWith('/')) return value;
	if (value.startsWith('//')) return `https:${value}`;
	if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)) return value;

	// Bare domains (e.g. "example.com") should be treated as external URLs.
	return `https://${value}`;
}

function insertLink(href: string): boolean {
	const cleanHref = href.trim();
	const normalizedHref = normalizeHref(cleanHref);
	if (!cleanHref) return false;

	const range = getSelectionRange();
	if (!range) return false;

	if (range.collapsed) {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', normalizedHref);
		anchor.target = '_blank';
		anchor.rel = 'noopener noreferrer';
		anchor.textContent = cleanHref;
		range.insertNode(anchor);
		return true;
	}

	return wrapSelectionWithElement(() => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', normalizedHref);
		anchor.target = '_blank';
		anchor.rel = 'noopener noreferrer';
		return anchor;
	});
}

function applyHighlight(): boolean {
	return wrapSelectionWithElement(() => {
		const mark = document.createElement('mark');
		mark.style.backgroundColor = '#fff59d';
		mark.style.color = 'inherit';
		return mark;
	});
}

function getClosestSelectionElement(tagName: string): HTMLElement | null {
	const selection = window.getSelection();
	const node = selection?.anchorNode;
	const element = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
	return element?.closest(tagName) as HTMLElement | null;
}

// prettifyHtml removed: prettifying caused visual editor layout problems

function ToolbarButton({
	label,
	icon,
	active,
	onClick,
	title,
}: {
	label?: string;
	icon: string;
	active?: boolean;
	onClick: () => void;
	title: string;
}) {
	return (
		<button
			type="button"
			title={title}
			onClick={onClick}
			onMouseDown={(e) => e.preventDefault()}
			className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
				active
					? 'border-[#606bfa]/60 bg-[#606bfa]/25 text-[#a9b2ff]'
					: 'border-white/15 bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white'
			}`}
		>
			{icon}
			{label && <span className="ml-1">{label}</span>}
		</button>
	);
}

export default function RichTextEditor({ value, onChange, onBlobFileMapChange, placeholder }: RichTextEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [htmlMode, setHtmlMode] = useState(false);
	const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());
	const [showHeadingMenu, setShowHeadingMenu] = useState(false);
	const blobFileMapRef = useRef<Record<string, File>>({});

	// Initialize and sync editor content
	useEffect(() => {
		if (editorRef.current && !htmlMode) {
			if (document.activeElement !== editorRef.current && editorRef.current.innerHTML !== value) {
				// Render the normalized/minified HTML in the visual editor so it matches frontend output
				editorRef.current.innerHTML = minifyHtml(value || '');
			}
		}
	}, [value, htmlMode]);

	// Notify parent of blob file map changes
	useEffect(() => {
		onBlobFileMapChange({ ...blobFileMapRef.current });
	}, [onBlobFileMapChange]);

	const updateActiveCommands = useCallback(() => {
		const base = ['bold', 'italic', 'underline', 'strikeThrough'];
		const active = new Set<string>();

		// Basic inline commands
		for (const cmd of base) {
			try {
				if (document.queryCommandState(cmd)) active.add(cmd);
			} catch {
				// ignore
			}
		}

		// Lists
		try {
			if (document.queryCommandState('insertUnorderedList')) active.add('insertUnorderedList');
			if (document.queryCommandState('insertOrderedList')) active.add('insertOrderedList');
		} catch {}

		// Monospace (fontName)
		try {
			const fontName = String(document.queryCommandValue('fontName') || '').toLowerCase();
			if (fontName.includes('mono')) active.add('monospace');
		} catch {}

		// Headings/format block
		try {
			const fb = String(document.queryCommandValue('formatBlock') || '').toLowerCase();
			if (fb.includes('h1')) active.add('h1');
			if (fb.includes('h2')) active.add('h2');
			if (fb.includes('h3')) active.add('h3');
		} catch {}

		try {
			if (getClosestSelectionElement('a')) active.add('link');
			if (getClosestSelectionElement('mark')) active.add('highlight');
		} catch {}

		setActiveCommands(active);
	}, []);

	const handleEditorInput = useCallback(() => {
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
		updateActiveCommands();
	}, [onChange, updateActiveCommands]);

	const handleEditorKeyUp = useCallback(() => {
		updateActiveCommands();
	}, [updateActiveCommands]);

	const handleEditorMouseUp = useCallback(() => {
		updateActiveCommands();
	}, [updateActiveCommands]);

	const handleEditorPaste = useCallback(
		(e: React.ClipboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			const clipboardHtml = e.clipboardData.getData('text/html');
			const clipboardText = e.clipboardData.getData('text/plain');
			const clipboardFiles = Array.from(e.clipboardData.files || []).filter((file) => file.type.startsWith('image/'));
			const handleDataImage = (dataUrl: string, index: number) => {
				const file = dataUrlToFile(dataUrl, `pasted-image-${Date.now()}-${index}.png`);
				if (!file) return null;
				const blobUrl = URL.createObjectURL(file);
				blobFileMapRef.current[blobUrl] = file;
				onBlobFileMapChange({ ...blobFileMapRef.current });
				return blobUrl;
			};

			if (!clipboardHtml && clipboardFiles.length > 0) {
				const imageMarkup = clipboardFiles
					.map((file) => {
						const blobUrl = URL.createObjectURL(file);
						blobFileMapRef.current[blobUrl] = file;
						return `<img src="${blobUrl}" alt="" style="max-width:100%;border-radius:0.75rem;" />`;
					})
					.join('');
				execCommand('insertHTML', imageMarkup);
				onChange(editorRef.current?.innerHTML || value);
				updateActiveCommands();
				return;
			}

			const pastedHtml = clipboardHtml ? clipboardHtml : normalizePlainTextPaste(clipboardText);
			const insertHtml = sanitizePastedHtml(pastedHtml, handleDataImage) || normalizePlainTextPaste(clipboardText);
			execCommand('insertHTML', insertHtml);
			onChange(editorRef.current?.innerHTML || value);
			updateActiveCommands();
		},
		[onBlobFileMapChange, onChange, updateActiveCommands, value]
	);

	const handleHtmlChange = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => {
			onChange(e.target.value);
		},
		[onChange]
	);

	const toggleHtmlMode = useCallback(() => {
		const next = !htmlMode;
		const compact = minifyHtml(value || '');

		setHtmlMode(next);
		if (next) {
			onChange(compact);
		} else if (editorRef.current) {
			editorRef.current.innerHTML = compact;
		}
		setShowHeadingMenu(false);
	}, [htmlMode, value, onChange]);

	const insertImage = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleImageSelect = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const blobUrl = URL.createObjectURL(file);
			blobFileMapRef.current[blobUrl] = file;
			onBlobFileMapChange({ ...blobFileMapRef.current });

			if (htmlMode) {
				const imgTag = `<img src="${blobUrl}" alt="" style="max-width:100%;border-radius:0.75rem;" />`;
				const next = `${value}${imgTag}`;
				onChange(next);
			} else {
				if (editorRef.current) {
					editorRef.current.focus();
					execCommand('insertHTML', `<img src="${blobUrl}" alt="" style="max-width:100%;border-radius:0.75rem;" />`);
					handleEditorInput();
				}
			}

			// Reset input so same file can be selected again
			e.target.value = '';
		},
		[htmlMode, onChange, handleEditorInput, onBlobFileMapChange, value]
	);

	const toolbarButtons = [
		{ cmd: 'bold', icon: 'B', title: 'Bold (Ctrl+B)' },
		{ cmd: 'italic', icon: 'I', title: 'Italic (Ctrl+I)' },
		{ cmd: 'underline', icon: 'U', title: 'Underline (Ctrl+U)' },
		{ cmd: 'strikeThrough', icon: 'S', title: 'Strikethrough' },
	];

	const headingButtons = [
		{ label: 'P', value: 'p', title: 'Paragraph' },
		{ label: 'H1', value: 'h1', title: 'Heading 1' },
		{ label: 'H2', value: 'h2', title: 'Heading 2' },
		{ label: 'H3', value: 'h3', title: 'Heading 3' },
	];

	const currentHeading = activeCommands.has('h1')
		? 'H1'
		: activeCommands.has('h2')
			? 'H2'
			: activeCommands.has('h3')
				? 'H3'
				: 'H';

	return (
		<div className="flex flex-col gap-3">
			{/* Toolbar */}
			<div className="sticky top-24 z-40 w-full self-start rounded-2xl border border-white/15 bg-[#09101f]/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-md">
				<div className="flex flex-wrap items-center gap-2">
					{toolbarButtons.map((btn) => (
						<ToolbarButton
							key={btn.cmd}
							icon={btn.icon}
							title={btn.title}
							active={activeCommands.has(btn.cmd)}
							onClick={() => {
								execCommand(btn.cmd);
								updateActiveCommands();
								handleEditorInput();
							}}
						/>
					))}

					<ToolbarButton
						icon="M"
						title="Monospace"
						active={activeCommands.has('monospace')}
						onClick={() => {
							execCommand('fontName', 'monospace');
							handleEditorInput();
						}}
					/>

					<ToolbarButton
						icon="✕"
						title="Clear all formatting"
						onClick={() => {
							if (editorRef.current) {
								const text = editorRef.current.textContent || '';
								editorRef.current.innerHTML = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
								handleEditorInput();
							}
						}}
					/>

					<div className="relative">
						<button
							type="button"
							onClick={() => setShowHeadingMenu((prev) => !prev)}
							onMouseDown={(e) => e.preventDefault()}
							className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${
								currentHeading !== 'H'
									? 'border-[#606bfa]/60 bg-[#606bfa]/25 text-[#a9b2ff]'
									: 'border-white/15 bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white'
							}`}
						>
							{currentHeading} ▾
						</button>
						{showHeadingMenu && (
							<div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 flex min-w-28 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#09101f] shadow-2xl shadow-black/40">
								{headingButtons.map((heading) => (
									<button
										key={heading.value}
										type="button"
										title={heading.title}
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => {
											if (editorRef.current) {
												editorRef.current.focus();
												execCommand('formatBlock', `<${heading.value}>`);
												handleEditorInput();
											}
											setShowHeadingMenu(false);
										}}
										className="px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
									>
										{heading.label}
									</button>
								))}
							</div>
						)}
					</div>

					<ToolbarButton
						icon="•"
						title="Bulleted List"
						active={activeCommands.has('insertUnorderedList')}
						onClick={() => {
							execCommand('insertUnorderedList');
							handleEditorInput();
						}}
					/>
					<ToolbarButton
						icon="1."
						title="Numbered List"
						active={activeCommands.has('insertOrderedList')}
						onClick={() => {
							execCommand('insertOrderedList');
							handleEditorInput();
						}}
					/>

					<ToolbarButton
						label="Link"
						icon="↗"
						title="Insert Link"
						active={activeCommands.has('link')}
						onClick={() => {
							const url = window.prompt('Enter a URL');
							if (!url) return;
							if (editorRef.current) editorRef.current.focus();
							if (insertLink(url)) {
								handleEditorInput();
							}
						}}
					/>

					<ToolbarButton
						label="HL"
						icon="▮"
						title="Highlight"
						active={activeCommands.has('highlight')}
						onClick={() => {
							if (editorRef.current) editorRef.current.focus();
							if (applyHighlight()) {
								handleEditorInput();
							}
						}}
					/>

					<div className="mx-1 h-6 w-px bg-white/15" />

					<ToolbarButton icon="IMG" title="Insert Image" onClick={insertImage} />

					<div className="ml-auto flex items-center gap-2">
						<button
							type="button"
							onClick={() => {
								const compact = minifyHtml(value || '');
								onChange(compact);
								if (!htmlMode && editorRef.current) editorRef.current.innerHTML = compact;
							}}
							className="rounded-lg border border-white/20 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.12]"
							title="Minify HTML"
						>
							Minify
						</button>

						<button
							type="button"
							onClick={toggleHtmlMode}
							className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.14]"
						>
							{htmlMode ? 'Visual Mode' : 'HTML Mode'}
						</button>
					</div>
				</div>
			</div>

			{/* Editor */}
			<div className="relative min-h-[50vh] overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
				{htmlMode ? (
					<textarea
						value={value}
						onChange={handleHtmlChange}
						className="h-[50vh] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-white/90 outline-none"
						placeholder={placeholder || 'Write your content in HTML...'}
						spellCheck={false}
					/>
				) : (
					<div className="prose prose-invert max-w-none p-4 text-white">
						<div
							ref={editorRef}
							contentEditable
							suppressContentEditableWarning
							onInput={handleEditorInput}
							onKeyUp={handleEditorKeyUp}
							onMouseUp={handleEditorMouseUp}
							onMouseDown={(e) => {
								const target = e.target as HTMLElement | null;
								if (target?.tagName === 'IMG') {
									e.preventDefault();
									selectNode(target);
									updateActiveCommands();
								}
							}}
							className="prose-inherit min-h-[50vh] w-full outline-none"
							style={{ whiteSpace: 'pre-wrap' }}
							data-placeholder={placeholder || 'Start writing...'}
							dir="ltr"
							onPaste={handleEditorPaste}
							lang="en"
						/>
					</div>
				)}
			</div>

			{/* Hidden file input for images */}
			<input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

			<style jsx>{`
				[contenteditable]:empty:before {
					content: attr(data-placeholder);
					color: rgba(255, 255, 255, 0.38);
					pointer-events: none;
				}
				[contenteditable] {
					direction: ltr;
					unicode-bidi: plaintext;
					text-align: left;
				}
				[contenteditable] h1,
				[contenteditable] h2,
				[contenteditable] h3 {
					font-weight: 700;
					line-height: 1.2;
					margin: 1rem 0 0.5rem;
					color: #a9b2ff;
					padding-bottom: 0.25rem;
					border-bottom: 2px solid rgba(106, 107, 250, 0.2);
				}
				[contenteditable] h1 {
					font-size: 2.5rem;
					letter-spacing: -0.02em;
				}
				[contenteditable] h2 {
					font-size: 2rem;
				}
				[contenteditable] h3 {
					font-size: 1.5rem;
				}
				[contenteditable] ul,
				[contenteditable] ol {
					display: block;
					margin: 0.75rem 0;
				}
				[contenteditable] ul {
					list-style-type: disc;
					list-style-position: outside;
					padding-left: 2rem;
				}
				[contenteditable] ol {
					list-style-type: decimal;
					list-style-position: outside;
					padding-left: 2rem;
				}
				[contenteditable] li {
					display: list-item;
					list-style: inherit;
					margin: 0.5rem 0;
					line-height: 1.6;
				}
				[contenteditable] img {
					max-width: 100%;
					border-radius: 0.75rem;
					margin: 0.5rem 0;
				}
				[contenteditable] p {
					margin: 0.5rem 0;
				}
				[contenteditable] b,
				[contenteditable] strong {
					font-weight: 700;
				}
				[contenteditable] i,
				[contenteditable] em {
					font-style: italic;
				}
				[contenteditable] u {
					text-decoration: underline;
				}
				[contenteditable] s,
				[contenteditable] strike {
					text-decoration: line-through;
				}
				[contenteditable] font[face='monospace'] {
					font-family: monospace;
					background: rgba(255, 255, 255, 0.1);
					padding: 0.1rem 0.3rem;
					border-radius: 0.25rem;
				}
			`}</style>
		</div>
	);
}
