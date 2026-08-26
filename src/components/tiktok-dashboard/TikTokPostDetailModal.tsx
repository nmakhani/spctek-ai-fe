'use client';

import type { TikTokPostDetail } from '@/lib/tiktok-dashboard/posts';

const privacyLevelLabels: Record<string, string> = {
	PUBLIC_TO_EVERYONE: 'Public',
	MUTUAL_FOLLOW_FRIENDS: 'Friends',
	FOLLOWER_OF_CREATOR: 'Followers',
	SELF_ONLY: 'Only me',
};

const statusLabels: Record<TikTokPostDetail['status'], string> = {
	SCHEDULED: 'Scheduled',
	PROCESSING: 'Processing',
	POSTED: 'Posted',
	FAILED: 'Failed',
};

function formatDate(value: string) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function BooleanValue({ value }: { value: boolean }) {
	return <span className={value ? 'text-emerald-300' : 'text-white/45'}>{value ? 'Enabled' : 'Disabled'}</span>;
}

interface TikTokPostDetailModalProps {
	post: TikTokPostDetail;
	onClose: () => void;
}

export function TikTokPostDetailModal({ post, onClose }: TikTokPostDetailModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
			<section
				className="max-h-[min(850px,92vh)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#11172a] p-5 text-white shadow-2xl shadow-black/50 sm:p-7"
				role="dialog"
				aria-modal="true"
				aria-labelledby="post-detail-title"
				onMouseDown={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a0a6fc]">Post details</p>
						<h2 id="post-detail-title" className="mt-2 text-2xl font-semibold">{post.title}</h2>
					</div>
					<button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/10 hover:text-white" aria-label="Close post details">
						Close
					</button>
				</div>

				<div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]">
					{post.mediaKind === 'PHOTO' ? (
						<img src={post.mediaUrl} alt={post.title} className="mx-auto max-h-80 w-full object-contain" />
					) : (
						<video src={post.mediaUrl} controls className="mx-auto max-h-80 w-full" preload="metadata" />
					)}
				</div>

				<div className="mt-6 space-y-5 text-sm">
					{post.description && <p className="whitespace-pre-wrap leading-6 text-white/75">{post.description}</p>}
					<dl className="grid gap-3 sm:grid-cols-2">
						<div><dt className="text-white/45">Status</dt><dd className="mt-1 font-medium">{statusLabels[post.status]}</dd></div>
						<div><dt className="text-white/45">Privacy</dt><dd className="mt-1 font-medium">{privacyLevelLabels[post.privacyLevel] ?? post.privacyLevel}</dd></div>
						<div><dt className="text-white/45">Comments</dt><dd className="mt-1"><BooleanValue value={post.commentsEnabled} /></dd></div>
						<div><dt className="text-white/45">Duets</dt><dd className="mt-1"><BooleanValue value={post.duetEnabled} /></dd></div>
						<div><dt className="text-white/45">Stitches</dt><dd className="mt-1"><BooleanValue value={post.stitchEnabled} /></dd></div>
						<div><dt className="text-white/45">Your Brand</dt><dd className="mt-1"><BooleanValue value={post.brandOrganicToggle} /></dd></div>
						<div><dt className="text-white/45">Branded Content</dt><dd className="mt-1"><BooleanValue value={post.brandContentToggle} /></dd></div>
						{post.scheduledAt && <div><dt className="text-white/45">Scheduled for</dt><dd className="mt-1 font-medium">{formatDate(post.scheduledAt)}</dd></div>}
						<div><dt className="text-white/45">Created</dt><dd className="mt-1 font-medium">{formatDate(post.createdAt)}</dd></div>
						<div><dt className="text-white/45">Updated</dt><dd className="mt-1 font-medium">{formatDate(post.updatedAt)}</dd></div>
					</dl>
					{post.status === 'FAILED' && post.errorMessage && <p className="rounded-xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-red-200">{post.errorMessage}</p>}
					{post.publishId && <p className="text-white/65">Published ID: <span className="font-medium text-white">{post.publishId}</span></p>}
				</div>
			</section>
		</div>
	);
}
