import { useRef, useState, useCallback } from 'react';
import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';
import toast from 'react-hot-toast';

import { blogsApi } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';
import { replaceBlobUrlsRecursively } from '../utils';
import type { BlogFormData } from '../types';

export function useBlogSave(mode: 'create' | 'edit', blogId?: string) {
	const editorRef = useRef<EditorJS | null>(null);
	const blobFileMapRef = useRef<Record<string, File>>({});
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	const syncEditorState = useCallback(async (editorData: OutputData): Promise<OutputData> => {
		if (!editorRef.current) return editorData;
		return await editorRef.current.save();
	}, []);

	const saveBlog = useCallback(
		async (
			formData: BlogFormData,
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

				const payload: Record<string, unknown> = {
					title: formData.title,
					slug: formData.slug,
					summary: formData.summary,
					author: formData.author,
					thumbnail_url: finalThumbnailUrl,
					is_published: formData.is_published,
					category_ids: formData.category_ids,
					content: JSON.stringify(swapped),
				};

				if (mode === 'edit' && blogId) {
					await blogsApi.update(blogId, payload);
					toast.success('Blog updated');
				} else {
					await blogsApi.create(payload);
					toast.success('Blog created');
				}

				return true;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to save blog';
				setError(message);
				toast.error(message);
				return false;
			} finally {
				setSaving(false);
			}
		},
		[mode, blogId, syncEditorState]
	);

	return {
		editorRef,
		blobFileMapRef,
		saving,
		error,
		setError,
		saveBlog,
		syncEditorState,
	};
}
