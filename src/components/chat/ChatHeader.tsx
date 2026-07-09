'use client';

import { Bot, Maximize2, MessageSquareText, Minimize2, Plus, Sparkles, X } from 'lucide-react';

type ChatHeaderProps = {
	title: string;
	isSessionsView: boolean;
	isLoading: boolean;
	isFullPage: boolean;
	onOpenSessions: () => void;
	onNewChat: () => void;
	onToggleFullPage: () => void;
	onClose: () => void;
};

export default function ChatHeader({
	title,
	isSessionsView,
	isLoading,
	isFullPage,
	onOpenSessions,
	onNewChat,
	onToggleFullPage,
	onClose,
}: ChatHeaderProps) {
	return (
		<header className="relative border-b border-white/10 bg-[linear-gradient(135deg,rgba(96,107,250,0.34),rgba(255,255,255,0.07)_44%,rgba(7,10,24,0.72))] px-4 py-4">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_88%_24%,rgba(94,234,212,0.16),transparent_30%)]" />
			<div className="relative flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-[#606bfa] shadow-[0_0_26px_rgba(96,107,250,0.62)]">
						<Bot className="h-6 w-6" aria-hidden="true" />
					</div>
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<h2 className="truncate font-heading text-xl font-bold leading-none">AXON</h2>
							<Sparkles className="h-4 w-4 shrink-0 text-[#a0a6fc]" aria-hidden="true" />
						</div>
						<p className="mt-1 truncate text-xs font-medium text-white/62">{title}</p>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<button
						type="button"
						onClick={onOpenSessions}
						disabled={isSessionsView || isLoading}
						aria-label="Show AXON chat sessions"
						className="border-white/12 flex h-9 w-9 items-center justify-center rounded-full border bg-white/[0.06] text-white/75 transition hover:bg-[#606bfa]/25 hover:text-white disabled:cursor-default disabled:opacity-45"
					>
						<MessageSquareText className="h-4 w-4" aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={onNewChat}
						disabled={isLoading}
						aria-label="Start a new AXON chat"
						className="border-white/12 flex h-9 w-9 items-center justify-center rounded-full border bg-white/[0.06] text-white/75 transition hover:bg-[#606bfa]/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
					>
						<Plus className="h-4 w-4" aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={onToggleFullPage}
						aria-label={isFullPage ? 'Return AXON chat to compact view' : 'Open AXON chat in full page view'}
						className="border-white/12 flex h-9 w-9 items-center justify-center rounded-full border bg-white/[0.06] text-white/75 transition hover:bg-[#606bfa]/25 hover:text-white"
					>
						{isFullPage ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
					</button>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close AXON chat"
						className="border-white/12 flex h-9 w-9 items-center justify-center rounded-full border bg-white/[0.06] text-white/75 transition hover:bg-[#606bfa]/25 hover:text-white"
					>
						<X className="h-4 w-4" aria-hidden="true" />
					</button>
				</div>
			</div>
		</header>
	);
}
