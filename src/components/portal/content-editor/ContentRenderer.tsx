import type { OutputData } from '@editorjs/editorjs';

import { resolveR2PublicUrl } from '@/lib/r2';

interface ContentRendererProps {
	data: OutputData;
	title: string;
}

type ListItemNode = string | { content?: string; items?: ListItemNode[] };

function renderListItemNode(item: ListItemNode, key: string) {
	if (typeof item === 'string') {
		return <span dangerouslySetInnerHTML={{ __html: item }} />;
	}

	const content = String(item.content || '');
	const nested = Array.isArray(item.items) ? item.items : [];

	return (
		<>
			<span dangerouslySetInnerHTML={{ __html: content }} />
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
	return (
		<div className="w-full rounded-2xl border border-white/15 bg-white/[0.04] p-6 md:p-8">
			{title && <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">{title}</h1>}

			<div className="mt-8 space-y-5 text-white/90">
				{data.blocks.map((block, index) => {
					const key = `${block.type}-${index}`;
					const blockData = (block.data || {}) as Record<string, unknown>;

					if (block.type === 'header') {
						const level = Number(blockData.level) || 2;
						const text = String(blockData.text || '');
						const blockId = block.id || `block-${index}`;
						const id = `heading-${blockId}`;
						if (level === 1) {
							return (
								<h1
									key={key}
									id={id}
									className="scroll-mt-24 text-3xl font-semibold text-white md:text-4xl"
									dangerouslySetInnerHTML={{ __html: text }}
								/>
							);
						}
						if (level === 2) {
							return (
								<h2
									key={key}
									id={id}
									className="scroll-mt-24 text-2xl font-semibold text-white md:text-3xl"
									dangerouslySetInnerHTML={{ __html: text }}
								/>
							);
						}
						if (level === 3) {
							return (
								<h3
									key={key}
									id={id}
									className="scroll-mt-24 text-xl font-semibold text-white md:text-2xl"
									dangerouslySetInnerHTML={{ __html: text }}
								/>
							);
						}
						return (
							<h4
								key={key}
								id={id}
								className="scroll-mt-24 text-lg font-semibold text-white md:text-xl"
								dangerouslySetInnerHTML={{ __html: text }}
							/>
						);
					}

					if (block.type === 'paragraph') {
						const text = String(blockData.text || '');
						return (
							<p
								key={key}
								className="text-base leading-relaxed text-white/85"
								dangerouslySetInnerHTML={{ __html: text }}
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

						return <div key={key} dangerouslySetInnerHTML={{ __html: html }} />;
					}

					return null;
				})}
			</div>
		</div>
	);
}
