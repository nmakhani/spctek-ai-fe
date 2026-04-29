'use client';

import Link from 'next/link';

interface EditorHeaderProps {
	mode: 'create' | 'edit';
	entityLabel: string;
	backPath: string;
	isPublished: boolean;
	onPublishedChange: (published: boolean) => void;
	previewMode: boolean;
	onPreviewToggle: () => Promise<void>;
	saving: boolean;
	isSaveDisabled: boolean;
	onSave: () => void;
}

export function EditorHeader({
	mode,
	entityLabel,
	backPath,
	isPublished,
	onPublishedChange,
	previewMode,
	onPreviewToggle,
	saving,
	isSaveDisabled,
	onSave,
}: EditorHeaderProps) {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 px-6 backdrop-blur-md">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 py-4">
				<div>
					<Link href={backPath} className="mb-1 inline-block text-sm text-white/60 transition hover:text-[#a9b2ff]">
						← Back to {entityLabel} Page
					</Link>
					<h1 className="text-2xl font-semibold text-white md:text-3xl">
						{mode === 'edit' ? 'Edit' : 'Create'} <span className="text-[#606bfa]">{entityLabel}</span>
					</h1>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={onPreviewToggle}
						className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/[0.14]"
					>
						{previewMode ? 'Edit' : 'Preview'}
					</button>
					<label className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm text-white/90">
						<input
							type="checkbox"
							checked={isPublished}
							onChange={(e) => onPublishedChange(e.target.checked)}
							className="h-4 w-4 accent-[#606bfa]"
						/>
						Published
					</label>
					<button
						type="button"
						onClick={onSave}
						disabled={isSaveDisabled}
						className="rounded-lg bg-[#606bfa] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
					>
						{saving ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		</header>
	);
}
