import { useEffect, useRef } from 'react';
import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';

export function useEditorInit(
	editorHolderId: string,
	editorData: OutputData,
	mode: 'create' | 'edit',
	onEditorReady: (editor: EditorJS) => void,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tools: Record<string, any>,
	disabled?: boolean
) {
	const editorRef = useRef<EditorJS | null>(null);
	const initializedRef = useRef(false);

	useEffect(() => {
		if (disabled || !Object.keys(tools).length) return;

		let disposed = false;

		const initEditor = async () => {
			if (initializedRef.current) return;
			initializedRef.current = true;

			const editorElement = document.getElementById(editorHolderId);
			if (!editorElement) {
				console.warn(`Editor holder element with ID "${editorHolderId}" not found`);
				return;
			}

			if (editorRef.current) {
				try {
					await editorRef.current.destroy();
				} catch (err) {
					console.warn('Error destroying previous editor instance:', err);
				}
				editorRef.current = null;
			}

			if (disposed) return;

			try {
				const { default: EditorJS } = await import('@editorjs/editorjs');

				if (disposed) return;

				editorRef.current = new EditorJS({
					holder: editorHolderId,
					autofocus: mode === 'create',
					data: editorData,
					minHeight: 0,
					inlineToolbar: ['bold', 'italic', 'link', 'underline', 'inlineCode', 'marker'],
					tools,
					onChange: async () => {},
				});

				onEditorReady(editorRef.current);
			} catch (err) {
				console.error('Error initializing Editor.js:', err);
				initializedRef.current = false; // Reset on failure
			}
		};

		void initEditor();

		return () => {
			disposed = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editorHolderId, mode, onEditorReady, tools, disabled]);

	useEffect(() => {
		return () => {
			if (editorRef.current) {
				try {
					editorRef.current.destroy();
				} catch (err) {
					console.warn('Error destroying editor on unmount:', err);
				}
			}
		};
	}, []);

	return editorRef;
}
