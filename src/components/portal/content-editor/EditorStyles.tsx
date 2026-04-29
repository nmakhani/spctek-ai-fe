export function EditorStyles({ editorHolderId }: { editorHolderId: string }) {
	return (
		<style jsx global>{`
			#${editorHolderId} .ce-block__content,
			#${editorHolderId} .ce-toolbar__content {
				max-width: 100%;
			}

			#${editorHolderId} .ce-block {
				position: relative;
				margin-bottom: 0.85rem;
				padding: 1rem 1.05rem;
				border: 1px solid rgba(255, 255, 255, 0.14);
				border-radius: 1rem;
				background: rgba(255, 255, 255, 0.03);
				transition:
					border-color 0.2s ease,
					background 0.2s ease,
					box-shadow 0.2s ease;
			}

			#${editorHolderId} .ce-block--focused,
			#${editorHolderId} .ce-block--selected {
				border-color: rgba(96, 107, 250, 0.9);
				background: rgba(96, 107, 250, 0.1);
				box-shadow:
					0 0 0 1px rgba(96, 107, 250, 0.35),
					0 0 0 6px rgba(96, 107, 250, 0.08);
			}

			#${editorHolderId} .ce-paragraph,
			#${editorHolderId} .cdx-block {
				color: #f2f4ff;
			}

			#${editorHolderId} .cdx-input,
			#${editorHolderId} .ce-paragraph,
			#${editorHolderId} .cdx-list__item {
				font-size: 0.98rem;
				line-height: 1.65;
			}

			#${editorHolderId} .ce-header {
				color: #ffffff;
				line-height: 1.25;
			}

			#${editorHolderId} .ce-header[data-level='1'] {
				font-size: 2rem;
				font-weight: 700;
			}

			#${editorHolderId} .ce-header[data-level='2'] {
				font-size: 1.65rem;
				font-weight: 700;
			}

			#${editorHolderId} .ce-header[data-level='3'] {
				font-size: 1.35rem;
				font-weight: 650;
			}

			#${editorHolderId} .ce-header[data-level='4'] {
				font-size: 1.15rem;
				font-weight: 650;
			}

			/* Disable clicking in the empty space below the editor */
			#${editorHolderId} .codex-editor__redactor {
				padding-bottom: 0 !important;
			}

			#${editorHolderId} .ce-toolbar {
				left: 0;
				right: auto;
				width: 3rem;
			}

			#${editorHolderId} .ce-toolbar__content {
				max-width: none;
			}

			#${editorHolderId} .ce-toolbar__actions {
				position: absolute !important;
				left: -3rem !important;
				top: 50% !important;
				transform: translateY(-50%) !important;
				display: flex !important;
				flex-direction: column !important;
				align-items: center;
				justify-content: center;
				gap: 0.45rem;
				padding: 0.4rem 0.35rem;
				border: none;
				border-radius: 999px;
				background: transparent;
				box-shadow: none;
				opacity: 1 !important;
				pointer-events: auto;
				z-index: 20;
				margin: 0;
			}

			#${editorHolderId} .ce-toolbar__plus,
			#${editorHolderId} .ce-toolbar__settings-btn {
				position: static !important;
				margin: 0 !important;
			}

			#${editorHolderId} .ce-toolbar__plus {
				display: inline-flex !important;
				align-items: center;
				justify-content: center;
				width: 2.25rem !important;
				height: 2.25rem !important;
				border-radius: 999px;
				background: rgba(96, 107, 250, 0.18);
				color: #eef1ff;
			}

			#${editorHolderId} .ce-toolbar__settings-btn {
				display: inline-flex !important;
				align-items: center;
				justify-content: center;
				width: 2.25rem !important;
				height: 2.25rem !important;
				border-radius: 999px;
				background: rgba(255, 255, 255, 0.08);
				color: #eef1ff;
			}

			#${editorHolderId} .ce-toolbar__plus:hover,
			#${editorHolderId} .ce-toolbar__settings-btn:hover {
				background: rgba(96, 107, 250, 0.3);
			}

			#${editorHolderId} .spctek-rich-paragraph {
				display: flex;
				flex-direction: column;
				gap: 0.65rem;
				padding-right: 1rem;
			}

			#${editorHolderId} .spctek-rich-paragraph__toolbar {
				display: flex;
				flex-wrap: wrap;
				gap: 0.35rem;
				padding-bottom: 0.45rem;
				border-bottom: 1px solid rgba(255, 255, 255, 0.12);
			}

			#${editorHolderId} .spctek-rich-paragraph__btn {
				border: 1px solid rgba(255, 255, 255, 0.15);
				background: rgba(255, 255, 255, 0.06);
				color: #eef1ff;
				font-size: 0.75rem;
				font-weight: 600;
				padding: 0.2rem 0.45rem;
				border-radius: 0.5rem;
				cursor: pointer;
			}

			#${editorHolderId} .spctek-rich-paragraph__btn:hover {
				background: rgba(96, 107, 250, 0.18);
				border-color: rgba(96, 107, 250, 0.55);
			}

			#${editorHolderId} .spctek-rich-paragraph__content {
				min-height: 2.2rem;
				outline: none;
				color: #f2f4ff;
				font-size: 0.98rem;
				line-height: 1.65;
			}

			#${editorHolderId} .spctek-rich-paragraph__content:empty:before {
				content: attr(data-placeholder);
				color: rgba(255, 255, 255, 0.38);
			}
		`}</style>
	);
}
