'use client';

import type { Author } from '@/app/(dashboard)/portal/authors/page';

interface AuthorCardProps {
	author: Author;
	onEdit: (author: Author) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
}

export function AuthorCard({ author, onEdit, onDelete, deleting }: AuthorCardProps) {
	return (
		<div className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7d89ff]/60">
			<div className="flex flex-1 flex-col p-5">
				<div className="mb-4 flex items-center gap-4">
					{author.profile_picture_url ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={author.profile_picture_url}
							alt={author.name}
							className="h-16 w-16 rounded-full border-2 border-white/20 object-cover"
						/>
					) : (
						<div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/[0.08] text-2xl font-bold text-white/60">
							{author.name.charAt(0).toUpperCase()}
						</div>
					)}
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-white">{author.name}</h3>
						{author.position && <p className="text-sm text-white/60">{author.position}</p>}
						{author.organization && <p className="text-xs text-white/45">{author.organization}</p>}
					</div>
				</div>

				{author.about && <p className="mb-4 line-clamp-2 text-sm text-white/70">{author.about}</p>}

				<SocialLinks socialLinks={author.social_links} />

				<p className="text-xs text-white/45">Created {new Date(author.created_at).toLocaleDateString()}</p>

				<div className="mt-4 flex gap-2">
					<button
						type="button"
						onClick={() => onEdit(author)}
						className="flex-1 rounded-lg bg-[#606bfa] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#6f79ff]"
					>
						Edit
					</button>
					<button
						type="button"
						onClick={() => onDelete(author.id)}
						disabled={deleting}
						className="flex-1 rounded-lg bg-[#ef4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:opacity-60"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

interface SocialLinksProps {
	socialLinks?: Record<string, string>;
}

function SocialLinks({ socialLinks }: SocialLinksProps) {
	if (!socialLinks) return null;

	const platforms = [
		{ key: 'linkedin', label: 'LinkedIn' },
		{ key: 'twitter', label: 'Twitter' },
		{ key: 'github', label: 'GitHub' },
		{ key: 'website', label: 'Website' },
	] as const;

	const hasLinks = platforms.some((p) => socialLinks[p.key]);

	if (!hasLinks) return null;

	return (
		<div className="mb-4 flex flex-wrap gap-2">
			{platforms.map(
				(platform) =>
					socialLinks[platform.key] && (
						<a
							key={platform.key}
							href={socialLinks[platform.key]}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-xs text-white/80 hover:bg-white/[0.1]"
						>
							{platform.label}
						</a>
					)
			)}
		</div>
	);
}
