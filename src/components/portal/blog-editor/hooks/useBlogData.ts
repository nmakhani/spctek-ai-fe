import { useState, useCallback } from 'react';
import type { OutputData } from '@editorjs/editorjs';
import toast from 'react-hot-toast';

import { blogsApi } from '@/lib/api';
import { parseEditorData } from '../utils';
import type { Blog, BlogFormData } from '../types';
import { EMPTY_BLOG_FORM, EMPTY_EDITOR_DATA } from '../types';

export function useBlogData(mode: 'create' | 'edit', blogId?: string) {
	const [loading, setLoading] = useState(mode === 'edit');
	const [error, setError] = useState('');
	const [formData, setFormData] = useState<BlogFormData>(EMPTY_BLOG_FORM);
	const [editorData, setEditorData] = useState<OutputData>({ ...EMPTY_EDITOR_DATA });
	const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState('');
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit');

	const loadBlog = useCallback(async () => {
		if (mode !== 'edit' || !blogId) return;

		try {
			setLoading(true);
			const response = await blogsApi.get(blogId);
			const blog = response.data as Blog;

			setFormData({
				title: blog.title,
				slug: blog.slug,
				summary: blog.summary || '',
				author: blog.author || '',
				thumbnail_url: blog.thumbnail_url || '',
				is_published: blog.is_published,
			});
			setCurrentThumbnailUrl(blog.thumbnail_url || '');
			setEditorData(parseEditorData(blog.content));
			setSlugManuallyEdited(true);
			setError('');
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to load blog';
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}, [mode, blogId]);

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
		loadBlog,
	};
}
