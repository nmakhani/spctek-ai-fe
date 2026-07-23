import Image from 'next/image';

import { TikTokLoginButton } from '@/components/tiktok-dashboard/TikTokLoginButton';

export default function TikTokLoginPage() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-5 py-12">
			<div className="pointer-events-none absolute -left-28 top-[-8rem] h-80 w-80 rounded-full bg-[#606bfa]/25 blur-[110px]" />
			<div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

			<div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
				<div className="mb-8 flex items-center gap-3">
					<Image
						src="/favicon.png"
						alt="SPCTEK"
						width={48}
						height={48}
						priority
						className="rounded-xl shadow-lg shadow-[#606bfa]/20"
					/>
					<span className="text-lg font-bold tracking-[0.18em] text-white">SPCTEK</span>
				</div>

				<div className="space-y-4">
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#aeb3ff]">TikTok integration</p>
					<h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Connect TikTok</h1>
					<p className="max-w-sm text-base leading-7 text-slate-300">
						Connect your TikTok account to schedule, upload, and publish videos straight from your dashboard
					</p>
				</div>

				<div className="mt-8">
					<TikTokLoginButton />
				</div>
				<p className="mt-5 text-center text-xs leading-5 text-slate-400">
						You&apos;ll securely continue to TikTok to authorize your account.
				</p>
			</div>
		</main>
	);
}
