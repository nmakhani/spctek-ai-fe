'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';

import { authorsApi, type ContentType } from '@/lib/api';
import { createEditorTools } from './config/editorTools';
import { ContentMetaForm } from './ContentMetaForm';
import { EditorHeader } from './EditorHeader';
import { EditorStyles } from './EditorStyles';
import { EditorWorkspace } from './EditorWorkspace';
import { useContentData, useContentSave, useEditorInit } from './hooks';
import type { AuthorRead } from './types';
import { slugify } from './utils';

interface ContentEditorScreenProps {
	mode: 'create' | 'edit';
	contentId?: string;
	contentType: ContentType;
	entityLabel: string;
	backPath: string;
}

export function ContentEditorScreen({ mode, contentId, contentType, entityLabel, backPath }: ContentEditorScreenProps) {
	const router = useRouter();
	const baseId = useId().replace(/:/g, '');
	const [mounted, setMounted] = useState(false);
	const editorHolderId = mounted ? `editor-${baseId}` : '';
	const [previewMode, setPreviewMode] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [tools, setTools] = useState<Record<string, any> | null>(null);
	const [blobFileMap, setBlobFileMap] = useState<Record<string, File>>({});
	const [highlightErrors, setHighlightErrors] = useState(false);
	const [authors, setAuthors] = useState<AuthorRead[]>([]);

	// Ensure we have a stable, client-side only ID
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	// Content data management
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
		categories,
		loadCategories,
		loadContent,
	} = useContentData(mode, contentId, contentType);

	// Save management
	const { editorRef, blobFileMapRef, saving, saveContent, syncEditorState } = useContentSave(
		mode,
		contentId,
		contentType,
		entityLabel
	);

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

	// Load content when needed
	useEffect(() => {
		void loadCategories();
		void loadContent();
	}, [mode, contentId, loadContent, loadCategories]);

	// Load authors
	useEffect(() => {
		const loadAuthors = async () => {
			try {
				const response = await authorsApi.list();
				setAuthors(response.data as AuthorRead[]);
			} catch {
				setAuthors([]);
			}
		};
		void loadAuthors();
	}, []);

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

	const hasInvalidCaseStudyKpi =
		contentType === 'CASE_STUDY' && formData.kpis.some((item) => !item.stat.trim() || !item.description.trim());

	const isSaveDisabled =
		saving ||
		!formData.title.trim() ||
		!formData.slug.trim() ||
		(contentType === 'BLOG' && !formData.author_id.trim()) ||
		!formData.summary.trim() ||
		!currentThumbnailUrl.trim() ||
		hasInvalidCaseStudyKpi;

	const handleSave = async () => {
		if (isSaveDisabled) {
			setError(
				contentType === 'CASE_STUDY'
					? 'Fill title, slug, summary, thumbnail, and both KPI stats before saving.'
					: 'Fill title, slug, author, summary, and thumbnail before saving.'
			);
			setHighlightErrors(true);
			return;
		}

		const synced = await syncEditorState(editorData);
		const success = await saveContent(formData, currentThumbnailUrl, editorData, synced);
		if (success) {
			setHighlightErrors(false);
			router.back();
		}
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
			<EditorHeader
				mode={mode}
				entityLabel={entityLabel}
				backPath={backPath}
				isPublished={formData.is_published}
				onPublishedChange={(published) => setFormData((prev) => ({ ...prev, is_published: published }))}
				previewMode={previewMode}
				onPreviewToggle={async () => {
					if (!previewMode) {
						const synced = await syncEditorState(editorData);
						setEditorData(synced);
					}
					setPreviewMode((prev) => !prev);
				}}
				saving={saving}
				isSaveDisabled={isSaveDisabled}
				onSave={handleSave}
			/>

			<main className="mx-auto max-w-7xl px-6 py-8">
				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
					<ContentMetaForm
						formData={formData}
						contentType={contentType}
						categories={categories}
						authors={authors}
						highlightErrors={highlightErrors}
						onTitleChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
						onSlugChange={(value) => {
							setSlugManuallyEdited(true);
							setFormData((prev) => ({ ...prev, slug: slugify(value) }));
						}}
						onSummaryChange={(value) => setFormData((prev) => ({ ...prev, summary: value }))}
						onAuthorChange={(value) => setFormData((prev) => ({ ...prev, author_id: value }))}
						onToggleCategory={(categoryId) =>
							setFormData((prev) => ({
								...prev,
								category_ids: prev.category_ids.includes(categoryId)
									? prev.category_ids.filter((id) => id !== categoryId)
									: [...prev.category_ids, categoryId],
							}))
						}
						onKpiStatChange={(index, value) =>
							setFormData((prev) => ({
								...prev,
								kpis: prev.kpis.map((item, i) => (i === index ? { ...item, stat: value } : item)),
							}))
						}
						onKpiDescriptionChange={(index, value) =>
							setFormData((prev) => ({
								...prev,
								kpis: prev.kpis.map((item, i) => (i === index ? { ...item, description: value } : item)),
							}))
						}
						onThumbnailUrlChange={(value, file) => {
							setCurrentThumbnailUrl(value);
							setFormData((prev) => ({ ...prev, thumbnail_url: value }));
							if (file) setBlobFileMap((prev) => ({ ...prev, [value]: file }));
						}}
					/>

					<EditorWorkspace
						editorHolderId={editorHolderId}
						previewMode={previewMode}
						editorData={editorData}
						title={formData.title}
					/>
				</div>
			</main>

			<EditorStyles editorHolderId={editorHolderId} />
		</div>
	);
}
