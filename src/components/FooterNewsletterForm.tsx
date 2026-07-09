'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { contactsApi } from '@/lib/api';
import { trackFormSubmitted } from '@/lib/klaviyoTracking';

const EMAIL_PATTERN =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function FooterNewsletterForm() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const handleSubscribe = async () => {
		setIsError(false);

		if (!email) {
			toast.error('Email is required');
			setIsError(true);
			return;
		}

		if (!EMAIL_PATTERN.test(email.toLowerCase())) {
			toast.error('Please enter a valid email address');
			setIsError(true);
			return;
		}

		try {
			setIsLoading(true);
			await contactsApi.create({
				email,
				source: 'footer-newsletter-subscription',
			});
			trackFormSubmitted({
				formName: 'Footer Newsletter Signup',
				source: 'footer-newsletter-subscription',
				fields: {
					email,
					source: 'footer-newsletter-subscription',
				},
				profile: {
					email,
				},
			});
			toast.success('Subscribed successfully. Welcome aboard.');
			setEmail('');
		} catch {
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<input
				type="email"
				value={email}
				onChange={(e) => {
					setEmail(e.target.value);
					if (isError) setIsError(false);
				}}
				placeholder="your@email.com"
				className={`font-poppins rounded-xl border bg-white/10 px-4 py-2.5 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-white/40 ${isError ? 'border-red-400/70' : 'border-white/15'}`}
			/>
			<button
				type="button"
				onClick={handleSubscribe}
				disabled={isLoading}
				className="font-poppins inline-flex w-fit items-center justify-center rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(124,134,255,0.98)_0%,rgba(96,107,250,0.98)_100%)] px-6 py-[10px] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(96,107,250,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(96,107,250,0.36),inset_0_1px_0_rgba(255,255,255,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
			>
				{isLoading ? 'Subscribing...' : 'Subscribe'}
			</button>
		</div>
	);
}
