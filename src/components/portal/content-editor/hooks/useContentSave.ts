import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { contentApi, type ContentType } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';
import type { ContentFormData } from '../types';
import { minifyHtml, replaceBlobUrlsInHtml } from '../utils';

function extensionFromMimeType(mimeType: string): string {
	if (!mimeType) return 'bin';
	if (mimeType === 'image/jpeg') return 'jpg';
	if (mimeType === 'image/png') return 'png';
	if (mimeType === 'image/webp') return 'webp';
	if (mimeType === 'image/gif') return 'gif';
	if (mimeType === 'image/svg+xml') return 'svg';
	if (mimeType === 'image/avif') return 'avif';
	if (mimeType === 'image/bmp') return 'bmp';
	if (mimeType === 'image/tiff') return 'tiff';
	return mimeType.split('/')[1] || 'bin';
}

async function recoverMissingBlobFiles(blobUrls: string[], blobFileMap: Record<string, File>): Promise<void> {
	for (let index = 0; index < blobUrls.length; index++) {
		const blobUrl = blobUrls[index];
		if (blobFileMap[blobUrl]) continue;

		try {
			const response = await fetch(blobUrl);
			if (!response.ok) {
				console.warn('[content-editor] Failed to fetch blob URL for recovery', { blobUrl, status: response.status });
				continue;
			}

			const blob = await response.blob();
			const mimeType = blob.type || 'application/octet-stream';
			const extension = extensionFromMimeType(mimeType);
			const fileName = `recovered-image-${Date.now()}-${index}.${extension}`;
			blobFileMap[blobUrl] = new File([blob], fileName, { type: mimeType });

			console.info('[content-editor] Recovered missing blob mapping from URL', {
				blobUrl,
				fileName,
				mimeType,
			});
		} catch (error) {
			console.warn('[content-editor] Could not recover blob URL', {
				blobUrl,
				error,
			});
		}
	}
}

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
		async (
			formData: ContentFormData,
			currentThumbnailUrl: string,
			htmlContent: string,
			blobFileMap: Record<string, File> = blobFileMapRef.current
		): Promise<boolean> => {
			try {
				setSaving(true);
				setError('');

				let finalThumbnailUrl = currentThumbnailUrl;
				if (finalThumbnailUrl.startsWith('blob:') && blobFileMap[finalThumbnailUrl]) {
					const uploaded = await uploadFileToR2(blobFileMap[finalThumbnailUrl]);
					finalThumbnailUrl = uploaded.publicUrl || uploaded.key;
				}

				// Minify HTML before uploading / saving to reduce unnecessary whitespace
				const compact = minifyHtml(htmlContent);
				const blobUrlsInHtml = Array.from(new Set(compact.match(/blob:[^"'\s]+/g) || []));
				const missingBlobFiles = blobUrlsInHtml.filter((blobUrl) => !blobFileMap[blobUrl]);

				console.info('[content-editor] Save diagnostics', {
					blobUrlsInHtmlCount: blobUrlsInHtml.length,
					blobFileMapCount: Object.keys(blobFileMap).length,
					thumbnailIsBlob: finalThumbnailUrl.startsWith('blob:'),
				});

				if (missingBlobFiles.length > 0) {
					await recoverMissingBlobFiles(missingBlobFiles, blobFileMap);
				}

				const unresolvedBlobFiles = blobUrlsInHtml.filter((blobUrl) => !blobFileMap[blobUrl]);

				if (unresolvedBlobFiles.length > 0) {
					console.warn('[content-editor] Missing file mappings for blob URLs', {
						missingBlobFiles: unresolvedBlobFiles,
						knownBlobUrls: Object.keys(blobFileMap),
					});
					throw new Error(
						'One or more images are still local blob URLs and cannot be uploaded. Please remove and reinsert those images, then save again.'
					);
				}

				const finalHtml = await replaceBlobUrlsInHtml(compact, blobFileMap);
				const remainingBlobUrls = finalHtml.match(/blob:[^"'\s]+/g) || [];
				if (remainingBlobUrls.length > 0) {
					console.warn('[content-editor] Blob URLs remained after replacement', {
						remainingBlobUrls,
					});
					throw new Error('Image upload failed for one or more local images. Please try again.');
				}

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

				// Include created_at if provided
				if (formData.created_at && formData.created_at.trim()) {
					payload.created_at = formData.created_at.trim();
				}

				if (mode === 'edit' && contentId) {
					console.info('[content-editor] Updating existing content', {
						contentId,
						hasBlobInPayload: /blob:[^"'\s]+/.test(finalHtml),
					});
					await contentApi.update(contentId, payload);
					toast.success(`${entityLabel} updated`);
				} else {
					console.info('[content-editor] Creating content', {
						hasBlobInPayload: /blob:[^"'\s]+/.test(finalHtml),
					});
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
