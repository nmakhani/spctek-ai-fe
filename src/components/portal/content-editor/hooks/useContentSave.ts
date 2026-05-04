import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { contentApi, type ContentType } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';
import type { ContentFormData } from '../types';
import { minifyHtml, replaceBlobUrlsInHtml } from '../utils';

export function useContentSave(
	mode: 'create' | 'edit',
	contentId: string | undefined,
	contentType: ContentType,
	entityLabel: string
) {
	const blobFileMapRef = useRef<Record<string, File>>({});
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	const saveContent = useCallback(
		async (formData: ContentFormData, currentThumbnailUrl: string, htmlContent: string): Promise<boolean> => {
			try {
				setSaving(true);
				setError('');

				let finalThumbnailUrl = currentThumbnailUrl;
				if (finalThumbnailUrl.startsWith('blob:') && blobFileMapRef.current[finalThumbnailUrl]) {
					const uploaded = await uploadFileToR2(blobFileMapRef.current[finalThumbnailUrl]);
					finalThumbnailUrl = uploaded.publicUrl || uploaded.key;
				}

				// Minify HTML before uploading / saving to reduce unnecessary whitespace
				const compact = minifyHtml(htmlContent);
				const finalHtml = await replaceBlobUrlsInHtml(compact, blobFileMapRef.current);

				const payload: Record<string, unknown> = {
					title: formData.title,
					slug: formData.slug,
					summary: formData.summary,
					thumbnail_url: finalThumbnailUrl,
					type: contentType,
					is_published: formData.is_published,
					category_ids: formData.category_ids,
					content: finalHtml,
					kpis: formData.kpis,
				};

				// include meta tags if provided
				if (formData.meta_title || formData.meta_description) {
					payload.meta_tags = {
						title: formData.meta_title || undefined,
						description: formData.meta_description || undefined,
					};
				}

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
		[mode, contentId, contentType, entityLabel]
	);

	return {
		blobFileMapRef,
		saving,
		error,
		setError,
		saveContent,
	};
}
