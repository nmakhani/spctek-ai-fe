import React from 'react';

import { applyHighlight, execCommand, getSelectedLink, getSelectionRange, removeLink, selectNode } from './editorHelpers';
import { minifyHtml, prettifyHtml } from './utils';

type HeadingButton = { label: string; value: string; title: string };

type ToolbarButton = { cmd: string; icon: string; title: string };

interface EditorToolbarProps {
	toolbarRef: React.RefObject<HTMLDivElement | null>;
	toolbarButtons: ToolbarButton[];
	headingButtons: HeadingButton[];
	activeCommands: Set<string>;
	updateActiveCommands: () => void;
	handleEditorInput: () => void;
	savedRangeRef: React.MutableRefObject<Range | null>;
	setLinkUrl: (value: string) => void;
	setShowLinkModal: (value: boolean) => void;
	setShowHeadingMenu: React.Dispatch<React.SetStateAction<boolean>>;
	showHeadingMenu: boolean;
	currentHeading: string;
	insertImage: () => void;
	selectedImage: HTMLImageElement | null;
	selectedImageRef: React.MutableRefObject<HTMLImageElement | null>;
	setAltText: (value: string) => void;
	setShowAltModal: (value: boolean) => void;
	handleClean: () => void;
	toggleHtmlMode: () => void;
	value: string;
	htmlMode: boolean;
	onChange: (value: string) => void;
}

function toolbarButtonClass(active?: boolean, disabled?: boolean) {
	if (disabled) {
		return 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/25 opacity-70';
	}

	if (active) {
		return 'border-[#606bfa]/70 bg-[#606bfa]/18 text-[#c7cdff] shadow-[0_0_0_1px_rgba(96,107,250,0.12)]';
	}

	return 'border-white/15 bg-white/[0.05] text-white/65 hover:border-white/20 hover:bg-white/[0.09] hover:text-white';
}

