'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { popupsApi } from '@/lib/api';
import { hasCooldownElapsed, markSeen, normalizePopupPath } from '@/lib/popupCooldown';
import { GlassGlow } from './GlassGlow';
import { GradientBorder } from './GradientBorder';

interface PopupContent {
	title: string;
	content: string;
	cta_text: string;
	cta_link: string;
}

interface PopupPayload {
	path: string;
	content: PopupContent;
	delay: number;
}

interface PagePopupProps {
	pagePath: string;
}

export function PagePopup({ pagePath }: PagePopupProps) {
	const [popup, setPopup] = useState<PopupPayload | null>(null);
	const [open, setOpen] = useState(false);

	const normalizedPath = useMemo(() => {
		return normalizePopupPath(pagePath);
	}, [pagePath]);

	useEffect(() => {
		let isMounted = true;
		let timerId: number | null = null;

		if (!hasCooldownElapsed(normalizedPath)) {
			return () => {
				isMounted = false;
			};
		}

		const loadPopup = async () => {
			try {
				const response = await popupsApi.getByPath(normalizedPath);
				const data = response.data as PopupPayload | null;

				if (!data) return;
				if (!isMounted) return;

				setPopup(data);
				timerId = window.setTimeout(
					() => {
						if (isMounted) {
							setOpen(true);
							markSeen(normalizedPath);
						}
					},
					Math.max(0, data.delay)
				);
			} catch {
				if (!isMounted) {
					return;
				}
				setPopup(null);
				setOpen(false);
			}
		};

		void loadPopup();

		return () => {
			isMounted = false;
			if (timerId !== null) {
				window.clearTimeout(timerId);
			}
		};
	}, [normalizedPath]);

	if (!open || !popup) {
		return null;
	}

	return (
		<div className="bg-black/78 fixed inset-0 z-[80] grid place-items-end p-3 backdrop-blur-sm sm:place-items-center sm:p-4">
			<div className="absolute inset-0" onClick={() => setOpen(false)} />

			<div className="relative z-10 my-2 w-full max-w-md">
				<GradientBorder thickness={1.5} radius="24px" subtle={true} />
				<GlassGlow angle={105} opacity={0.22} start={8} end={92} radius="24px" />

				<div className="border-white/12 relative z-10 rounded-3xl border bg-[linear-gradient(145deg,rgba(17,24,39,0.92)_0%,rgba(17,24,39,0.86)_46%,rgba(96,107,250,0.24)_100%)] p-5 shadow-[0_26px_70px_rgba(0,0,0,0.72)] sm:p-7 md:p-8">
					<div className="flex flex-col gap-6 sm:gap-5">
						<div className="space-y-4 text-center sm:space-y-6">
							<h2 className="text-3xl font-semibold leading-[1.08] text-white">{popup.content.title}</h2>
							<p className="mx-auto max-w-md text-sm leading-relaxed text-slate-200/90">{popup.content.content}</p>
						</div>

						<div className="space-y-3 sm:space-y-4">
							{popup.content.cta_link.startsWith('http') ? (
								<a
									href={popup.content.cta_link}
									onClick={() => setOpen(false)}
									className="flex h-[54px] w-full items-center justify-center rounded-[20px] bg-[#606bfa] px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.55)] md:h-[58px] md:text-base"
								>
									{popup.content.cta_text}
								</a>
							) : (
								<Link
									href={popup.content.cta_link}
									onClick={() => setOpen(false)}
									className="flex h-[54px] w-full items-center justify-center rounded-[20px] bg-[#606bfa] px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.55)] md:h-[58px] md:text-base"
								>
									{popup.content.cta_text}
								</Link>
							)}

							<button
								type="button"
								onClick={() => setOpen(false)}
								className="w-full rounded-[20px] border border-white/15 bg-white/[0.06] px-8 py-3.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.12]"
							>
								Not now
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
