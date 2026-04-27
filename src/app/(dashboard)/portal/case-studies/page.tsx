'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { type Content } from '@/components/portal/content-editor/types';
import { extractPreviewText } from '@/components/portal/content-editor/utils';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { contentApi } from '@/lib/api';

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function CaseStudiesContent() {
	const router = useRouter();
	const [items, setItems] = useState<Content[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

	const publishedCount = useMemo(() => items.filter((item) => item.is_published).length, [items]);

	const fetchItems = async () => {
		try {
			setLoading(true);
			const response = await contentApi.list({ type: 'CASE_STUDY' });
			setItems(response.data);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load case studies');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchItems();
	}, []);

	const requestDelete = (id: string) => {
		setPendingDeleteId(id);
	};

	const handleDelete = async () => {
		if (!pendingDeleteId) {
			return;
		}

		try {
			setDeletingId(pendingDeleteId);
			setError('');
			await contentApi.delete(pendingDeleteId);
			setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
			toast.success('Case study deleted');
			setPendingDeleteId(null);
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete case study');
			setError(message);
			toast.error(message);
		} finally {
			setDeletingId(null);
		}
	};

	const cancelDelete = () => {
		if (!deletingId) {
			setPendingDeleteId(null);
		}
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingDeleteId)}
				title="Delete case study"
				message="This action cannot be undone. Are you sure you want to continue?"
				confirmLabel="Delete"
				loading={Boolean(deletingId)}
				onConfirm={handleDelete}
				onCancel={cancelDelete}
			/>
			<PageHeader
				title="Case Studies"
				subtitle="Dashboard"
				backLink="/portal"
				backText="← Back to Home"
				buttonText="+ New Case Study"
				buttonOnClick={() => router.push('/portal/case-studies/new')}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<StatCard label="Total Case Studies" loading={loading} count={items.length} />
					<StatCard label="Published" loading={loading} count={publishedCount} />
				</div>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading case studies...</div>
				) : items.length === 0 ? (
					<div className="py-12 text-center text-white/55">No case studies yet</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{items.map((item) => (
							<div
								key={item.id}
								className="flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7d89ff]/60"
							>
								{item.thumbnail_url && (
									<div className="relative h-48 w-full shrink-0 overflow-hidden bg-black/40">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={item.thumbnail_url}
											alt={item.title}
											className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
										/>
									</div>
								)}
								<div className="flex flex-1 flex-col p-6">
									<h3 className="mb-2 line-clamp-2 text-xl font-semibold text-white">{item.title}</h3>
									<p className="mb-2 text-xs text-[#a9b2ff]">/{item.slug}</p>
									{item.author && <p className="mb-3 text-sm text-white/60">By {item.author.name}</p>}
									{item.summary && <p className="text-white/78 mb-3 line-clamp-2 text-sm">{item.summary}</p>}
									{item.categories && item.categories.length > 0 && (
										<div className="mb-3 flex flex-wrap gap-1.5">
											{item.categories.map((category) => (
												<span
													key={`${item.id}-${category.id}`}
													className="rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-2 py-0.5 text-[11px] text-[#cfd5ff]"
												>
													{category.name}
												</span>
											))}
										</div>
									)}
									<p className="mb-4 line-clamp-3 flex-1 text-sm text-white/65">
										{extractPreviewText(typeof item.content === 'string' ? item.content : JSON.stringify(item.content))}
									</p>

									<div className="mb-4 flex items-center justify-between text-xs">
										<span
											className={`rounded-full border px-2.5 py-1 ${
												item.is_published
													? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
													: 'border-amber-400/40 bg-amber-400/10 text-amber-300'
											}`}
										>
											{item.is_published ? 'Published' : 'Draft'}
										</span>
										{item.created_at && (
											<span className="text-white/60">Created {new Date(item.created_at).toLocaleDateString()}</span>
										)}
									</div>

									<div className="flex gap-2">
										<Link
											href={`/portal/case-studies/${item.id}/edit`}
											className="flex-1 rounded-lg bg-[#606bfa] px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-[#6f79ff]"
										>
											Edit
										</Link>
										<button
											onClick={() => requestDelete(item.id)}
											disabled={deletingId === item.id}
											className="flex-1 rounded-lg bg-[#ef4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:opacity-60"
										>
											{deletingId === item.id ? 'Deleting...' : 'Delete'}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

export default function CaseStudiesPage() {
	return (
		<ProtectedRoute>
			<CaseStudiesContent />
		</ProtectedRoute>
	);
}
