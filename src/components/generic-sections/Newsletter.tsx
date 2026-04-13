import { useState } from 'react';

import toast from 'react-hot-toast';

import { contactsApi } from '@/lib/api';

import { GlassGlow } from '../ui/GlassGlow';
import { PrimaryButton } from '../ui/PrimaryButton';
import { GradientBorder } from '../ui/GradientBorder';

interface NewsletterProps {
	onClose?: () => void;
}

const ContactComponent = ({ onClose }: NewsletterProps) => {
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

	const handleSubmit = async () => {
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
		<div className="relative z-10 my-2 w-full max-w-sm sm:my-4">
			<GradientBorder thickness={2} radius="24px" />
			<GlassGlow angle={105} opacity={0.3} start={8} end={92} radius="24px" />

			<div className="relative z-10 rounded-3xl p-5 shadow-2xl backdrop-blur-sm sm:p-7 md:p-8">
				<div className="flex flex-col gap-6 sm:gap-5">
					<div className="space-y-4 text-center sm:space-y-6">
						<p className="text-sm font-medium text-slate-300 sm:text-base">Weekly Newsletter</p>
						<h2 className="text-[2.15rem] font-semibold leading-[1.08] text-white sm:text-4xl md:text-4xl">
							Scale Without
							<br />
							Operational Chaos
						</h2>
						<p className="mx-auto max-w-md text-base leading-relaxed text-slate-200/90 sm:text-lg md:text-lg">
							Get weekly actionable insights and AI updates to improve operations and grow with
							better systems.
						</p>
					</div>

					<div className="space-y-2.5 sm:space-y-4">
						<div
							className={`group relative w-full transition-all duration-300 ${isError ? 'scale-[1.01]' : ''}`}
						>
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
									className="glow-input w-full border-none bg-transparent text-center text-base outline-none transition-colors placeholder:text-slate-500 sm:text-lg md:text-[1.1rem]"
								/>
							</div>
						</div>

						<PrimaryButton
							onClick={handleSubmit}
							disabled={isLoading}
							config={{ width: '100%', marginTop: '0' }}
						>
							{isLoading ? 'Subscribing...' : 'Subscribe Free'}
						</PrimaryButton>
					</div>

					<div className="text-center text-sm leading-snug text-slate-300/70">
						<p>2,400+ operators subscribed</p>
						<p>Unsubscribe anytime</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactComponent;
