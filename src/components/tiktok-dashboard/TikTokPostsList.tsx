'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { fetchPostDetail, fetchPostsList, type TikTokPostDetail, type TikTokPostSummary } from '@/lib/tiktok-dashboard/posts';
import { TikTokPostDetailModal } from './TikTokPostDetailModal';

const statusLabels: Record<TikTokPostSummary['status'], string> = {
	SCHEDULED: 'Scheduled',
	PROCESSING: 'Processing',
	POSTED: 'Posted',
	FAILED: 'Failed',
};

function formatDate(value: string) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function statusClass(status: TikTokPostSummary['status']) {
	if (status === 'POSTED') return 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200';
	if (status === 'FAILED') return 'border-red-300/25 bg-red-300/10 text-red-200';
	if (status === 'SCHEDULED') return 'border-amber-300/25 bg-amber-300/10 text-amber-200';
	return 'border-[#a0a6fc]/25 bg-[#606bfa]/10 text-[#c5c8ff]';
}

export function TikTokPostsList({ state }: { state: string }) {
	const [posts, setPosts] = useState<TikTokPostSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');
	const [selectedPost, setSelectedPost] = useState<TikTokPostDetail | null>(null);
	const [isDetailLoading, setIsDetailLoading] = useState(false);

	useEffect(() => {
		let isCancelled = false;
		let isInitialLoad = true;

		const loadPosts = async () => {
			try {
				const nextPosts = await fetchPostsList(state);
				if (isCancelled) return;
				setPosts(nextPosts);
				setLoadError('');
			} catch (error) {
				if (!isCancelled && isInitialLoad) {
					setLoadError(error instanceof Error ? error.message : 'Unable to load your TikTok posts.');
				}
			} finally {
				if (!isCancelled && isInitialLoad) setIsLoading(false);
				isInitialLoad = false;
			}
		};

		void loadPosts();
		const intervalId = window.setInterval(() => void loadPosts(), 7000);

		return () => {
			isCancelled = true;
			window.clearInterval(intervalId);
		};
	}, [state]);

	const handlePostClick = async (postId: number) => {
		setIsDetailLoading(true);
		try {
			setSelectedPost(await fetchPostDetail(postId));
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Unable to load post details.');
		} finally {
			setIsDetailLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#020617] px-5 py-6 text-white sm:px-8 lg:px-12">
			<div className="pointer-events-none fixed left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#606bfa]/15 blur-[140px]" />
			<div className="relative mx-auto max-w-5xl">
				<header className="flex items-center justify-between gap-4">
					<Link href={`/tiktok/dashboard?state=${encodeURIComponent(state)}`} className="text-sm text-white/65 hover:text-white">Back to dashboard</Link>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a0a6fc]">TikTok dashboard</p>
				</header>
				<section className="mx-auto mt-10 max-w-3xl sm:mt-14" aria-labelledby="my-posts-title">
					<div className="mb-8"><h1 id="my-posts-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">My Posts</h1><p className="mt-2 text-sm text-white/55">Your submitted TikTok content and its latest status.</p></div>
					{isLoading && <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-white/65" role="status">Loading your posts...</div>}
					{!isLoading && loadError && <div className="rounded-3xl border border-red-300/20 bg-red-300/[0.06] p-8 text-center text-sm text-red-200" role="alert">{loadError}</div>}
					{!isLoading && !loadError && posts.length === 0 && <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-white/65">No posts submitted yet.</div>}
					{!isLoading && !loadError && posts.length > 0 && <div className="space-y-3">{posts.map((post) => <button key={post.id} type="button" onClick={() => void handlePostClick(post.id)} className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-[#8c96ff]/50 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc] sm:p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-lg" aria-hidden="true">{post.mediaKind === 'PHOTO' ? '▧' : '▶'}</span><span className="min-w-0 flex-1"><span className="block truncate font-medium text-white">{post.title}</span><span className="mt-1 block text-xs text-white/45">{post.mediaKind === 'PHOTO' ? 'Photo' : 'Video'} · {formatDate(post.createdAt)}</span></span><span className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${statusClass(post.status)}`}>{post.status === 'SCHEDULED' && post.scheduledAt ? `Scheduled for ${formatDate(post.scheduledAt)}` : post.status === 'PROCESSING' ? `${statusLabels[post.status]}...` : statusLabels[post.status]}</span></button>)}</div>}
				</section>
			</div>
			{isDetailLoading && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50" role="status"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#a0a6fc]" /></div>}
			{selectedPost && <TikTokPostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
		</main>
	);
}
