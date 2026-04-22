import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import type { OutputData } from '@editorjs/editorjs';

import { parseEditorData } from '../utils';
import { EMPTY_CONTENT_FORM, EMPTY_EDITOR_DATA } from '../types';
import type { Content, ContentFormData, Category } from '../types';
import { categoriesApi, contentApi, type ContentType } from '@/lib/api';

export function useContentData(mode: 'create' | 'edit', contentId: string | undefined, contentType: ContentType) {
	const [loading, setLoading] = useState(mode === 'edit');
	const [error, setError] = useState('');
	const [formData, setFormData] = useState<ContentFormData>(EMPTY_CONTENT_FORM);
	const [editorData, setEditorData] = useState<OutputData>({ ...EMPTY_EDITOR_DATA });
	const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState('');
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit');
	const [categories, setCategories] = useState<Category[]>([]);

	const loadCategories = useCallback(async () => {
		try {
			const response = await categoriesApi.list();
			setCategories(response.data as Category[]);
		} catch {
			// Keep editor usable even if categories fail to load.
			setCategories([]);
		}
	}, []);

	const loadContent = useCallback(async () => {
		if (mode !== 'edit' || !contentId) return;

		try {
			setLoading(true);
			const response = await contentApi.get(contentId, contentType);
			const content = response.data as Content;

			setFormData({
				title: content.title,
				slug: content.slug,
				summary: content.summary || '',
				author: content.author || '',
				thumbnail_url: content.thumbnail_url || '',
				is_published: content.is_published,
				category_ids: (content.categories || []).map((category) => category.id),
			});
			setCurrentThumbnailUrl(content.thumbnail_url || '');
			setEditorData(parseEditorData(content.content));
			setSlugManuallyEdited(true);
			setError('');
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to load content';
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}, [mode, contentId, contentType]);

	return {
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
	};
}
