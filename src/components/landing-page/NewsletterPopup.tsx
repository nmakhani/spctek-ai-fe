'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { hasCooldownElapsed, markSeen, normalizePopupPath } from '@/lib/popupCooldown';

const Newsletter = dynamic(() => import('@/components/generic-sections/Newsletter'), {
	ssr: false,
});

const NEWSLETTER_SCOPE = normalizePopupPath('/');

export function NewsletterPopup() {
	const [showNewsletterModal, setShowNewsletterModal] = useState(false);

	useEffect(() => {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';

		if (!hasCooldownElapsed(NEWSLETTER_SCOPE)) return;

		const timer = window.setTimeout(() => {
			setShowNewsletterModal(true);
			markSeen(NEWSLETTER_SCOPE);
		}, 5000);

		return () => window.clearTimeout(timer);
	}, []);

	if (!showNewsletterModal) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-[70] grid place-items-end bg-black/70 p-3 backdrop-blur-sm sm:place-items-center sm:p-4"
			onClick={() => setShowNewsletterModal(false)}
		>
			<button
				type="button"
				onClick={() => setShowNewsletterModal(false)}
				className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20 sm:right-5 sm:top-5"
			>
				Close
			</button>
			<div
				className="max-h-[90vh] w-full max-w-md overflow-y-auto overscroll-contain"
				onClick={(e) => e.stopPropagation()}
			>
				<Newsletter onClose={() => setShowNewsletterModal(false)} />
			</div>
		</div>
	);
}
