'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

import { BlogRenderer } from './BlogRenderer';
import { BlogMetaForm } from './BlogMetaForm';
import { useBlogData, useEditorInit, useBlogSave } from './hooks';
import { createEditorTools } from './config/editorTools';
import { slugify } from './utils';

interface BlogEditorScreenProps {
	mode: 'create' | 'edit';
	blogId?: string;
}

export function BlogEditorScreen({ mode, blogId }: BlogEditorScreenProps) {
	const baseId = useId().replace(/:/g, '');
	const [mounted, setMounted] = useState(false);
	const editorHolderId = mounted ? `editor-${baseId}` : '';
	const [previewMode, setPreviewMode] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [tools, setTools] = useState<Record<string, any> | null>(null);
	const [blobFileMap, setBlobFileMap] = useState<Record<string, File>>({});
	const [highlightErrors, setHighlightErrors] = useState(false);

	// Ensure we have a stable, client-side only ID
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	// Blog data management
	const {
		loading,
		error,
		setError,
		formData,
		setFormData,
		editorData,
		setEditorData,
		currentThumbnailUrl,
		setCurrentThumbnailUrl,
		slugManuallyEdited,
		setSlugManuallyEdited,
		loadBlog,
	} = useBlogData(mode, blogId);

	// Save management
	const { editorRef, blobFileMapRef, saving, saveBlog, syncEditorState } = useBlogSave(mode, blogId);

	// Update blob file map refs when state changes
	useEffect(() => {
		blobFileMapRef.current = blobFileMap;
	}, [blobFileMap, blobFileMapRef]);

	// Initialize tools
	useEffect(() => {
		let mounted = true;

		const initTools = async () => {
			const toolsConfig = await createEditorTools();
			if (mounted) setTools(toolsConfig);
		};

		void initTools();
		return () => {
			mounted = false;
		};
	}, []);

	// Load blog when needed
	useEffect(() => {
		void loadBlog();
	}, [mode, blogId, loadBlog]);

	// Initialize editor only after component is mounted and ID is set and loading is done
	useEditorInit(
		editorHolderId,
		editorData,
		mode,
		(editor) => {
			editorRef.current = editor;
		},
		tools || {},
		!tools || !mounted || !editorHolderId || loading
	);

	// Auto-generate slug
	useEffect(() => {
		if (!slugManuallyEdited) {
			setFormData((prev) => ({ ...prev, slug: slugify(prev.title) }));
		}
	}, [formData.title, slugManuallyEdited, setFormData]);

	const isSaveDisabled =
		saving ||
		!formData.title.trim() ||
		!formData.slug.trim() ||
		!formData.author.trim() ||
		!formData.summary.trim() ||
		!currentThumbnailUrl.trim();

	const handleSave = async () => {
		if (isSaveDisabled) {
			setError('Fill title, slug, author, summary, and thumbnail before saving.');
			setHighlightErrors(true);
			return;
		}

		const synced = await syncEditorState(editorData);
		const success = await saveBlog(formData, currentThumbnailUrl, editorData, synced);
		if (success) setHighlightErrors(false);
	};

	if (loading) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center">
				<p className="text-white/70">Loading editor...</p>
			</div>
		);
	}

	// Don't render editor until we have a proper client-side ID
	if (!mounted || !editorHolderId) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center">
				<p className="text-white/70">Initializing...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen pb-12">
			<header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 px-6 backdrop-blur-md">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 py-4">
					<div>
						<Link
							href="/portal/blogs"
							className="mb-1 inline-block text-sm text-white/60 transition hover:text-[#a9b2ff]"
						>
							← Back to Blogs
						</Link>
						<h1 className="text-2xl font-semibold text-white md:text-3xl">
							{mode === 'edit' ? 'Edit' : 'Create'} <span className="text-[#606bfa]">Blog</span>
						</h1>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							onClick={async () => {
								if (!previewMode) {
									const synced = await syncEditorState(editorData);
									setEditorData(synced);
								}
								setPreviewMode((prev) => !prev);
							}}
							className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/[0.14]"
						>
							{previewMode ? 'Edit' : 'Preview'}
						</button>
						<label className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm text-white/90">
							<input
								type="checkbox"
								checked={formData.is_published}
								onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
								className="h-4 w-4 accent-[#606bfa]"
							/>
							Published
						</label>
						<button
							type="button"
							onClick={handleSave}
							disabled={isSaveDisabled}
							className="rounded-lg bg-[#606bfa] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
						>
							{saving ? 'Saving...' : 'Save'}
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-6 py-8">
				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
					<BlogMetaForm
						formData={formData}
						highlightErrors={highlightErrors}
						onTitleChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
						onSlugChange={(value) => {
							setSlugManuallyEdited(true);
							setFormData((prev) => ({ ...prev, slug: slugify(value) }));
						}}
						onSummaryChange={(value) => setFormData((prev) => ({ ...prev, summary: value }))}
						onAuthorChange={(value) => setFormData((prev) => ({ ...prev, author: value }))}
						onThumbnailUrlChange={(value, file) => {
							setCurrentThumbnailUrl(value);
							setFormData((prev) => ({ ...prev, thumbnail_url: value }));
							if (file) setBlobFileMap((prev) => ({ ...prev, [value]: file }));
						}}
					/>

					<div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 md:p-6">
						<div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
							<p className="font-medium text-white/90">Editor controls</p>
							<p className="mt-1">
								Paragraph blocks now have a built-in formatting header with bold, italic, underline, link, inline code
								(monospace), highlight, and clear formatting. For headings and lists, select text to open inline
								controls.
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
									<BlogRenderer data={editorData} title={formData.title} />
								</div>
							)}
						</div>
					</div>
				</div>
			</main>

			<EditorStyles editorHolderId={editorHolderId} />
		</div>
	);
}

