import React from 'react';

export default function EditorStyles() {
	return (
		<style jsx>{`
			[contenteditable]:empty:before {
				content: attr(data-placeholder);
				color: rgba(255, 255, 255, 0.38);
				pointer-events: none;
			}
			[contenteditable] {
				direction: ltr;
				unicode-bidi: plaintext;
				text-align: left;
			}
			[contenteditable] h1,
			[contenteditable] h2,
			[contenteditable] h3 {
				font-weight: 700;
				line-height: 1.2;
				margin: 1rem 0 0.5rem;
				color: #a9b2ff;
				padding-bottom: 0.25rem;
				border-bottom: 2px solid rgba(106, 107, 250, 0.2);
			}
			[contenteditable] h1 {
				font-size: 2.5rem;
				letter-spacing: -0.02em;
			}
			[contenteditable] h2 {
				font-size: 2rem;
			}
			[contenteditable] h3 {
				font-size: 1.5rem;
			}
			[contenteditable] ul,
			[contenteditable] ol {
				display: block;
				margin: 0.75rem 0;
			}
			[contenteditable] ul {
				list-style-type: disc;
				list-style-position: outside;
				padding-left: 2rem;
			}
			[contenteditable] ol {
				list-style-type: decimal;
				list-style-position: outside;
				padding-left: 2rem;
			}
			[contenteditable] li {
				display: list-item;
				list-style: inherit;
				margin: 0.5rem 0;
				line-height: 1.6;
			}
			[contenteditable] img {
				max-width: 100%;
				border-radius: 0.75rem;
				margin: 0.5rem 0;
			}
			[contenteditable] p {
				margin: 0.5rem 0;
			}
			[contenteditable] b,
			[contenteditable] strong {
				font-weight: 700;
			}
			[contenteditable] i,
			[contenteditable] em {
				font-style: italic;
			}
			[contenteditable] u {
				text-decoration: underline;
			}
			[contenteditable] s,
			[contenteditable] strike {
				text-decoration: line-through;
			}
			[contenteditable] font[face='monospace'] {
				font-family: monospace;
				background: rgba(255, 255, 255, 0.1);
				padding: 0.1rem 0.3rem;
				border-radius: 0.25rem;
			}
		`}</style>
	);
}
