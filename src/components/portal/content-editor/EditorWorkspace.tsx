'use client';

import type { OutputData } from '@editorjs/editorjs';

import { ContentRenderer } from './ContentRenderer';

interface EditorWorkspaceProps {
	editorHolderId: string;
	previewMode: boolean;
	editorData: OutputData;
	title: string;
}

export function EditorWorkspace({ editorHolderId, previewMode, editorData, title }: EditorWorkspaceProps) {
	return (
		<div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 md:p-6">
			<div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
				<p className="font-medium text-white/90">Editor controls</p>
				<p className="mt-1">
					Paragraph blocks now have a built-in formatting header with bold, italic, underline, link, inline code
					(monospace), highlight, and clear formatting. For headings and lists, select text to open inline controls.
				</p>
			</div>

			<div className="relative min-h-[64vh]">
				<div
					className={`h-full transition-opacity duration-200 ${previewMode ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
				>
					<div id={editorHolderId} className="prose prose-invert max-w-none" />
				</div>
				{previewMode && (
					<div className="absolute inset-0 overflow-auto rounded-2xl bg-[#020617] p-2 md:p-0">
						<ContentRenderer data={editorData} title={title} />
					</div>
				)}
			</div>
		</div>
	);
}
