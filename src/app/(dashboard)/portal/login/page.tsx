'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const getErrorMessage = (err: unknown, fallback: string): string =>
		err instanceof Error ? err.message : fallback;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(email, password);
			toast.success('Logged in successfully!');
			router.push('/portal');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Login failed');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] px-6 py-12">
			<div className="mx-auto flex w-full max-w-5xl items-center justify-center">
				<div className="w-full max-w-md">
					<div className="mx-auto mb-8 h-[2px] w-full max-w-sm bg-[linear-gradient(90deg,rgba(96,107,250,0.08)_0%,rgba(96,107,250,0.9)_50%,rgba(96,107,250,0.08)_100%)] shadow-[0_0_14px_rgba(96,107,250,0.45)]" />

					<div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.14)_100%)] p-8 shadow-[0_26px_70px_rgba(0,0,0,0.62)] backdrop-blur-xl md:p-10">
						<div className="bg-[#606bfa]/22 pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full blur-3xl" />

						<div className="relative mb-9">
							<p className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#9aa4ff]">
								Secure Access
							</p>
							<h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-white">
								SPCTEK <span className="text-[#606bfa]">Portal</span>
							</h1>
							<p className="mt-2 text-white/70">Sign in to your admin account</p>
						</div>

						{error && (
							<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-xl border p-4 text-sm">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="email"
									className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-white/75"
								>
									Email
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-white outline-none transition placeholder:text-white/35 focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="admin@example.com"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-white/75"
								>
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-white outline-none transition placeholder:text-white/35 focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="••••••••"
									required
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="mt-4 w-full rounded-2xl bg-[#606bfa] px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
							>
								{loading ? 'Signing in...' : 'Sign In'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
