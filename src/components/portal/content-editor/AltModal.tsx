import React from 'react';

interface AltModalProps {
	show: boolean;
	altText: string;
	setAltText: (value: string) => void;
	selectedImageRef: React.RefObject<HTMLImageElement | null>;
	setShowAltModal: (value: boolean) => void;
	handleEditorInput: () => void;
}

export default function AltModal({
	show,
	altText,
	setAltText,
	selectedImageRef,
	setShowAltModal,
	handleEditorInput,
}: AltModalProps) {
	if (!show) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#09101f]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-md">
				<h3 className="mb-4 text-lg font-semibold text-white">Edit Image Alt Text</h3>
				<input
					type="text"
					value={altText}
					onChange={(e) => setAltText(e.target.value)}
					placeholder="Enter alt text (e.g., A descriptive text for the image)"
					className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-white placeholder-white/40 outline-none transition focus:border-[#606bfa]/60 focus:bg-white/[0.08]"
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (selectedImageRef?.current) {
								selectedImageRef.current.setAttribute('alt', altText);
								handleEditorInput();
							}
							setShowAltModal(false);
							setAltText('');
						} else if (e.key === 'Escape') {
							setShowAltModal(false);
							setAltText('');
						}
					}}
					autoFocus
				/>
				<div className="mt-6 flex gap-2">
					<button
						type="button"
						onClick={() => {
							setShowAltModal(false);
							setAltText('');
						}}
						className="flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.12]"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => {
							if (selectedImageRef?.current) {
								selectedImageRef.current.setAttribute('alt', altText);
								handleEditorInput();
							}
							setShowAltModal(false);
							setAltText('');
						}}
						className="flex-1 rounded-lg border border-[#606bfa]/60 bg-[#606bfa]/25 px-4 py-2 text-sm font-medium text-[#a9b2ff] transition hover:bg-[#606bfa]/35"
					>
						Save Alt Text
					</button>
				</div>
			</div>
		</div>
	);
}
