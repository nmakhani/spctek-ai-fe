'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

import { getTikTokUser } from '@/lib/tiktok-dashboard/user';

const permissionOptions = [
	{ id: 'comments', label: 'Allow comments' },
	{ id: 'duets', label: 'Allow duets' },
	{ id: 'stitches', label: 'Allow stitches' },
] as const;

function subscribeToTikTokUser(callback: () => void) {
	window.addEventListener('storage', callback);
	return () => window.removeEventListener('storage', callback);
}

function getServerTikTokUser() {
	return null;
}

export function TikTokDashboardForm() {
	const router = useRouter();
	const user = useSyncExternalStore(subscribeToTikTokUser, getTikTokUser, getServerTikTokUser);
	const [showSchedule, setShowSchedule] = useState(false);
	const [status, setStatus] = useState('');

	useEffect(() => {
		if (!user) router.replace('/tiktok');
	}, [router, user]);

	if (!user) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#020617] px-5 text-white" role="status">
				<p className="text-sm text-white/70">Loading TikTok dashboard…</p>
			</main>
		);
	}

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
							Video details
						</h1>
						<p className="mt-2 text-sm text-white/55">Prepare a video upload or schedule it for later.</p>
					</div>

					<form
						className="space-y-7 rounded-[28px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.035))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
						onSubmit={(event) => event.preventDefault()}
					>
						<div>
							<label htmlFor="caption" className="mb-2 block text-sm font-medium text-white/85">
								Video caption
							</label>
							<textarea
								id="caption"
								name="caption"
								rows={5}
								maxLength={2200}
								placeholder="Write a caption for your video"
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
								defaultValue="public"
								className="w-full rounded-2xl border border-white/15 bg-[#11172a] px-4 py-3 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
							>
								<option value="public">Public</option>
								<option value="private">Private</option>
							</select>
						</div>

						<fieldset>
							<legend className="mb-3 text-sm font-medium text-white/85">Interaction permissions</legend>
							<div className="grid gap-3 sm:grid-cols-3">
								{permissionOptions.map((option) => (
									<label
										key={option.id}
										className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/[0.07]"
									>
										<input
											type="checkbox"
											name={option.id}
											defaultChecked
											className="h-4 w-4 accent-[#606bfa]"
										/>
										{option.label}
									</label>
								))}
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
									className="w-full rounded-xl border border-white/15 bg-[#11172a] px-4 py-3 text-white [color-scheme:dark] outline-none focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
								/>
							</div>
						)}

						<div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={() => {
									setShowSchedule(true);
									setStatus('Choose a date and time to schedule this video.');
								}}
								className="min-h-12 rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
							>
								Schedule
							</button>
							<button
								type="button"
								onClick={() => setStatus('TikTok upload integration is not connected yet.')}
								className="min-h-12 rounded-xl bg-[#606bfa] px-7 py-3 font-semibold text-white transition hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
							>
								Upload
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
