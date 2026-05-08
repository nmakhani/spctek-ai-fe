import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { categoriesApi, contentApi, type ContentType } from '@/lib/api';
import { EMPTY_CONTENT_FORM, type Category, type Content, type ContentFormData } from '../types';
import { parseContentPayload } from '../utils';

export function useContentData(mode: 'create' | 'edit', contentId: string | undefined, contentType: ContentType) {
	const [loading, setLoading] = useState(mode === 'edit');
	const [error, setError] = useState('');
	const [formData, setFormData] = useState<ContentFormData>(EMPTY_CONTENT_FORM);
	const [htmlContent, setHtmlContent] = useState('');
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
			const parsedPayload = parseContentPayload(content.content);

			setFormData({
				title: content.title,
				slug: content.slug,
				summary: content.summary || '',
				author_id: contentType === 'CASE_STUDY' ? '' : content.author_id || content.author?.id || '',
				thumbnail_url: content.thumbnail_url || '',
				is_published: content.is_published,
				category_ids: (content.categories || []).map((category) => category.id),
				kpis: parsedPayload.kpis,
				meta_title: content.meta_tags?.title || '',
				meta_description: content.meta_tags?.description || '',
				created_at: content.created_at || '',
			});
			setCurrentThumbnailUrl(content.thumbnail_url || '');
			setHtmlContent(parsedPayload.html);
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
		htmlContent,
		setHtmlContent,
		currentThumbnailUrl,
		setCurrentThumbnailUrl,
		slugManuallyEdited,
		setSlugManuallyEdited,
		categories,
		loadCategories,
		loadContent,
	};
}
