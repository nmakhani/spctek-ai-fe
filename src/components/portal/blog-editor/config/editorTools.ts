import { uploadFileToR2 } from '@/lib/r2';
import RichParagraphTool from '../RichParagraphTool';

export async function createEditorTools() {
	const [
		{ default: Header },
		{ default: List },
		{ default: ImageTool },
		{ default: InlineCode },
		{ default: Marker },
		{ default: Underline },
		{ default: Raw },
	] = await Promise.all([
		import('@editorjs/header'),
		import('@editorjs/list'),
		import('@editorjs/image'),
		import('@editorjs/inline-code'),
		import('@editorjs/marker'),
		import('editorjs-text-underline'),
		import('@editorjs/raw'),
	]);

	return {
		inlineCode: InlineCode,
		marker: Marker,
		underline: Underline,
		paragraph: {
			class: RichParagraphTool,
			inlineToolbar: false,
		},
		header: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			class: Header as any,
			inlineToolbar: ['bold', 'italic', 'link', 'underline', 'inlineCode', 'marker'],
			config: {
				levels: [1, 2, 3, 4],
				defaultLevel: 2,
			},
		},
		list: {
			class: List,
			inlineToolbar: ['bold', 'italic', 'link', 'underline', 'inlineCode', 'marker'],
		},
		image: {
			class: ImageTool,
			config: {
				uploader: {
					uploadByFile: async (file: File) => {
						const uploaded = await uploadFileToR2(file);
						return {
							success: 1,
							file: { url: uploaded.publicUrl || uploaded.key },
						};
					},
					uploadByUrl: async (url: string) => ({ success: 1, file: { url } }),
				},
			},
		},
		raw: {
			class: Raw,
		},
	};
}
