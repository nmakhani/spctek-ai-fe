import React from 'react';

interface LinkModalProps {
	show: boolean;
	linkUrl: string;
	setLinkUrl: (value: string) => void;
	setShowLinkModal: (value: boolean) => void;
	insertLinkWithSavedSelection: (href: string) => boolean;
	handleEditorInput: () => void;
	updateActiveCommands: () => void;
	editorRef: React.RefObject<HTMLDivElement | null>;
}

export default function LinkModal({
	show,
	linkUrl,
	setLinkUrl,
	setShowLinkModal,
	insertLinkWithSavedSelection,
	handleEditorInput,
	updateActiveCommands,
	editorRef,
}: LinkModalProps) {
	if (!show) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#09101f]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-md">
				<h3 className="mb-4 text-lg font-semibold text-white">Insert Link</h3>
				<input
					type="text"
					value={linkUrl}
					onChange={(e) => setLinkUrl(e.target.value)}
					placeholder="Enter URL (e.g., https://example.com)"
					className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-white placeholder-white/40 outline-none transition focus:border-[#606bfa]/60 focus:bg-white/[0.08]"
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (linkUrl.trim() && editorRef?.current) {
								editorRef.current.focus();
								if (insertLinkWithSavedSelection(linkUrl)) {
									handleEditorInput();
									updateActiveCommands();
								}
								setShowLinkModal(false);
								setLinkUrl('');
							}
						} else if (e.key === 'Escape') {
							setShowLinkModal(false);
							setLinkUrl('');
						}
					}}
					autoFocus
				/>
				<div className="mt-6 flex gap-2">
					<button
						type="button"
						onClick={() => {
							setShowLinkModal(false);
							setLinkUrl('');
						}}
						className="flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.12]"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => {
							if (linkUrl.trim() && editorRef?.current) {
								editorRef.current.focus();
								if (insertLinkWithSavedSelection(linkUrl)) {
									handleEditorInput();
									updateActiveCommands();
								}
								setShowLinkModal(false);
								setLinkUrl('');
							}
						}}
						className="flex-1 rounded-lg border border-[#606bfa]/60 bg-[#606bfa]/25 px-4 py-2 text-sm font-medium text-[#a9b2ff] transition hover:bg-[#606bfa]/35"
					>
						Save Link
					</button>
				</div>
			</div>
		</div>
	);
}
