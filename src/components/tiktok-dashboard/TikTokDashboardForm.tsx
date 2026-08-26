'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { fetchCreatorInfo, type CreatorInfo } from '@/lib/tiktok-dashboard/creator-info';
import { clearTikTokUser, getTikTokUser, type TikTokUser } from '@/lib/tiktok-dashboard/user';

const permissionOptions = [
	{ id: 'comments', label: 'Allow comments' },
	{ id: 'duet', label: 'Allow duets' },
	{ id: 'stitches', label: 'Allow stitches' },
] as const;

const privacyLevelLabels: Record<string, string> = {
	PUBLIC_TO_EVERYONE: 'Public',
	MUTUAL_FOLLOW_FRIENDS: 'Friends',
	FOLLOWER_OF_CREATOR: 'Followers',
	SELF_ONLY: 'Only me',
};

type PermissionId = (typeof permissionOptions)[number]['id'];
type PermissionCheckedState = Record<PermissionId, boolean>;

const POST_TO_TIKTOK_WEBHOOK = 'https://n8n.spctek.com/webhook/post-content-on-tiktok';

function getVideoDurationSeconds(file: File): Promise<number> {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video');
		video.preload = 'metadata';
		const url = URL.createObjectURL(file);

		video.onloadedmetadata = () => {
			URL.revokeObjectURL(url);
			resolve(video.duration);
		};
		video.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Could not read video duration.'));
		};
		video.src = url;
	});
}

function formatDuration(seconds: number) {
	const totalSeconds = Math.max(0, Math.floor(seconds));
	const minutes = Math.floor(totalSeconds / 60);
	const remainingSeconds = String(totalSeconds % 60).padStart(2, '0');

	return `${minutes}:${remainingSeconds}`;
}

