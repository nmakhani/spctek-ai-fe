import React from 'react';

import AltModal from './AltModal';
import EditorStyles from './EditorStyles';
import LinkModal from './LinkModal';

interface EditorCanvasProps {
	wrapperRef: React.RefObject<HTMLDivElement | null>;
	htmlMode: boolean;
	htmlTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
	value: string;
	handleHtmlChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleHtmlPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	editorRef: React.RefObject<HTMLDivElement | null>;
	handleEditorInput: () => void;
	handleEditorKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
	handleEditorKeyUp: () => void;
	handleEditorMouseUp: () => void;
	handleEditorMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
	handleEditorMouseLeave: () => void;
	setSelectedImage: (image: HTMLImageElement | null) => void;
	updateActiveCommands: () => void;
	handleEditorPaste: (event: React.ClipboardEvent<HTMLDivElement>) => void;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
	hoveredLink: string;
	hoveredImageAlt: string;
	showLinkModal: boolean;
	linkUrl: string;
	setLinkUrl: (value: string) => void;
	setShowLinkModal: (value: boolean) => void;
	insertLinkWithSavedSelection: (href: string) => boolean;
	showAltModal: boolean;
	altText: string;
	setAltText: (value: string) => void;
	selectedImageRef: React.MutableRefObject<HTMLImageElement | null>;
	setShowAltModal: (value: boolean) => void;
	toolbar: React.ReactNode;
	handleEditorInputForModals: () => void;
}

export default function EditorCanvas({
	wrapperRef,
	htmlMode,
	htmlTextareaRef,
	value,
	handleHtmlChange,
	handleHtmlPaste,
	placeholder,
	editorRef,
	handleEditorInput,
	handleEditorKeyDown,
	handleEditorKeyUp,
	handleEditorMouseUp,
	handleEditorMouseMove,
	handleEditorMouseLeave,
	setSelectedImage,
	updateActiveCommands,
	handleEditorPaste,
	fileInputRef,
	handleImageSelect,
	hoveredLink,
	hoveredImageAlt,
	showLinkModal,
	linkUrl,
	setLinkUrl,
	setShowLinkModal,
	insertLinkWithSavedSelection,
	showAltModal,
	altText,
	setAltText,
	selectedImageRef,
	setShowAltModal,
	toolbar,
	handleEditorInputForModals,
}: EditorCanvasProps) {
	return (
		<div className="flex flex-col gap-3">
			{toolbar}

			<div
				ref={wrapperRef}
				className={`relative min-h-[50vh] rounded-2xl border border-white/15 bg-white/[0.04] ${htmlMode ? '' : ''}`}
			>
				{htmlMode ? (
					<textarea
						ref={htmlTextareaRef}
						value={value}
						onChange={handleHtmlChange}
						onPaste={handleHtmlPaste}
						className="min-h-[50vh] w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-white/90 outline-none"
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
							onKeyDown={handleEditorKeyDown}
							onKeyUp={handleEditorKeyUp}
							onMouseUp={handleEditorMouseUp}
							onMouseMove={handleEditorMouseMove}
							onMouseLeave={handleEditorMouseLeave}
							onMouseDown={(e) => {
								const target = e.target as HTMLElement | null;
								if (target?.tagName === 'IMG') {
									e.preventDefault();
									setSelectedImage(target as HTMLImageElement);
									updateActiveCommands();
								} else {
									setSelectedImage(null);
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

			<input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

			{(hoveredLink || hoveredImageAlt) && (
				<div className="fixed bottom-4 left-4 z-50 max-w-md overflow-hidden rounded-lg border border-white/15 bg-[#09101f]/95 px-3 py-2 text-xs text-white/80 shadow-2xl backdrop-blur-md">
					{hoveredLink && (
						<div>
							<span className="text-white/60">Link: </span>
							<span className="font-mono">{hoveredLink}</span>
						</div>
					)}
					{hoveredImageAlt && (
						<div className={hoveredLink ? 'mt-1' : ''}>
							<span className="text-white/60">Alt: </span>
							<span className="font-mono">{hoveredImageAlt}</span>
						</div>
					)}
				</div>
			)}

			<LinkModal
				show={showLinkModal}
				linkUrl={linkUrl}
				setLinkUrl={setLinkUrl}
				setShowLinkModal={setShowLinkModal}
				insertLinkWithSavedSelection={insertLinkWithSavedSelection}
				handleEditorInput={handleEditorInputForModals}
				updateActiveCommands={updateActiveCommands}
				editorRef={editorRef}
			/>

			<AltModal
				show={showAltModal}
				altText={altText}
				setAltText={setAltText}
				selectedImageRef={selectedImageRef}
				setShowAltModal={setShowAltModal}
				handleEditorInput={handleEditorInputForModals}
			/>

			<EditorStyles />
		</div>
	);
}
