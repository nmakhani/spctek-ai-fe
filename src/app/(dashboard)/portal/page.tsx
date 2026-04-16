'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, MessageSquare, FileText } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function DashboardContent() {
	const router = useRouter();
	const { user, logout } = useAuth();

	const handleLogout = () => {
		logout();
		router.push('/portal/login');
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] px-6 pb-12 pt-10">
			<header className="sticky top-0 z-20 -mx-6 border-b border-white/10 bg-black/35 px-6 backdrop-blur-md">
				<div className="mx-auto max-w-7xl">
					<div className="mx-auto h-[2px] w-full max-w-5xl bg-[linear-gradient(90deg,rgba(96,107,250,0.08)_0%,rgba(96,107,250,0.9)_50%,rgba(96,107,250,0.08)_100%)] shadow-[0_0_16px_rgba(96,107,250,0.4)]" />

					<div className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_45%,rgba(96,107,250,0.12)_100%)] p-8 shadow-[0_28px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl md:p-10">
						<div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#606bfa]/20 blur-3xl" />

						<div className="relative flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
							<div>
								<p className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#9aa4ff]">
									SPCTEK Control Room
								</p>
								<h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
									Portal <span className="text-[#606bfa]">Dashboard</span>
								</h1>
								<p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
									Manage contacts and blogs from one focused workspace with the same visual language as your homepage.
								</p>
							</div>

							<div className="w-full rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl md:w-auto md:min-w-[320px]">
								<Link
									href="/"
									className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#9aa4ff] transition-colors hover:text-white"
								>
									<span className="text-base">←</span> Back to Website
								</Link>

								<div className="border-t border-white/10 pt-4">
									<span className="text-sm text-white/70">Logged in as </span>
									<span className="font-medium text-[#a9b2ff]">{user?.username || 'User'}</span>
									<a
										href={`mailto:${user?.email}`}
										className="mt-1 block cursor-pointer break-all transition hover:text-[#d0d7ff]"
									>
										<p className="text-xs text-white/40">{user?.email}</p>
									</a>
								</div>

								<button
									onClick={handleLogout}
									className="border-red-300/30 bg-red-400/15 text-red-200 hover:bg-red-400/25 mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
								>
									Logout
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto mt-8 max-w-7xl">
				<div className="grid grid-cols-1 gap-7 md:grid-cols-3">
					<Link href="/portal/contacts" className="group">
						<div className="relative h-full overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_42%,rgba(96,107,250,0.12)_100%)] p-8 shadow-[0_20px_45px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7c87ff]/60 hover:shadow-[0_26px_50px_rgba(0,0,0,0.65)]">
							<div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#606bfa]/20 blur-3xl" />
							<div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8993ff]/35 bg-[#606bfa]/20 text-white">
								<MessageSquare size={24} />
							</div>
							<h2 className="mb-2 text-2xl font-semibold text-white">Contacts</h2>
							<p className="text-white/75">
								Review incoming inquiries, edit details, and keep communication records organized.
							</p>
							<div className="mt-7 inline-flex items-center gap-2 font-medium text-[#a9b2ff]">
								Open Contacts
								<span className="transition-transform group-hover:translate-x-1">→</span>
							</div>
						</div>
					</Link>

					<Link href="/portal/blogs" className="group">
						<div className="relative h-full overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_42%,rgba(96,107,250,0.12)_100%)] p-8 shadow-[0_20px_45px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7c87ff]/60 hover:shadow-[0_26px_50px_rgba(0,0,0,0.65)]">
							<div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#606bfa]/20 blur-3xl" />
							<div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8993ff]/35 bg-[#606bfa]/20 text-white">
								<BookOpen size={24} />
							</div>
							<h2 className="mb-2 text-2xl font-semibold text-white">Blogs</h2>
							<p className="text-white/75">
								Publish polished articles with full schema controls including slug, summary, and publication status.
							</p>
							<div className="mt-7 inline-flex items-center gap-2 font-medium text-[#a9b2ff]">
								Open Blogs
								<span className="transition-transform group-hover:translate-x-1">→</span>
							</div>
						</div>
					</Link>

					<Link href="/portal/reinstatement-logs" className="group">
						<div className="relative h-full overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_42%,rgba(96,107,250,0.12)_100%)] p-8 shadow-[0_20px_45px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7c87ff]/60 hover:shadow-[0_26px_50px_rgba(0,0,0,0.65)]">
							<div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#606bfa]/20 blur-3xl" />
							<div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8993ff]/35 bg-[#606bfa]/20 text-white">
								<FileText size={24} />
							</div>
							<h2 className="mb-2 text-2xl font-semibold text-white">Reinstatement Logs</h2>
							<p className="text-white/75">
								Track Amazon reinstatement assessments by contact and regenerate reports as needed.
							</p>
							<div className="mt-7 inline-flex items-center gap-2 font-medium text-[#a9b2ff]">
								Open Logs
								<span className="transition-transform group-hover:translate-x-1">→</span>
							</div>
						</div>
					</Link>
				</div>
			</main>
		</div>
	);
}

export default function Home() {
	return (
		<ProtectedRoute>
			<DashboardContent />
		</ProtectedRoute>
	);
}
