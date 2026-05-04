'use client';

import { useEffect, useState } from 'react';

interface Heading {
	id: string;
	text: string;
	level: number;
	elementId: string;
}

interface TableOfContentsProps {
	headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>('');

	const filtered = headings.filter((h) => h.level === 2);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100;

			for (let i = filtered.length - 1; i >= 0; i--) {
				const heading = filtered[i];
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
	}, [filtered]);

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

	if (filtered.length === 0) {
		return null;
	}

	return (
		<aside>
			<div>
				<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">Contents</h3>
				<nav>
					<ul className="space-y-2 border-l border-white/10">
						{filtered.map((heading) => (
							<li key={heading.id}>
								<button
									onClick={() => handleClick(heading.elementId)}
									className={`block w-full text-left text-sm transition-colors hover:text-white ${
										activeId === heading.id ? 'font-semibold text-white' : 'text-white/60'
									} pl-4`}
								>
									{heading.text}
								</button>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</aside>
	);
}
