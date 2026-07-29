'use client';

import { useCallback, useEffect, useRef } from 'react';
import Script from 'next/script';

import { trackKlaviyoEvent } from '@/lib/klaviyoTracking';

const CALENDLY_INLINE_URL =
	'https://calendly.com/contact-spctek/30min?background_color=060b21&text_color=ffffff&primary_color=606b96';

interface CalendlyModalProps {
	isOpen: boolean;
	onClose: () => void;
	bookingContact?: CalendlyBookingContact | null;
}

export interface CalendlyBookingContact {
	email: string;
	name?: string;
	phone?: string;
	company?: string;
}

declare global {
	interface Window {
		Calendly?: {
			initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
		};
	}
}

export default function CalendlyModal({ isOpen, onClose, bookingContact }: CalendlyModalProps) {
	const calendlyRef = useRef<HTMLDivElement | null>(null);
	const trackedEventUrisRef = useRef(new Set<string>());

	const initCalendly = useCallback(() => {
		if (!isOpen || !calendlyRef.current || !window.Calendly) return;

		// Important: clears old iframe before re-initializing
		calendlyRef.current.innerHTML = '';

		const calendlyUrl = new URL(CALENDLY_INLINE_URL);
		if (bookingContact?.email) calendlyUrl.searchParams.set('email', bookingContact.email);
		if (bookingContact?.name) calendlyUrl.searchParams.set('name', bookingContact.name);

		window.Calendly.initInlineWidget({
			url: calendlyUrl.toString(),
			parentElement: calendlyRef.current,
		});
	}, [bookingContact, isOpen]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const timer = window.setTimeout(() => {
			initCalendly();
		}, 0);

		return () => {
			window.clearTimeout(timer);
		};
	}, [isOpen, initCalendly]);

	useEffect(() => {
		if (!isOpen) return;

		const handleCalendlyMessage = (event: MessageEvent<{ event?: string; payload?: { event?: { uri?: string } } }>) => {
			if (event.origin !== 'https://calendly.com' || event.data?.event !== 'calendly.event_scheduled') {
				return;
			}

			const eventUri = event.data.payload?.event?.uri;
			if (!eventUri) {
				return;
			}

			if (!bookingContact?.email) {
				return;
			}

			if (trackedEventUrisRef.current.has(eventUri)) {
				return;
			}

			trackedEventUrisRef.current.add(eventUri);

			trackKlaviyoEvent(
				'Meeting Booked',
				{
					booking_provider: 'Calendly',
					meeting_type: '30min',
					page: `${window.location.pathname}${window.location.search}`,
					calendly_event_uri: eventUri,
				},
				{
					profileSource: 'website_meeting_booking',
					profile: bookingContact,
				}
			);
		};

		window.addEventListener('message', handleCalendlyMessage);
		return () => window.removeEventListener('message', handleCalendlyMessage);
	}, [bookingContact, isOpen]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-2 backdrop-blur-md sm:p-4"
			onClick={onClose}
		>
			<div
				className="relative flex w-full max-w-[1150px] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(160deg,rgba(8,12,28,0.98)_0%,rgba(16,20,42,0.98)_45%,rgba(20,24,48,0.98)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.7)] sm:rounded-[28px]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa4ff]">Schedule a call</p>
						<h3 className="mt-1 text-lg font-semibold text-white sm:text-2xl">Book a 30 minute meeting</h3>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
						aria-label="Close booking modal"
					>
						Close
					</button>
				</div>

				<div className="h-[min(700px,78vh)] overflow-hidden px-0 pb-0">
					<div
						ref={calendlyRef}
						className="h-full w-full"
						style={{
							minWidth: '320px',
						}}
					/>
				</div>

				<Script
					src="https://assets.calendly.com/assets/external/widget.js"
					strategy="afterInteractive"
					onReady={initCalendly}
				/>
			</div>
		</div>
	);
}
