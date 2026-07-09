'use client';

import { Clock3, MessageSquareText, Plus } from 'lucide-react';

import type { ChatSession } from './chatTypes';
import { formatSessionTime, getSessionPreview } from './chatStorage';

type ChatSessionListProps = {
	sessions: ChatSession[];
	activeSessionId: string;
	isLoading: boolean;
	onNewChat: () => void;
	onSelectSession: (session: ChatSession) => void;
};

export default function ChatSessionList({
	sessions,
	activeSessionId,
	isLoading,
	onNewChat,
	onSelectSession,
}: ChatSessionListProps) {
	return (
		<div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
			<button
				type="button"
				onClick={onNewChat}
				disabled={isLoading}
				className="mb-4 flex w-full items-center justify-between rounded-2xl border border-[#8c96ff]/45 bg-[#606bfa]/20 px-4 py-3 text-left transition hover:border-[#b8beff]/80 hover:bg-[#606bfa]/30 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<span>
					<span className="block text-sm font-semibold text-white">New chat</span>
					<span className="mt-0.5 block text-xs text-white/58">Start a fresh AXON session</span>
				</span>
				<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#606bfa] text-white shadow-[0_10px_24px_rgba(96,107,250,0.28)]">
					<Plus className="h-4 w-4" aria-hidden="true" />
				</span>
			</button>

			{sessions.length ? (
				<div className="space-y-2.5">
					{sessions.map((session) => {
						const isActive = session.id === activeSessionId;

						return (
							<button
								type="button"
								key={session.id}
								onClick={() => onSelectSession(session)}
								disabled={isLoading}
								className={`group w-full rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
									isActive
										? 'border-[#8c96ff]/65 bg-[#606bfa]/18 shadow-[0_0_24px_rgba(96,107,250,0.14)]'
										: 'border-white/10 bg-white/[0.055] hover:border-[#8c96ff]/50 hover:bg-white/[0.085]'
								}`}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-white">{session.title}</p>
										<p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/55">{getSessionPreview(session)}</p>
									</div>
								</div>
								<div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/38">
									<Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
									{formatSessionTime(session.updatedAt)}
								</div>
							</button>
						);
					})}
				</div>
			) : (
				<div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/14 bg-white/[0.035] px-6 text-center">
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8c96ff]/35 bg-[#606bfa]/18 text-[#dfe3ff]">
						<MessageSquareText className="h-5 w-5" aria-hidden="true" />
					</div>
					<p className="text-sm font-semibold text-white">No saved AXON sessions yet</p>
					<p className="mt-2 text-sm leading-relaxed text-white/55">
						Your five most recent sessions will appear here after AXON completes a reply.
					</p>
				</div>
			)}
		</div>
	);
}