export function TikTokDashboardForm() {
	const router = useRouter();
	const [user, setUser] = useState<TikTokUser | null | undefined>(undefined);
	const [creatorInfo, setCreatorInfo] = useState<CreatorInfo | null>(null);
	const [creatorInfoError, setCreatorInfoError] = useState('');
	const [isCreatorInfoLoading, setIsCreatorInfoLoading] = useState(false);
	const [creatorInfoRequestKey, setCreatorInfoRequestKey] = useState(0);
	const [showSchedule, setShowSchedule] = useState(false);
	const [status, setStatus] = useState('');
	const [formError, setFormError] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [videoDurationError, setVideoDurationError] = useState('');
	const [videoDurationWarning, setVideoDurationWarning] = useState('');
	const [isCheckingVideoDuration, setIsCheckingVideoDuration] = useState(false);
	const [selectedVisibility, setSelectedVisibility] = useState('');
	const [privacyAutoSwitchNotice, setPrivacyAutoSwitchNotice] = useState('');
	const [isContentDisclosureEnabled, setIsContentDisclosureEnabled] = useState(false);
	const [yourBrandChecked, setYourBrandChecked] = useState(false);
	const [brandedContentChecked, setBrandedContentChecked] = useState(false);
	const [contentDisclosureError, setContentDisclosureError] = useState('');
	const [isPostConsentConfirmed, setIsPostConsentConfirmed] = useState(false);
	const [permissionChecked, setPermissionChecked] = useState<PermissionCheckedState>({
		comments: false,
		duet: false,
		stitches: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const durationCheckIdRef = useRef(0);
	const previewUrlRef = useRef<string | null>(null);
	const isImage = selectedFile?.type.startsWith('image/') ?? false;
	const titleMaxLength = isImage ? 90 : 2200;
	const titleLabel = isImage ? 'Title' : 'Caption';
	const isContentDisclosureMissing = isContentDisclosureEnabled && !yourBrandChecked && !brandedContentChecked;

	const resetPostFormState = (formElement?: HTMLFormElement | null) => {
		if (formElement && typeof formElement.reset === 'function') {
			formElement.reset();
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
			previewUrlRef.current = null;
		}

		setTitle('');
		setDescription('');
		setSelectedFile(null);
		setSelectedFilePreviewUrl('');
		setSelectedVisibility('');
		setPermissionChecked({ comments: false, duet: false, stitches: false });
		setIsContentDisclosureEnabled(false);
		setYourBrandChecked(false);
		setBrandedContentChecked(false);
		setIsPostConsentConfirmed(false);
		setShowSchedule(false);
		setVideoDurationError('');
		setVideoDurationWarning('');
		setIsCheckingVideoDuration(false);
		setContentDisclosureError('');
		setPrivacyAutoSwitchNotice('');
		setFormError('');
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;
		const durationCheckId = durationCheckIdRef.current + 1;
		durationCheckIdRef.current = durationCheckId;
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
			previewUrlRef.current = null;
		}
		if (file) {
			const nextPreviewUrl = URL.createObjectURL(file);
			previewUrlRef.current = nextPreviewUrl;
			setSelectedFilePreviewUrl(nextPreviewUrl);
		} else {
			setSelectedFilePreviewUrl('');
		}
		setSelectedFile(file);
		setVideoDurationError('');
		setVideoDurationWarning('');
		setIsCheckingVideoDuration(false);

		const maxVideoPostDurationSec = creatorInfo?.maxVideoPostDurationSec;
		if (!file || !file.type.startsWith('video/') || maxVideoPostDurationSec === undefined) return;

		setIsCheckingVideoDuration(true);
		void getVideoDurationSeconds(file)
			.then((duration) => {
				if (durationCheckId !== durationCheckIdRef.current) return;

				if (duration > maxVideoPostDurationSec) {
					setVideoDurationError(
						`This video is ${formatDuration(duration)} long — your account's limit is ${formatDuration(maxVideoPostDurationSec)}. Choose a shorter video.`
					);
				} else {
					setVideoDurationError('');
				}
			})
			.catch(() => {
				if (durationCheckId !== durationCheckIdRef.current) return;
				setVideoDurationWarning(
					`Couldn't verify video length — TikTok will reject it if it's over ${formatDuration(maxVideoPostDurationSec)}.`
				);
			})
			.finally(() => {
				if (durationCheckId === durationCheckIdRef.current) setIsCheckingVideoDuration(false);
			});
	};

	useEffect(() => {
		return () => {
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
				previewUrlRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		const syncUser = () => setUser(getTikTokUser());

		syncUser();
		window.addEventListener('storage', syncUser);
		return () => window.removeEventListener('storage', syncUser);
	}, []);

	useEffect(() => {
		if (user === null) router.replace('/tiktok');
	}, [router, user]);

	useEffect(() => {
		if (!user?.state) return;

		let isCancelled = false;
		setCreatorInfo(null);
		setCreatorInfoError('');
		setIsCreatorInfoLoading(true);

		fetchCreatorInfo(user.state)
			.then((info) => {
				if (!isCancelled) setCreatorInfo(info);
			})
			.catch((error: unknown) => {
				if (!isCancelled) {
					setCreatorInfoError(error instanceof Error ? error.message : 'Unable to load TikTok creator information.');
				}
			})
			.finally(() => {
				if (!isCancelled) setIsCreatorInfoLoading(false);
			});

		return () => {
			isCancelled = true;
		};
	}, [creatorInfoRequestKey, user?.state]);

	useEffect(() => {
		if (!creatorInfo) return;

		setPermissionChecked((checked) => ({
			...checked,
			comments: creatorInfo.commentDisabled ? false : checked.comments,
			duet: creatorInfo.duetDisabled || isImage ? false : checked.duet,
			stitches: creatorInfo.stitchDisabled || isImage ? false : checked.stitches,
		}));
	}, [creatorInfo, isImage]);

	useEffect(() => {
		if (!creatorInfo || !brandedContentChecked || selectedVisibility !== 'SELF_ONLY') return;

		const fallbackVisibility = creatorInfo.privacyLevelOptions.find((option) => option !== 'SELF_ONLY') ?? '';
		if (fallbackVisibility === selectedVisibility) return;

		setSelectedVisibility(fallbackVisibility);
		setPrivacyAutoSwitchNotice('Visibility changed - branded content can\'t be set to Only me.');
		setFormError('');
	}, [brandedContentChecked, creatorInfo, selectedVisibility]);

	if (user === undefined || user === null || isCreatorInfoLoading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#020617] px-5 text-white" role="status">
				<p className="text-sm text-white/70">Loading TikTok dashboard…</p>
			</main>
		);
	}

	if (creatorInfoError || !creatorInfo) {
		return (
			<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#020617] px-5 text-center text-white">
				<p className="text-sm text-white/70" role="alert">
					{creatorInfoError || 'TikTok creator information is unavailable.'}
				</p>
				<button
					type="button"
					onClick={() => setCreatorInfoRequestKey((requestKey) => requestKey + 1)}
					className="rounded-xl bg-[#606bfa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f79ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
				>
					Retry
				</button>
			</main>
		);
	}

	const canPost = creatorInfo.privacyLevelOptions.length > 0;
	if (!canPost) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#020617] px-5 text-center text-white">
				<section className="w-full max-w-md rounded-[28px] border border-amber-300/20 bg-amber-300/[0.06] p-8 shadow-2xl shadow-black/30">
					<div
						className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/30 bg-amber-300/10 text-xl font-bold text-amber-200"
						aria-hidden="true"
					>
						!
					</div>
					<h1 className="mt-5 text-xl font-semibold">Posting is temporarily unavailable</h1>
					<p className="mt-3 text-sm leading-6 text-white/70">
						This TikTok account can&apos;t post right now. This is usually temporary — try again in a little while.
					</p>
					<button
						type="button"
						onClick={() => setCreatorInfoRequestKey((requestKey) => requestKey + 1)}
						className="mt-6 rounded-xl bg-[#606bfa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f79ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
					>
						Check again
					</button>
				</section>
			</main>
		);
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setStatus('');
		setFormError('');

		const formData = new FormData(event.currentTarget);
		const visibility = selectedVisibility;
		const submittedTitle = formData.get('title');
		const submittedDescription = formData.get('description');

		if (typeof visibility !== 'string' || !creatorInfo.privacyLevelOptions.includes(visibility)) {
			setFormError(
				'[INVALID OPTION SELECTED]: Your account does not support this visibility option. Please select a different one.'
			);
			return;
		}

		if (!selectedFile) {
			setFormError('Please choose an image or video file before submitting.');
			fileInputRef.current?.focus();
			return;
		}

		const scheduleAtValue = typeof formData.get('scheduleAt') === 'string' ? formData.get('scheduleAt') : '';
		if (showSchedule && scheduleAtValue) {
			const scheduleDate = new Date(scheduleAtValue);
			if (Number.isNaN(scheduleDate.getTime()) || scheduleDate.getTime() <= Date.now()) {
				setFormError('Please choose a future date and time for the scheduled post.');
				return;
			}
		}

		if (videoDurationError) {
			setFormError(videoDurationError);
			return;
		}

		if (typeof submittedTitle !== 'string' || submittedTitle.trim().length === 0) {
			setFormError('Please enter a title before submitting.');
			return;
		}

		if (isContentDisclosureEnabled && !yourBrandChecked && !brandedContentChecked) {
			setContentDisclosureError('Select Your Brand, Branded Content, or both before posting.');
			return;
		}

		if (brandedContentChecked && visibility === 'SELF_ONLY') {
			setFormError('Branded content must be visible to more than just you.');
			return;
		}

		setIsSubmitting(true);
		setStatus('Submitting your media…');

		try {
			if (!formData.get('scheduleAt')) formData.delete('scheduleAt');
			formData.delete('visibility');
			formData.append('visibility', visibility);
			formData.delete('title');
			formData.append('title', submittedTitle);
			formData.delete('description');
			if (isImage) formData.append('description', typeof submittedDescription === 'string' ? submittedDescription : '');
			formData.set('comments', String(permissionChecked.comments));
			formData.set('duet', String(permissionChecked.duet));
			formData.set('stitches', String(permissionChecked.stitches));
			formData.set('brandOrganicToggle', String(isContentDisclosureEnabled && yourBrandChecked));
			formData.set('brandContentToggle', String(isContentDisclosureEnabled && brandedContentChecked));
			formData.set('media', selectedFile, selectedFile.name);
			formData.set('state', user.state);

			const response = await fetch(POST_TO_TIKTOK_WEBHOOK, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Submission failed (${response.status}).`);
			}

			setStatus('');
			toast.success(
				'Your content has been submitted. TikTok can take a few minutes to finish processing before it appears on your account.',
				{ duration: 6000 }
			);
			resetPostFormState(event.currentTarget);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unable to submit your media. Please try again.';
			setStatus(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#020617] px-5 py-6 text-white sm:px-8 lg:px-12">
			<div className="pointer-events-none fixed left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#606bfa]/15 blur-[140px]" />

			<div className="relative mx-auto max-w-5xl">
				<header className="flex justify-end">
					<div className="flex items-center gap-3" aria-label={`Logged in as ${creatorInfo.username}`}>
						<span className="hidden text-sm font-medium text-white/80 sm:inline">{creatorInfo.nickname}</span>
						<Link
							href={`/tiktok/posts?state=${encodeURIComponent(user.state)}`}
							className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
						>
							My Posts
						</Link>
						<span
							role="img"
							aria-label={`${creatorInfo.nickname}'s profile picture`}
							className="h-11 w-11 rounded-full border border-white/20 bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: `url(${creatorInfo.avatarUrl})` }}
						/>
						<button
							type="button"
							onClick={() => {
								clearTikTokUser();
								setUser(null);
								router.replace('/tiktok');
							}}
							className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc]"
						>
							Log out
						</button>
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
								onChange={handleFileChange}
								className="block w-full cursor-pointer rounded-2xl border border-dashed border-white/25 bg-white/[0.04] px-4 py-5 text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#606bfa] file:px-4 file:py-2 file:font-semibold file:text-white hover:border-[#8c96ff] focus:outline-none focus:ring-2 focus:ring-[#606bfa]/40"
							/>
							{selectedFile && selectedFilePreviewUrl && (
								<div className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-[#0d1324] p-2">
									{isImage ? (
										<img
											src={selectedFilePreviewUrl}
											alt="Selected image preview."
											className="mx-auto max-h-64 w-auto rounded-xl object-contain"
										/>
									) : (
										<video
											src={selectedFilePreviewUrl}
											controls
											className="mx-auto max-h-64 w-full rounded-xl object-contain"
											preload="metadata"
										/>
									)}
								</div>
							)}
							<p className="mt-2 text-xs text-white/45">
								{selectedFile ? `${selectedFile.name} selected` : 'Choose an image or video you want to post.'}
							</p>
							{videoDurationError && (
								<p className="mt-2 text-sm font-medium text-red-300" role="alert">
									{videoDurationError}
								</p>
							)}
							{videoDurationWarning && <p className="mt-2 text-sm text-amber-200">{videoDurationWarning}</p>}
						</div>

						<div>
							<label htmlFor="title" className="mb-2 block text-sm font-medium text-white/85">
								{titleLabel}
							</label>
							<textarea
								id="title"
								name="title"
								rows={isImage ? 2 : 5}
								maxLength={titleMaxLength}
								required
								value={title}
								onChange={(event) => {
									setTitle(event.target.value);
									setFormError('');
								}}
								placeholder={isImage ? 'Write a title for your photo' : 'Write a caption for your video'}
								className="w-full resize-y rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
							/>
							<p className="mt-2 text-xs text-white/45">
								{title.length}/{titleMaxLength} characters
							</p>
						</div>

						{isImage && (
							<div>
								<label htmlFor="description" className="mb-2 block text-sm font-medium text-white/85">
									Description (hashtags, mentions, etc.)
								</label>
								<textarea
									id="description"
									name="description"
									rows={5}
									maxLength={4000}
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder="Add hashtags, mentions, or more details"
									className="w-full resize-y rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
								/>
								<p className="mt-2 text-xs text-white/45">{description.length}/4000 characters</p>
							</div>
						)}

						<div>
							<div className="mb-2 flex items-center gap-2">
								<label htmlFor="visibility" className="text-sm font-medium text-white/85">
									Who can view
								</label>
								{brandedContentChecked && (
									<span
										className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-xs text-white/65"
										title="Branded content must be visible to more than just you."
										aria-label="Branded content must be visible to more than just you."
									>
										i
									</span>
								)}
							</div>
							<select
								id="visibility"
								name="visibility"
								value={selectedVisibility}
								required
								onChange={(event) => {
									setSelectedVisibility(event.target.value);
									setFormError('');
									setPrivacyAutoSwitchNotice('');
								}}
								aria-describedby={formError ? 'visibility-error' : undefined}
								className="w-full rounded-2xl border border-white/15 bg-[#11172a] px-4 py-3 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/40"
							>
								<option value="" disabled>
									Select visibility
								</option>
								{creatorInfo.privacyLevelOptions.map((privacyLevel) => (
									<option key={privacyLevel} value={privacyLevel} disabled={brandedContentChecked && privacyLevel === 'SELF_ONLY'}>
										{privacyLevelLabels[privacyLevel] ?? privacyLevel}
									</option>
								))}
							</select>
							{privacyAutoSwitchNotice && <p className="mt-2 text-sm font-medium text-amber-200">{privacyAutoSwitchNotice}</p>}
						</div>

						{formError && (
							<p id="visibility-error" className="rounded-xl border px-4 py-3 text-sm font-semibold" role="alert">
								{formError}
							</p>
						)}

						<fieldset>
							<legend className="mb-3 text-sm font-medium text-white/85">Interaction permissions</legend>
							<div className="grid gap-3 sm:grid-cols-3">
								{permissionOptions.map((option) => {
									const isVideoOnly = option.id === 'duet' || option.id === 'stitches';
									const isDisabledByMedia = isVideoOnly && isImage;
									const isDisabledByAccount =
										(option.id === 'comments' && creatorInfo.commentDisabled) ||
										(option.id === 'duet' && creatorInfo.duetDisabled) ||
										(option.id === 'stitches' && creatorInfo.stitchDisabled);
									const isDisabled = isDisabledByMedia || isDisabledByAccount;

									return (
										<label
											key={option.id}
											className={`flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
												isDisabled
													? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-white/35'
													: 'cursor-pointer border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.07]'
											}`}
										>
											<input
												type="checkbox"
												name={option.id}
												checked={permissionChecked[option.id]}
												onChange={(event) =>
													setPermissionChecked((checked) => ({
														...checked,
														[option.id]: event.target.checked,
													}))
												}
												disabled={isDisabled}
												className="mt-0.5 h-4 w-4 shrink-0 accent-[#606bfa] disabled:cursor-not-allowed"
											/>
										<div className="flex min-w-0 items-center gap-2">
											<span className="block">{option.label}</span>
											{isDisabledByAccount && (
												<span
													className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 text-xs text-white/65"
													title="Disabled by your TikTok account settings"
													aria-label="Disabled by your TikTok account settings"
												>
													i
												</span>
											)}
										</div>
										</label>
									);
								})}
							</div>
						</fieldset>

						<section className="space-y-4" aria-labelledby="content-disclosure-title">
							<div>
								<h2 id="content-disclosure-title" className="text-lg font-medium text-white/85">
									Content Disclosure
								</h2>
								<div className="mt-3 flex items-center justify-between gap-4 text-sm text-white/75">
									<span>This content promotes a brand, product, or service.</span>
									<button
										type="button"
										aria-pressed={isContentDisclosureEnabled}
										aria-label="Toggle content disclosure"
										title="You need to indicate if your content promotes yourself, a third party, or both."
										onClick={() => {
											const enabled = !isContentDisclosureEnabled;
											setIsContentDisclosureEnabled(enabled);
											setContentDisclosureError('');
											if (!enabled) {
												setYourBrandChecked(false);
												setBrandedContentChecked(false);
												setPrivacyAutoSwitchNotice('');
											}
										}}
										className={`relative flex h-8 w-16 shrink-0 items-center rounded-full border p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc] ${
											isContentDisclosureEnabled
												? 'border-[#8c96ff] bg-[#606bfa]'
												: 'border-white/20 bg-white/10'
										}`}
									>
										<span
											aria-hidden="true"
											className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
												isContentDisclosureEnabled ? 'translate-x-8' : 'translate-x-0'
											}`}
										/>
									</button>
								</div>
							</div>

							{isContentDisclosureEnabled && (
								<div className="grid grid-cols-1 gap-3">
									<label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
										<input
											type="checkbox"
											checked={yourBrandChecked}
											onChange={(event) => {
												setYourBrandChecked(event.target.checked);
												setContentDisclosureError('');
											}}
											className="mt-0.5 h-4 w-4 shrink-0 accent-[#606bfa]"
										/>
										<span>
											<span className="block font-medium text-white/85">Your Brand</span>
											<span className="mt-1 block text-xs leading-4 text-white/50">
												You are promoting yourself or your own business.
											</span>
										</span>
									</label>
									<label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
										<input
											type="checkbox"
											checked={brandedContentChecked}
											onChange={(event) => {
												setBrandedContentChecked(event.target.checked);
												setContentDisclosureError('');
												if (!event.target.checked) setPrivacyAutoSwitchNotice('');
											}}
											className="mt-0.5 h-4 w-4 shrink-0 accent-[#606bfa]"
										/>
										<span>
											<span className="block font-medium text-white/85">Branded Content</span>
											<span className="mt-1 block text-xs leading-4 text-white/50">
												You have a paid partnership with a brand.
											</span>
										</span>
									</label>
								</div>
							)}

							{(contentDisclosureError || isContentDisclosureMissing) && (
								<p className="text-sm font-medium text-red-300" role="alert">
									{contentDisclosureError || 'Select Your Brand, Branded Content, or both before posting.'}
								</p>
							)}

							{isContentDisclosureEnabled && (yourBrandChecked || brandedContentChecked) && (
								<p className="text-xs leading-5 text-white/65">
									{brandedContentChecked ? (
										<>
											Your content will be labeled as &apos;Paid partnership&apos; and must comply with
											 TikTok&apos;s{' '}
											<a
												href="https://www.tiktok.com/legal/page/global/bc-policy/en"
												target="_blank"
												rel="noopener noreferrer"
												className="text-white underline underline-offset-2 transition hover:text-[#a0a6fc]"
											>
												Branded Content Policy
											</a>
											.
										</>
									) : (
										'Your content will be labeled as promotional content.'
									)}
								</p>
							)}
						</section>

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

						<p className="pt-1 text-xs leading-5 text-white/55 sm:text-right">
							By posting, you agree to TikTok&apos;s{' '}
							<a
								href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white underline underline-offset-2 transition hover:text-[#a0a6fc]"
							>
								Music Usage Confirmation
							</a>
						</p>

						<label className="flex w-full items-center justify-between gap-3 text-xs leading-5 text-white/55 sm:text-right">
							<span className="flex-1 text-right">I confirm this content is ready to post to TikTok.</span>
							<input
								type="checkbox"
								checked={isPostConsentConfirmed}
								onChange={(event) => setIsPostConsentConfirmed(event.target.checked)}
								className="h-4 w-4 shrink-0 accent-[#606bfa]"
							/>
						</label>

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
								disabled={
									isSubmitting ||
									isCheckingVideoDuration ||
									Boolean(videoDurationError) ||
									isContentDisclosureMissing ||
									!isPostConsentConfirmed
								}
								className="min-h-12 rounded-xl bg-[#606bfa] px-7 py-3 font-semibold text-white transition hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0a6fc] disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isSubmitting ? 'Submitting…' : 'Submit'}
							</button>
						</div>

						{status && (
							<p className="hidden" aria-live="polite">
								{status}
							</p>
						)}
					</form>
				</section>
			</div>
		</main>
	);
}
