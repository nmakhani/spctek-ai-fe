import { useCallback, type ChangeEvent, type MutableRefObject } from 'react';

import {
	dataUrlToFile,
	decodeHtmlEntities,
	execCommand,
	insertHtmlOutsideActiveLink,
	normalizePlainTextPaste,
} from './editorHelpers';
import { sanitizePastedHtml } from './utils';

type UseEditorHandlersArgs = {
	value: string;
	onChange: (html: string) => void;
	editorRef: MutableRefObject<HTMLDivElement | null>;
	htmlTextareaRef: MutableRefObject<HTMLTextAreaElement | null>;
	blobFileMapRef: MutableRefObject<Record<string, File>>;
	onBlobFileMapChange: (map: Record<string, File>) => void;
	handleEditorInput: () => void;
};

export function useEditorHandlers({
	value,
	onChange,
	editorRef,
	htmlTextareaRef,
	blobFileMapRef,
	onBlobFileMapChange,
	handleEditorInput,
}: UseEditorHandlersArgs) {
	const handleHtmlChange = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => {
			onChange(e.target.value);
		},
		[onChange]
	);

	const handleEditorPaste = useCallback(
		(e: React.ClipboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			const clipboardHtml = e.clipboardData.getData('text/html');
			const clipboardText = e.clipboardData.getData('text/plain');
			const clipboardFiles = Array.from(e.clipboardData.files || []).filter((file) => file.type.startsWith('image/'));
			const dataImageHandler = (dataUrl: string, index: number) => {
				const file = dataUrlToFile(dataUrl, `pasted-image-${Date.now()}-${index}.png`);
				if (!file) return null;

				const blobUrl = URL.createObjectURL(file);
				blobFileMapRef.current[blobUrl] = file;
				return blobUrl;
			};

			if (!clipboardHtml && clipboardFiles.length > 0) {
				const imageMarkup = clipboardFiles
					.map((file) => {
						const blobUrl = URL.createObjectURL(file);
						blobFileMapRef.current[blobUrl] = file;
						return `<img src="${blobUrl}" alt="" style="max-width:100%;border-radius:0.75rem;" />`;
					})
					.join('');
				insertHtmlOutsideActiveLink(imageMarkup);
				onChange(editorRef.current?.innerHTML || value);
				onBlobFileMapChange({ ...blobFileMapRef.current });
				handleEditorInput();
				return;
			}

			const rawInsertHtml = clipboardHtml ? clipboardHtml : normalizePlainTextPaste(clipboardText);
			const insertHtml = sanitizePastedHtml(rawInsertHtml, dataImageHandler);
			if (/<img\b/i.test(insertHtml)) {
				insertHtmlOutsideActiveLink(insertHtml);
			} else {
				execCommand('insertHTML', insertHtml);
			}
			onChange(editorRef.current?.innerHTML || value);
			onBlobFileMapChange({ ...blobFileMapRef.current });
			handleEditorInput();
		},
		[blobFileMapRef, editorRef, handleEditorInput, onBlobFileMapChange, onChange, value]
	);

	const handleHtmlPaste = useCallback(
		(e: React.ClipboardEvent<HTMLTextAreaElement>) => {
			const textarea = htmlTextareaRef.current;
			if (!textarea) return;

			const clipboardHtml = e.clipboardData.getData('text/html');
			const clipboardText = e.clipboardData.getData('text/plain');
			const clipboardFiles = Array.from(e.clipboardData.files || []).filter((file) => file.type.startsWith('image/'));
			const dataImageHandler = (dataUrl: string, index: number) => {
				const file = dataUrlToFile(dataUrl, `pasted-image-${Date.now()}-${index}.png`);
				if (!file) return null;

				const blobUrl = URL.createObjectURL(file);
				blobFileMapRef.current[blobUrl] = file;
				return blobUrl;
			};

			const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(clipboardText);
			if (!clipboardHtml && clipboardFiles.length === 0 && !looksLikeHtml) return;

			e.preventDefault();

			let insertHtml = '';
			if (!clipboardHtml && clipboardFiles.length > 0) {
				insertHtml = clipboardFiles
					.map((file) => {
						const blobUrl = URL.createObjectURL(file);
						blobFileMapRef.current[blobUrl] = file;
						return `<img src="${blobUrl}" alt="" style="max-width:100%;border-radius:0.75rem;" />`;
					})
					.join('');
				onBlobFileMapChange({ ...blobFileMapRef.current });
			} else if (clipboardHtml) {
				const temp = document.createElement('div');
				temp.innerHTML = clipboardHtml;
				const text = temp.textContent || '';
				const looksLikeEncodedHtml = /&lt;|&gt;/.test(clipboardHtml) || /&lt;|&gt;/.test(text);
				const textLooksLikeHtmlTags = /<[^>]+>/.test(text);
				insertHtml =
					looksLikeEncodedHtml || textLooksLikeHtmlTags ? decodeHtmlEntities(text || clipboardHtml) : clipboardHtml;
			} else if (/&lt;|&gt;/.test(clipboardText)) {
				insertHtml = decodeHtmlEntities(clipboardText);
			} else {
				insertHtml = clipboardText;
			}

			insertHtml = sanitizePastedHtml(insertHtml, dataImageHandler);

			const start = textarea.selectionStart ?? value.length;
			const end = textarea.selectionEnd ?? start;
			const nextValue = `${value.slice(0, start)}${insertHtml}${value.slice(end)}`;
			onChange(nextValue);
			onBlobFileMapChange({ ...blobFileMapRef.current });
			requestAnimationFrame(() => {
				const caret = start + insertHtml.length;
				textarea.selectionStart = caret;
				textarea.selectionEnd = caret;
			});
		},
		[blobFileMapRef, htmlTextareaRef, onBlobFileMapChange, onChange, value]
	);

	return { handleHtmlChange, handleEditorPaste, handleHtmlPaste };
}
