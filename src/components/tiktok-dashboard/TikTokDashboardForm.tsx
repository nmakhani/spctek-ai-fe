'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getTikTokUser, type TikTokUser } from '@/lib/tiktok-dashboard/user';

const permissionOptions = [
	{ id: 'comments', label: 'Allow comments' },
	{ id: 'duets', label: 'Allow duets' },
	{ id: 'stitches', label: 'Allow stitches' },
] as const;

const POST_TO_TIKTOK_WEBHOOK = 'https://n8n.spctek.com/webhook/post-content-on-tiktok';

export function TikTokDashboardForm() {
	const router = useRouter();
	const [user, setUser] = useState<TikTokUser | null | undefined>(undefined);
	const [showSchedule, setShowSchedule] = useState(false);
	const [status, setStatus] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const isImage = selectedFile?.type.startsWith('image/') ?? false;

	useEffect(() => {
		const syncUser = () => setUser(getTikTokUser());

		syncUser();
		window.addEventListener('storage', syncUser);
		return () => window.removeEventListener('storage', syncUser);
	}, []);

	useEffect(() => {
		if (user === null) router.replace('/tiktok');
	}, [router, user]);

	if (user === undefined || user === null) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#020617] px-5 text-white" role="status">
				<p className="text-sm text-white/70">Loading TikTok dashboard…</p>
			</main>
		);
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!selectedFile) {
			setStatus('Please choose an image or video file before submitting.');
			fileInputRef.current?.focus();
			return;
		}

		setIsSubmitting(true);
		setStatus('Submitting your media…');

		try {
			const formData = new FormData(event.currentTarget);

			if (!formData.get('scheduleAt')) formData.delete('scheduleAt');
			formData.set('media', selectedFile, selectedFile.name);
			formData.set('state', user.state);

			const response = await fetch(POST_TO_TIKTOK_WEBHOOK, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Submission failed (${response.status}).`);
			}

			setStatus('Your media has been submitted successfully.');
		} catch (error) {
			setStatus(error instanceof Error ? error.message : 'Unable to submit your media. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#020617] px-5 py-6 text-white sm:px-8 lg:px-12">
			<div className="pointer-events-none fixed left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#606bfa]/15 blur-[140px]" />

			<div className="relative mx-auto max-w-5xl">
				<header className="flex justify-end">
					<div className="flex items-center gap-3" aria-label={`Logged in as ${user.username}`}>
						<span className="hidden text-sm font-medium text-white/80 sm:inline">{user.username}</span>
						<span
							role="img"
							aria-label={`${user.username}'s profile picture`}
							className="h-11 w-11 rounded-full border border-white/20 bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: `url(${user.avatar_url})` }}
						/>
					</div>
				</header>

				<section className="mx-auto mt-10 max-w-3xl sm:mt-14" aria-labelledby="video-details-title">
					<div className="mb-8">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a0a6fc]">TikTok dashboard</p>
						<h1 id="video-details-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
							Media details
						</h1>
						<p className="mt-2 text-sm text-white/55">Prepare a media upload or schedule it for later.</p>
					</div>

					<form
						className="space-y-7 rounded-[28px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.035))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
						onSubmit={handleSubmit}
					>
						<div>
							<label htmlFor="media" className="mb-2 block text-sm font-medium text-white/85">
								Media file
							</label>
							<input
								ref={fileInputRef}
								id="media"
								name="media"
								type="file"
								accept="video/*,image/*"
								required
								onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
								className="block w-full cursor-pointer rounded-2xl border border-dashed border-white/25 bg-white/[0.04] px-4 py-5 text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#606bfa] file:px-4 file:py-2 file:font-semibold file:text-white hover:border-[#8c96ff] focus:outline-none focus:ring-2 focus:ring-[#606bfa]/40"
							/>
							<p className="mt-2 text-xs text-white/45">
								{selectedFile ? `${selectedFile.name} selected` : 'Choose an image or video you want to post.'}
							</p>
						</div>

						<div>
							<label htmlFor="caption" className="mb-2 block text-sm font-medium text-white/85">
								Media caption
							</label>
							<textarea
								id="caption"
								name="caption"
								rows={5}
								maxLength={2200}
								placeholder="Write a caption for your media"
								className="w-full resize-y rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
							/>
						</div>

						<div>
							<label htmlFor="visibility" className="mb-2 block text-sm font-medium text-white/85">
								Who can view
							</label>
							<select
								id="visibility"
								name="visibility"
								defaultValue=""
								className="w-full rounded-2xl border border-white/15 bg-[#11172a] px-4 py-3 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
							>
								<option value="" disabled>
									Select visibility
								</option>

								<option value="PUBLIC_TO_EVERYONE">Public to everyone</option>
								<option value="MUTUAL_FOLLOW_FRIENDS">Mutual follow friends</option>
								<option value="FOLLOWER_OF_CREATORS">Follower of creators</option>
								<option value="SELF_ONLY">Self only</option>
							</select>
						</div>

						<fieldset>
							<legend className="mb-3 text-sm font-medium text-white/85">Interaction permissions</legend>
							<div className="grid gap-3 sm:grid-cols-3">
								{permissionOptions.map((option) => {
									const isVideoOnly = option.id === 'duets' || option.id === 'stitches';
									const isDisabled = isVideoOnly && isImage;

									return (
										<label
											key={option.id}
											className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
												isDisabled
													? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-white/35'
													: 'cursor-pointer border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.07]'
											}`}
										>
											<input
												type="checkbox"
												name={option.id}
												disabled={isDisabled}
												className="h-4 w-4 accent-[#606bfa] disabled:cursor-not-allowed"
											/>
											{option.label}
										</label>
									);
								})}
							</div>
						</fieldset>

						{showSchedule && (
							<div className="rounded-2xl border border-[#606bfa]/35 bg-[#606bfa]/10 p-4">
								<label htmlFor="schedule-at" className="mb-2 block text-sm font-medium text-white/85">
									Schedule date and time
								</label>
								<input
									id="schedule-at"
									name="scheduleAt"
									type="datetime-local"
									className="w-full rounded-xl border border-white/15 bg-[#11172a] px-4 py-3 text-white outline-none [color-scheme:dark] focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
								/>
							</div>
						)}

						<div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={() => {
									setShowSchedule(true);
									setStatus('Choose a date and time to schedule this media.');
								}}
								className="min-h-12 rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
							>
								Schedule
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="min-h-12 rounded-xl bg-[#606bfa] px-7 py-3 font-semibold text-white transition hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
							>
								{isSubmitting ? 'Submitting…' : 'Submit'}
							</button>
						</div>

						<p className="sr-only" aria-live="polite">
							{status}
						</p>
					</form>
				</section>
			</div>
		</main>
	);
}
