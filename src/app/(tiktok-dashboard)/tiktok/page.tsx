import { TikTokLoginButton } from '@/components/tiktok-dashboard/TikTokLoginButton';

export default function TikTokLoginPage() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-5 py-12">
			<div className="pointer-events-none absolute h-80 w-80 rounded-full bg-[#606bfa]/20 blur-[110px]" />
			<div className="relative flex w-full justify-center">
				<TikTokLoginButton />
			</div>
		</main>
	);
}