export default function EditorToolbar({
	toolbarRef,
	toolbarButtons,
	headingButtons,
	activeCommands,
	updateActiveCommands,
	handleEditorInput,
	savedRangeRef,
	setLinkUrl,
	setShowLinkModal,
	setShowHeadingMenu,
	showHeadingMenu,
	currentHeading,
	insertImage,
	selectedImage,
	selectedImageRef,
	setAltText,
	setShowAltModal,
	handleClean,
	toggleHtmlMode,
	value,
	htmlMode,
	onChange,
}: EditorToolbarProps) {
	return (
		<div
			ref={toolbarRef}
			className="fixed left-0 right-0 top-28 z-40 mx-auto w-[90%] rounded-3xl border border-white/25 bg-[#09101f]/95 shadow-2xl shadow-black/30 backdrop-blur-md"
		>
			<div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
				{toolbarButtons.map((btn) => (
					<button
						key={btn.cmd}
						type="button"
						title={btn.title}
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => {
							execCommand(btn.cmd);
							updateActiveCommands();
							handleEditorInput();
						}}
						className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has(btn.cmd), false)}`}
					>
						{btn.icon}
					</button>
				))}

				<button
					type="button"
					onMouseDown={(e) => e.preventDefault()}
					onClick={() => {
						execCommand('fontName', 'monospace');
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('monospace'), false)}`}
				>
					M
				</button>

				<button
					type="button"
					onMouseDown={(e) => e.preventDefault()}
					onClick={() => {
						const range = getSelectionRange();
						if (!range) return;
						if (range.collapsed) return;
						const plain = range.toString();
						range.deleteContents();
						range.insertNode(document.createTextNode(plain));
						const sel = window.getSelection();
						if (sel) sel.removeAllRanges();
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(false, false)}`}
					title="Clear selected formatting"
				>
					✕
				</button>

				<div className="relative">
					<button
						type="button"
						onClick={() => setShowHeadingMenu((prev: boolean) => !prev)}
						onMouseDown={(e) => e.preventDefault()}
						className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(currentHeading !== 'H', false)}`}
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
										if (typeof document !== 'undefined') {
											const editor = document.querySelector('[contenteditable]') as HTMLElement | null;
											if (editor) {
												editor.focus();
												execCommand('formatBlock', `<${heading.value}>`);
												handleEditorInput();
											}
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

				<button
					type="button"
					onClick={() => {
						execCommand('insertUnorderedList');
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('insertUnorderedList'), false)}`}
					title="Bulleted List"
				>
					•
				</button>

				<button
					type="button"
					onClick={() => {
						execCommand('insertOrderedList');
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('insertOrderedList'), false)}`}
					title="Numbered List"
				>
					1.
				</button>

				<div className="mx-1 h-6 w-px bg-white/15" />

				<button
					type="button"
					onClick={() => {
						execCommand('justifyLeft');
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('justifyLeft'), false)}`}
					title="Align Left"
				>
					⫷
				</button>

				<button
					type="button"
					onClick={() => {
						execCommand('justifyCenter');
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('justifyCenter'), false)}`}
					title="Align Center"
				>
					⋮
				</button>

				<button
					type="button"
					onClick={() => {
						execCommand('justifyRight');
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('justifyRight'), false)}`}
					title="Align Right"
				>
					⫸
				</button>

				<button
					type="button"
					onClick={() => {
						execCommand('justifyFull');
						handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('justifyFull'), false)}`}
					title="Justify"
				>
					≡
				</button>

				<div className="mx-1 h-6 w-px bg-white/15" />

				<button
					type="button"
					onClick={() => {
						let existingLink = getSelectedLink();

						if (selectedImage) {
							selectNode(selectedImage);
							const imageRange = getSelectionRange();
							savedRangeRef.current = imageRange ? imageRange.cloneRange() : null;
							existingLink = selectedImage.closest('a') as HTMLAnchorElement | null;
						} else {
							const range = getSelectionRange();
							savedRangeRef.current = range ? range.cloneRange() : null;
						}

						if (existingLink) {
							setLinkUrl(existingLink.getAttribute('href') || '');
						} else {
							setLinkUrl('');
						}
						setShowLinkModal(true);
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('link'), false)}`}
					title="Insert Link"
				>
					↗
				</button>

				<button
					type="button"
					onClick={() => {
						if (removeLink()) {
							handleEditorInput();
							updateActiveCommands();
						}
					}}
					disabled={!activeCommands.has('link')}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('link'), !activeCommands.has('link'))}`}
					title="Remove Link"
				>
					⊗
				</button>

				<button
					type="button"
					onClick={() => {
						const editor = document.querySelector('[contenteditable]') as HTMLElement | null;
						if (editor) editor.focus();
						if (applyHighlight()) handleEditorInput();
					}}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(activeCommands.has('highlight'), false)}`}
					title="Highlight"
				>
					▮
				</button>

				<div className="mx-1 h-6 w-px bg-white/15" />

				<button
					type="button"
					onClick={insertImage}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(!!selectedImage, false)}`}
				>
					IMG
				</button>

				<button
					type="button"
					onClick={() => {
						if (selectedImage) {
							selectedImageRef.current = selectedImage;
							setAltText(selectedImage.getAttribute('alt') || '');
							setShowAltModal(true);
						}
					}}
					disabled={!selectedImage}
					className={`flex h-8 items-center gap-1 rounded-lg border px-2 text-sm font-medium transition ${toolbarButtonClass(!!selectedImage, !selectedImage)}`}
				>
					ALT
				</button>

				<div className="mt-2 flex w-full items-center justify-end gap-2">
					<button
						type="button"
						onClick={() => {
							const compact = minifyHtml(value || '');
							onChange(compact);
						}}
						className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
						title="Minify HTML"
					>
						Mini
					</button>

					<button
						type="button"
						onClick={() => {
							const pretty = prettifyHtml(value || '');
							onChange(pretty);
						}}
						className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
						title="Prettify HTML"
					>
						Pretty
					</button>

					<button
						type="button"
						onClick={() => {
							handleClean();
						}}
						className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
						title="Clean HTML"
					>
						Clean
					</button>

					<button
						type="button"
						onClick={toggleHtmlMode}
						className="rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1.5 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
					>
						{htmlMode ? 'Visual Mode' : 'HTML Mode'}
					</button>
				</div>
			</div>
		</div>
	);
}
