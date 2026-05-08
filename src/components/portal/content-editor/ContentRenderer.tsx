'use client';

import { useCallback, useState } from 'react';
import type { OutputData } from '@editorjs/editorjs';

import { resolveR2PublicUrl } from '@/lib/r2';

interface ContentRendererProps {
	data: OutputData;
	title: string;
}

type ListItemNode = string | { content?: string; items?: ListItemNode[] };

function processLinksInHtml(html: string): string {
	// Add target="_blank" and rel="noopener noreferrer" to all links
	return html.replace(/<a\s+([^>]*?)>/gi, (match, attrs) => {
		if (attrs.includes('target=')) {
			return match;
		}
		return `<a ${attrs} target="_blank" rel="noopener noreferrer">`;
	});
}

function renderListItemNode(item: ListItemNode, key: string) {
	if (typeof item === 'string') {
		const processedHtml = processLinksInHtml(item);
		return <span dangerouslySetInnerHTML={{ __html: processedHtml }} />;
	}

	const content = String(item.content || '');
	const processedContent = processLinksInHtml(content);
	const nested = Array.isArray(item.items) ? item.items : [];

	return (
		<>
			<span dangerouslySetInnerHTML={{ __html: processedContent }} />
			{nested.length > 0 && (
				<ul className="mt-2 list-disc space-y-2 pl-6 text-white/85">
					{nested.map((nestedItem, nestedIndex) => (
						<li key={`${key}-nested-${nestedIndex}`}>
							{renderListItemNode(nestedItem, `${key}-nested-${nestedIndex}`)}
						</li>
					))}
				</ul>
			)}
		</>
	);
}

export function ContentRenderer({ data, title }: ContentRendererProps) {
	const [hoveredLink, setHoveredLink] = useState<string>('');

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		const link = target.closest('a');
		if (link && link.getAttribute('href')) {
			setHoveredLink(link.getAttribute('href') || '');
		} else {
			setHoveredLink('');
		}
	}, []);

	const handleMouseLeave = useCallback(() => {
		setHoveredLink('');
	}, []);

	return (
		<div className="w-full rounded-2xl border border-white/15 bg-white/[0.04] p-6 md:p-8">
			{title && <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">{title}</h1>}

			<div className="mt-8 space-y-5 text-white/90" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
				{data.blocks.map((block, index) => {
					const key = `${block.type}-${index}`;
					const blockData = (block.data || {}) as Record<string, unknown>;

					if (block.type === 'header') {
						const level = Number(blockData.level) || 2;
						const text = String(blockData.text || '');
						const processedText = processLinksInHtml(text);
						const blockId = block.id || `block-${index}`;
						const id = `heading-${blockId}`;
						if (level === 1) {
							return (
								<h1
									key={key}
									id={id}
									className="scroll-mt-24 text-3xl font-semibold text-white md:text-4xl"
									dangerouslySetInnerHTML={{ __html: processedText }}
								/>
							);
						}
						if (level === 2) {
							return (
								<h2
									key={key}
									id={id}
									className="scroll-mt-24 text-2xl font-semibold text-white md:text-3xl"
									dangerouslySetInnerHTML={{ __html: processedText }}
								/>
							);
						}
						if (level === 3) {
							return (
								<h3
									key={key}
									id={id}
									className="scroll-mt-24 text-xl font-semibold text-white md:text-2xl"
									dangerouslySetInnerHTML={{ __html: processedText }}
								/>
							);
						}
						return (
							<h4
								key={key}
								id={id}
								className="scroll-mt-24 text-lg font-semibold text-white md:text-xl"
								dangerouslySetInnerHTML={{ __html: processedText }}
							/>
						);
					}

					if (block.type === 'paragraph') {
						const text = String(blockData.text || '');
						const processedText = processLinksInHtml(text);
						return (
							<p
								key={key}
								className="text-base leading-relaxed text-white/85"
								dangerouslySetInnerHTML={{ __html: processedText }}
							/>
						);
					}

					if (block.type === 'list') {
						const style = String(blockData.style || 'unordered');
						const items = ((blockData.items as ListItemNode[]) || []).filter(Boolean);

						if (style === 'ordered') {
							return (
								<ol key={key} className="list-decimal space-y-2 pl-6 text-white/85">
									{items.map((item, idx) => (
										<li key={`${key}-item-${idx}`}>{renderListItemNode(item, `${key}-item-${idx}`)}</li>
									))}
								</ol>
							);
						}

						return (
							<ul key={key} className="list-disc space-y-2 pl-6 text-white/85">
								{items.map((item, idx) => (
									<li key={`${key}-item-${idx}`}>{renderListItemNode(item, `${key}-item-${idx}`)}</li>
								))}
							</ul>
						);
					}

					if (block.type === 'image') {
						const file = (blockData.file || {}) as Record<string, unknown>;
						const url = resolveR2PublicUrl(String(file.url || ''));
						const caption = String(blockData.caption || '');

						if (!url) {
							return null;
						}

						return (
							<figure key={key} className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={url} alt={caption || 'Content image'} className="h-auto w-full object-cover" />
								{caption && <figcaption className="px-4 py-2 text-sm text-white/65">{caption}</figcaption>}
							</figure>
						);
					}

					if (block.type === 'raw') {
						const html = String(blockData.html || '');
						if (!html.trim()) {
							return null;
						}

						const processedHtml = processLinksInHtml(html);
						return <div key={key} dangerouslySetInnerHTML={{ __html: processedHtml }} />;
					}

					return null;
				})}
			</div>

			{/* Link preview on hover */}
			{hoveredLink && (
				<div className="fixed bottom-4 left-4 z-50 max-w-md overflow-hidden rounded-lg border border-white/15 bg-[#09101f]/95 px-3 py-2 text-xs text-white/80 shadow-2xl backdrop-blur-md">
					<span className="text-white/60">Link: </span>
					<span className="font-mono">{hoveredLink}</span>
				</div>
			)}
		</div>
	);
}
