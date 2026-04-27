import { useCallback, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';
import toast from 'react-hot-toast';

import { contentApi, type ContentType } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';
import type { ContentFormData } from '../types';
import { replaceBlobUrlsRecursively, serializeContentPayload } from '../utils';

export function useContentSave(
	mode: 'create' | 'edit',
	contentId: string | undefined,
	contentType: ContentType,
	entityLabel: string
) {
	const editorRef = useRef<EditorJS | null>(null);
	const blobFileMapRef = useRef<Record<string, File>>({});
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	const syncEditorState = useCallback(async (editorData: OutputData): Promise<OutputData> => {
		if (!editorRef.current) return editorData;
		return await editorRef.current.save();
	}, []);

	const saveContent = useCallback(
		async (
			formData: ContentFormData,
			currentThumbnailUrl: string,
			editorData: OutputData,
			editorDataForSync: OutputData
		): Promise<boolean> => {
			try {
				setSaving(true);
				setError('');

				let finalThumbnailUrl = currentThumbnailUrl;
				if (finalThumbnailUrl.startsWith('blob:') && blobFileMapRef.current[finalThumbnailUrl]) {
					const uploaded = await uploadFileToR2(blobFileMapRef.current[finalThumbnailUrl]);
					finalThumbnailUrl = uploaded.publicUrl || uploaded.key;
				}

				const rawEditorData = await syncEditorState(editorDataForSync);
				const swapped = (await replaceBlobUrlsRecursively(rawEditorData, blobFileMapRef.current)) as OutputData;

				const serializedContent = serializeContentPayload(contentType, swapped, formData.kpis);
				const contentObject = JSON.parse(serializedContent);

				const payload: Record<string, unknown> = {
					title: formData.title,
					slug: formData.slug,
					summary: formData.summary,
					thumbnail_url: finalThumbnailUrl,
					type: contentType,
					is_published: formData.is_published,
					category_ids: formData.category_ids,
					content: contentObject,
				};

				// Only include author_id for blogs if it has a value
				if (contentType !== 'CASE_STUDY' && formData.author_id && formData.author_id.trim()) {
					payload.author_id = formData.author_id.trim();
				}

				if (mode === 'edit' && contentId) {
					await contentApi.update(contentId, payload);
					toast.success(`${entityLabel} updated`);
				} else {
					await contentApi.create(payload);
					toast.success(`${entityLabel} created`);
				}

				return true;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to save content';
				console.error('Save error:', err);
				setError(message);
				return false;
			} finally {
				setSaving(false);
			}
		},
		[mode, contentId, contentType, entityLabel, syncEditorState]
	);

	return {
		editorRef,
		blobFileMapRef,
		saving,
		error,
		setError,
		saveContent,
		syncEditorState,
	};
}
