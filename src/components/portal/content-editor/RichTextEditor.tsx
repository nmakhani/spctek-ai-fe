'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';

import EditorCanvas from './EditorCanvas';
import { dataUrlToFile, execCommand, getClosestSelectionElement, insertLink } from './editorHelpers';
import EditorToolbar from './Toolbar';
import { useEditorHandlers } from './useEditorHandlers';
import { minifyHtml, sanitizePastedHtml } from './utils';

interface RichTextEditorProps {
	value: string;
	onChange: (html: string) => void;
	onBlobFileMapChange: (map: Record<string, File>) => void;
	placeholder?: string;
}

export default function RichTextEditor({ value, onChange, onBlobFileMapChange, placeholder }: RichTextEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const savedRangeRef = useRef<Range | null>(null);
	const htmlTextareaRef = useRef<HTMLTextAreaElement>(null);
	const blobFileMapRef = useRef<Record<string, File>>({});

	const [htmlMode, setHtmlMode] = useState(false);
	const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());
	const [showHeadingMenu, setShowHeadingMenu] = useState(false);
	const [hoveredLink, setHoveredLink] = useState('');
	const [showLinkModal, setShowLinkModal] = useState(false);
	const [linkUrl, setLinkUrl] = useState('');
	const [showAltModal, setShowAltModal] = useState(false);
	const [altText, setAltText] = useState('');
	const [hoveredImageAlt, setHoveredImageAlt] = useState('');
	const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
	const selectedImageRef = useRef<HTMLImageElement | null>(null);

	const createDataImageHandler = useCallback(
		() => (dataUrl: string, index: number) => {
			const file = dataUrlToFile(dataUrl, `pasted-image-${Date.now()}-${index}.png`);
			if (!file) return null;
			const blobUrl = URL.createObjectURL(file);
			blobFileMapRef.current[blobUrl] = file;
			onBlobFileMapChange({ ...blobFileMapRef.current });
			return blobUrl;
		},
		[onBlobFileMapChange]
	);

	const handleClean = useCallback(() => {
		const handler = createDataImageHandler();
		const cleaned = sanitizePastedHtml(minifyHtml(value || ''), handler);
		onChange(cleaned);
		if (!htmlMode && editorRef.current) {
			editorRef.current.innerHTML = cleaned;
		}
	}, [createDataImageHandler, htmlMode, onChange, value]);

	function insertLinkWithSavedSelection(href: string): boolean {
		if (savedRangeRef.current) {
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(savedRangeRef.current);
			}
		}
		return insertLink(href);
	}

	useEffect(() => {
		if (editorRef.current && !htmlMode) {
			if (document.activeElement !== editorRef.current && editorRef.current.innerHTML !== value) {
				editorRef.current.innerHTML = value || '';
				try {
					const anchors = Array.from(editorRef.current.querySelectorAll('a')) as HTMLAnchorElement[];
					for (const anchor of anchors) {
						if (anchor.getAttribute('target') !== '_blank') anchor.setAttribute('target', '_blank');
						if (!anchor.getAttribute('rel')?.includes('noopener')) anchor.setAttribute('rel', 'noopener noreferrer');
					}
				} catch {}
			}
		}
	}, [htmlMode, value]);

	useEffect(() => {
		onBlobFileMapChange({ ...blobFileMapRef.current });
	}, [onBlobFileMapChange]);

	useEffect(() => {
		if (htmlMode && htmlTextareaRef.current) {
			htmlTextareaRef.current.style.height = 'auto';
			htmlTextareaRef.current.style.height = `${htmlTextareaRef.current.scrollHeight}px`;
		}
	}, [htmlMode, value]);

	const updateActiveCommands = useCallback(() => {
		const active = new Set<string>();
		const inlineCommands = ['bold', 'italic', 'underline', 'strikeThrough'];

		for (const command of inlineCommands) {
			try {
				if (document.queryCommandState(command)) active.add(command);
			} catch {
				// ignore
			}
		}

		try {
			if (document.queryCommandState('insertUnorderedList')) active.add('insertUnorderedList');
			if (document.queryCommandState('insertOrderedList')) active.add('insertOrderedList');
			if (document.queryCommandState('justifyLeft')) active.add('justifyLeft');
			if (document.queryCommandState('justifyCenter')) active.add('justifyCenter');
			if (document.queryCommandState('justifyRight')) active.add('justifyRight');
			if (document.queryCommandState('justifyFull')) active.add('justifyFull');
		} catch {}

		try {
			const fontName = String(document.queryCommandValue('fontName') || '').toLowerCase();
			if (fontName.includes('mono')) active.add('monospace');
		} catch {}

		try {
			const formatBlock = String(document.queryCommandValue('formatBlock') || '').toLowerCase();
			if (formatBlock.includes('h1')) active.add('h1');
			if (formatBlock.includes('h2')) active.add('h2');
			if (formatBlock.includes('h3')) active.add('h3');
		} catch {}

		try {
			if (getClosestSelectionElement('a')) active.add('link');
			if (getClosestSelectionElement('mark')) active.add('highlight');
		} catch {}

		setActiveCommands(active);
	}, []);

	useEffect(() => {
		const handleSelectionChange = () => {
			const editor = editorRef.current;
			const selection = window.getSelection();
			if (!editor || !selection || selection.rangeCount === 0) {
				setSelectedImage(null);
				return;
			}

			const range = selection.getRangeAt(0);
			const commonAncestor = range.commonAncestorContainer;
			const ancestorElement =
				commonAncestor.nodeType === Node.ELEMENT_NODE ? (commonAncestor as Element) : commonAncestor.parentElement;

			if (!ancestorElement || !editor.contains(ancestorElement)) {
				setSelectedImage(null);
				return;
			}

			const anchor = selection.anchorNode;
			const selectionElement = anchor?.nodeType === Node.ELEMENT_NODE ? (anchor as HTMLElement) : anchor?.parentElement;
			const image = selectionElement?.closest('img');
			setSelectedImage(image instanceof HTMLImageElement ? image : null);
			updateActiveCommands();
		};

		document.addEventListener('selectionchange', handleSelectionChange);
		return () => document.removeEventListener('selectionchange', handleSelectionChange);
	}, [updateActiveCommands]);

	const handleEditorInput = useCallback(() => {
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
		updateActiveCommands();
	}, [onChange, updateActiveCommands]);

	const handleEditorKeyUp = useCallback(() => {
		updateActiveCommands();
	}, [updateActiveCommands]);

	const handleEditorKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key !== 'Enter') return;
			e.preventDefault();
			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) return;

			const range = selection.getRangeAt(0);
			const breakNode = document.createElement('br');
			range.deleteContents();
			range.insertNode(breakNode);
			range.setStartAfter(breakNode);
			range.setEndAfter(breakNode);
			selection.removeAllRanges();
			selection.addRange(range);
			handleEditorInput();
		},
		[handleEditorInput]
	);

	const handleEditorMouseUp = useCallback(() => {
		updateActiveCommands();
	}, [updateActiveCommands]);

	const handleEditorMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		const link = target.closest('a');
		const img = target.closest('img');

		setHoveredLink(link && link.getAttribute('href') ? link.getAttribute('href') || '' : '');
		setHoveredImageAlt(img instanceof HTMLImageElement ? img.getAttribute('alt') || '' : '');
	}, []);

	const handleEditorMouseLeave = useCallback(() => {
		setHoveredLink('');
		setHoveredImageAlt('');
	}, []);

	const { handleHtmlChange, handleEditorPaste, handleHtmlPaste } = useEditorHandlers({
		value,
		onChange,
		editorRef,
		htmlTextareaRef,
		blobFileMapRef,
		onBlobFileMapChange,
		handleEditorInput,
	});

	const handleImageSelect = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const blobUrl = URL.createObjectURL(file);
			blobFileMapRef.current[blobUrl] = file;
			onBlobFileMapChange({ ...blobFileMapRef.current });

			if (htmlMode) {
				onChange(`${value}<img src="${blobUrl}" alt="" style="max-width:100%;border-radius:0.75rem;" />`);
			} else if (editorRef.current) {
				editorRef.current.focus();
				execCommand('insertHTML', `<img src="${blobUrl}" alt="" style="max-width:100%;border-radius:0.75rem;" />`);
				handleEditorInput();
			}

			e.target.value = '';
		},
		[editorRef, handleEditorInput, htmlMode, onBlobFileMapChange, onChange, value]
	);

	const toggleHtmlMode = useCallback(() => {
		const next = !htmlMode;

		setHtmlMode(next);
		if (!next && editorRef.current) {
			editorRef.current.innerHTML = value || '';
			try {
				const anchors = Array.from(editorRef.current.querySelectorAll('a')) as HTMLAnchorElement[];
				for (const anchor of anchors) {
					if (anchor.getAttribute('target') !== '_blank') anchor.setAttribute('target', '_blank');
					if (!anchor.getAttribute('rel')?.includes('noopener')) anchor.setAttribute('rel', 'noopener noreferrer');
				}
			} catch {}
		}
		setShowHeadingMenu(false);
	}, [htmlMode, value]);

	const insertImage = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const toolbarButtons = [
		{ cmd: 'bold', icon: 'B', title: 'Bold (Ctrl+B)' },
		{ cmd: 'italic', icon: 'I', title: 'Italic (Ctrl+I)' },
		{ cmd: 'underline', icon: 'U', title: 'Underline (Ctrl+U)' },
		{ cmd: 'strikeThrough', icon: 'S', title: 'Strikethrough' },
	];

	const headingButtons = [
		{ label: 'P', value: 'p', title: 'Paragraph' },
		{ label: 'H1', value: 'h1', title: 'Heading 1' },
		{ label: 'H2', value: 'h2', title: 'Heading 2' },
		{ label: 'H3', value: 'h3', title: 'Heading 3' },
	];

	const currentHeading = activeCommands.has('h1')
		? 'H1'
		: activeCommands.has('h2')
			? 'H2'
			: activeCommands.has('h3')
				? 'H3'
				: 'H';

	return (
		<EditorCanvas
			wrapperRef={wrapperRef}
			htmlMode={htmlMode}
			htmlTextareaRef={htmlTextareaRef}
			value={value}
			handleHtmlChange={handleHtmlChange}
			handleHtmlPaste={handleHtmlPaste}
			placeholder={placeholder}
			editorRef={editorRef}
			handleEditorInput={handleEditorInput}
			handleEditorKeyDown={handleEditorKeyDown}
			handleEditorKeyUp={handleEditorKeyUp}
			handleEditorMouseUp={handleEditorMouseUp}
			handleEditorMouseMove={handleEditorMouseMove}
			handleEditorMouseLeave={handleEditorMouseLeave}
			setSelectedImage={setSelectedImage}
			updateActiveCommands={updateActiveCommands}
			handleEditorPaste={handleEditorPaste}
			fileInputRef={fileInputRef}
			handleImageSelect={handleImageSelect}
			hoveredLink={hoveredLink}
			hoveredImageAlt={hoveredImageAlt}
			showLinkModal={showLinkModal}
			linkUrl={linkUrl}
			setLinkUrl={setLinkUrl}
			setShowLinkModal={setShowLinkModal}
			insertLinkWithSavedSelection={insertLinkWithSavedSelection}
			showAltModal={showAltModal}
			altText={altText}
			setAltText={setAltText}
			selectedImageRef={selectedImageRef}
			setShowAltModal={setShowAltModal}
			toolbar={
				<EditorToolbar
					toolbarRef={toolbarRef}
					toolbarButtons={toolbarButtons}
					headingButtons={headingButtons}
					activeCommands={activeCommands}
					updateActiveCommands={updateActiveCommands}
					handleEditorInput={handleEditorInput}
					savedRangeRef={savedRangeRef}
					setLinkUrl={setLinkUrl}
					setShowLinkModal={setShowLinkModal}
					setShowHeadingMenu={setShowHeadingMenu}
					showHeadingMenu={showHeadingMenu}
					currentHeading={currentHeading}
					insertImage={insertImage}
					selectedImage={selectedImage}
					selectedImageRef={selectedImageRef}
					setAltText={setAltText}
					setShowAltModal={setShowAltModal}
					handleClean={handleClean}
					toggleHtmlMode={toggleHtmlMode}
					value={value}
					htmlMode={htmlMode}
					onChange={onChange}
				/>
			}
			handleEditorInputForModals={handleEditorInput}
		/>
	);
}
