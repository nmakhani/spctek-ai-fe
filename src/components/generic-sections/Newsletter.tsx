'use client';

import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { contactsApi } from '@/lib/api';
import { GlassGlow } from '../ui/GlassGlow';
import { GradientBorder } from '../ui/GradientBorder';
import { PrimaryButton } from '../ui/PrimaryButton';

interface NewsletterProps {
	onClose?: () => void;
	compact?: boolean;
}

export default function Newsletter({ onClose, compact = false }: NewsletterProps) {
	const [email, setEmail] = useState('');
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const validateEmail = (email: string) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsError(false);

		if (!email) {
			toast.error('Email is required');
			setIsError(true);
			return;
		}

		if (!validateEmail(email)) {
			toast.error('Please enter a valid email address');
			setIsError(true);
			return;
		}

		try {
			setIsLoading(true);
			await contactsApi.create({
				email: email,
				source: 'newsletter-subscription',
			});
			toast.success("Thank you! We'll be in touch soon.");
			setEmail('');
			onClose?.();
		} catch {
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`relative z-10 my-2 w-full ${compact ? 'max-w-sm' : 'max-w-md'}`}>
			<GradientBorder thickness={1.5} radius="24px" subtle={true} />
			<GlassGlow angle={105} opacity={0.18} start={8} end={92} radius="24px" />

			<div className="border-white/12 relative z-10 rounded-3xl border bg-[linear-gradient(145deg,rgba(17,24,39,0.94)_0%,rgba(17,24,39,0.88)_48%,rgba(96,107,250,0.22)_100%)] p-4 shadow-[0_26px_70px_rgba(0,0,0,0.72)] sm:p-7 md:p-8">
				<div className={`flex flex-col gap-6 sm:gap-5 ${compact ? 'py-2' : ''}`}>
					<div className={`space-y-4 text-center ${compact ? 'sm:space-y-2' : 'sm:space-y-6'}`}>
						<p className={`text-sm font-medium text-slate-300 ${compact ? 'sm:text-sm' : 'sm:text-base'}`}>
							Weekly Newsletter
						</p>
						<h2 className={`${compact ? 'text-xl' : 'text-3xl'} font-semibold leading-[1.08] text-white`}>
							Scale Without Operational Chaos
						</h2>
						<p
							className={`mx-auto ${compact ? 'max-w-xs text-sm' : 'max-w-md text-sm'} leading-relaxed text-slate-200/90`}
						>
							Get weekly actionable insights and AI updates to improve operations and grow with better systems.
						</p>
					</div>

					<form className={`space-y-2.5 ${compact ? '' : 'sm:space-y-4'}`} onSubmit={handleSubmit}>
						<div className={`group relative w-full transition-all duration-300 ${isError ? 'scale-[1.01]' : ''}`}>
							<GradientBorder thickness={1.5} radius="12px" hasError={isError} />
							<GlassGlow angle={105} opacity={0.5} start={10} end={90} radius="12px" />

							<div className="relative z-10 px-5 py-3 sm:px-6 sm:py-3.5">
								<input
									type="email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										if (isError) setIsError(false);
									}}
									placeholder="your@email.com"
									className={`glow-input w-full border-none bg-transparent text-center outline-none transition-colors placeholder:text-slate-500 ${
										compact
											? 'text-sm placeholder:text-sm'
											: 'text-base placeholder:text-base sm:text-lg sm:placeholder:text-lg md:text-[1.1rem]'
									} `}
								/>
							</div>
						</div>

						<PrimaryButton type="submit" disabled={isLoading} config={{ width: '100%', marginTop: '0' }}>
							{isLoading ? 'Subscribing...' : 'Subscribe Free'}
						</PrimaryButton>
					</form>

					<div className="text-center text-sm leading-snug text-slate-300/70">
						<p>2,400+ operators subscribed</p>
						<p>Unsubscribe anytime</p>
					</div>
				</div>
			</div>
		</div>
	);
}
