'use client';

import { useEffect, useMemo, useState } from 'react';
import type { OutputData } from '@editorjs/editorjs';

interface Heading {
	id: string;
	text: string;
	level: number;
	elementId: string;
}

interface TableOfContentsProps {
	content: OutputData;
}

export function TableOfContents({ content }: TableOfContentsProps) {
	const headings = useMemo<Heading[]>(() => {
		return content.blocks
			.map((block, index) => {
				if (block.type !== 'header') return null;
				const blockData = block.data as { text?: string; level?: number };
				const text = blockData.text || '';
				const level = blockData.level || 2;
				const blockId = block.id || `block-${index}`;
				const elementId = `heading-${blockId}`;
				return { id: blockId, text, level, elementId };
			})
			.filter((heading): heading is Heading => heading !== null);
	}, [content]);

	const [activeId, setActiveId] = useState<string>('');

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100;

			for (let i = headings.length - 1; i >= 0; i--) {
				const heading = headings[i];
				const element = document.getElementById(heading.elementId);
				if (element && element.offsetTop <= scrollPosition) {
					setActiveId(heading.id);
					break;
				}
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	}, [headings]);

	const handleClick = (elementId: string) => {
		const element = document.getElementById(elementId);
		if (element) {
			const offset = 80;
			const elementPosition = element.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({
				top: elementPosition - offset,
				behavior: 'smooth',
			});
		}
	};

	if (headings.length === 0) {
		return null;
	}

	return (
		<aside>
			<div>
				<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">Contents</h3>
				<nav>
					<ul className="space-y-2 border-l border-white/10">
						{headings.map((heading) => (
							<li key={heading.id}>
								<button
									onClick={() => handleClick(heading.elementId)}
									className={`block w-full text-left text-sm transition-colors hover:text-white ${
										activeId === heading.id ? 'font-semibold text-white' : 'text-white/60'
									} ${heading.level === 1 ? 'pl-0' : heading.level === 2 ? 'pl-4' : heading.level === 3 ? 'pl-8' : 'pl-12'}`}
								>
									{heading.text.replace(/<[^>]+>/g, '')}
								</button>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</aside>
	);
}
