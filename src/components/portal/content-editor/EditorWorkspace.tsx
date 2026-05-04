'use client';

import RichTextEditor from './RichTextEditor';

interface EditorWorkspaceProps {
	htmlContent: string;
	onChange: (html: string) => void;
	onBlobFileMapChange: (map: Record<string, File>) => void;
	previewMode: boolean;
}

export function EditorWorkspace({ htmlContent, onChange, onBlobFileMapChange, previewMode }: EditorWorkspaceProps) {
	return (
		<div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 md:p-6">
			{!previewMode ? (
				<RichTextEditor
					value={htmlContent}
					onChange={onChange}
					onBlobFileMapChange={onBlobFileMapChange}
					placeholder="Start writing your content..."
				/>
			) : (
				<div className="prose prose-invert min-h-[50vh] max-w-none rounded-2xl border border-white/10 bg-[#020617] p-6 md:p-8">
					<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
				</div>
			)}
		</div>
	);
}