function EditorStyles({ editorHolderId }: { editorHolderId: string }) {
	return (
		<style jsx global>{`
			#${editorHolderId} .ce-block__content,
			#${editorHolderId} .ce-toolbar__content {
				max-width: 100%;
			}

			#${editorHolderId} .ce-block {
				position: relative;
				margin-bottom: 0.85rem;
				padding: 1rem 1.05rem;
				border: 1px solid rgba(255, 255, 255, 0.14);
				border-radius: 1rem;
				background: rgba(255, 255, 255, 0.03);
				transition:
					border-color 0.2s ease,
					background 0.2s ease,
					box-shadow 0.2s ease;
			}

			#${editorHolderId} .ce-block--focused,
			#${editorHolderId} .ce-block--selected {
				border-color: rgba(96, 107, 250, 0.9);
				background: rgba(96, 107, 250, 0.1);
				box-shadow:
					0 0 0 1px rgba(96, 107, 250, 0.35),
					0 0 0 6px rgba(96, 107, 250, 0.08);
			}

			#${editorHolderId} .ce-paragraph,
			#${editorHolderId} .cdx-block {
				color: #f2f4ff;
			}

			#${editorHolderId} .cdx-input,
			#${editorHolderId} .ce-paragraph,
			#${editorHolderId} .cdx-list__item {
				font-size: 0.98rem;
				line-height: 1.65;
			}

			#${editorHolderId} .ce-header {
				color: #ffffff;
				line-height: 1.25;
			}

			#${editorHolderId} .ce-header[data-level='1'] {
				font-size: 2rem;
				font-weight: 700;
			}

			#${editorHolderId} .ce-header[data-level='2'] {
				font-size: 1.65rem;
				font-weight: 700;
			}

			#${editorHolderId} .ce-header[data-level='3'] {
				font-size: 1.35rem;
				font-weight: 650;
			}

			#${editorHolderId} .ce-header[data-level='4'] {
				font-size: 1.15rem;
				font-weight: 650;
			}

			/* Disable clicking in the empty space below the editor */
			#${editorHolderId} .codex-editor__redactor {
				padding-bottom: 0 !important;
			}

			#${editorHolderId} .ce-toolbar {
				left: 0;
				right: auto;
				width: 3rem;
			}

			#${editorHolderId} .ce-toolbar__content {
				max-width: none;
			}

			#${editorHolderId} .ce-toolbar__actions {
				position: absolute !important;
				left: -3rem !important;
				top: 50% !important;
				transform: translateY(-50%) !important;
				display: flex !important;
				flex-direction: column !important;
				align-items: center;
				justify-content: center;
				gap: 0.45rem;
				padding: 0.4rem 0.35rem;
				border: none;
				border-radius: 999px;
				background: transparent;
				box-shadow: none;
				opacity: 1 !important;
				pointer-events: auto;
				z-index: 20;
				margin: 0;
			}

			#${editorHolderId} .ce-toolbar__plus,
			#${editorHolderId} .ce-toolbar__settings-btn {
				position: static !important;
				margin: 0 !important;
			}

			#${editorHolderId} .ce-toolbar__plus {
				display: inline-flex !important;
				align-items: center;
				justify-content: center;
				width: 2.25rem !important;
				height: 2.25rem !important;
				border-radius: 999px;
				background: rgba(96, 107, 250, 0.18);
				color: #eef1ff;
			}

			#${editorHolderId} .ce-toolbar__settings-btn {
				display: inline-flex !important;
				align-items: center;
				justify-content: center;
				width: 2.25rem !important;
				height: 2.25rem !important;
				border-radius: 999px;
				background: rgba(255, 255, 255, 0.08);
				color: #eef1ff;
			}

			#${editorHolderId} .ce-toolbar__plus:hover,
			#${editorHolderId} .ce-toolbar__settings-btn:hover {
				background: rgba(96, 107, 250, 0.3);
			}

			#${editorHolderId} .spctek-rich-paragraph {
				display: flex;
				flex-direction: column;
				gap: 0.65rem;
				padding-right: 1rem;
			}

			#${editorHolderId} .spctek-rich-paragraph__toolbar {
				display: flex;
				flex-wrap: wrap;
				gap: 0.35rem;
				padding-bottom: 0.45rem;
				border-bottom: 1px solid rgba(255, 255, 255, 0.12);
			}

			#${editorHolderId} .spctek-rich-paragraph__btn {
				border: 1px solid rgba(255, 255, 255, 0.15);
				background: rgba(255, 255, 255, 0.06);
				color: #eef1ff;
				font-size: 0.75rem;
				font-weight: 600;
				padding: 0.2rem 0.45rem;
				border-radius: 0.5rem;
				cursor: pointer;
			}

			#${editorHolderId} .spctek-rich-paragraph__btn:hover {
				background: rgba(96, 107, 250, 0.18);
				border-color: rgba(96, 107, 250, 0.55);
			}

			#${editorHolderId} .spctek-rich-paragraph__content {
				min-height: 2.2rem;
				outline: none;
				color: #f2f4ff;
				font-size: 0.98rem;
				line-height: 1.65;
			}

			#${editorHolderId} .spctek-rich-paragraph__content:empty:before {
				content: attr(data-placeholder);
				color: rgba(255, 255, 255, 0.38);
			}
		`}</style>
	);
}
