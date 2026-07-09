'use client';

import type { FormEvent, KeyboardEvent, RefObject } from 'react';
import { Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { starterPrompts } from './chatStorage';
import type { ChatMessage } from './chatTypes';

type ChatConversationProps = {
	messages: ChatMessage[];
	isLoading: boolean;
	error: string | null;
	input: string;
	userHasStarted: boolean;
	onInputChange: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
	onPromptClick: (prompt: string) => void;
	scrollRef: RefObject<HTMLDivElement | null>;
	inputRef: RefObject<HTMLTextAreaElement | null>;
};

export default function ChatConversation({
	messages,
	isLoading,
	error,
	input,
	userHasStarted,
	onInputChange,
	onSubmit,
	onKeyDown,
	onPromptClick,
	scrollRef,
	inputRef,
}: ChatConversationProps) {
	return (
		<>
			<div ref={scrollRef} className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
				{messages
					.filter((message) => message.role === 'user' || message.content.trim().length > 0 || !message.streaming)
					.map((message) => (
						<div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div
								className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
									message.role === 'user'
										? 'bg-[#606bfa] text-white shadow-[0_10px_28px_rgba(96,107,250,0.32)]'
										: 'text-white/86 border border-white/10 bg-white/[0.065]'
								}`}
							>
								{message.role === 'assistant' ? (
									<div className="chat-markdown">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											components={{
												p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
												ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
												ol: ({ children }) => (
													<ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
												),
												li: ({ children }) => <li className="pl-1">{children}</li>,
												a: ({ children, href }) => (
													<a
														href={href}
														target="_blank"
														rel="noreferrer"
														className="text-[#a0a6fc] underline decoration-white/20 underline-offset-2 transition hover:text-white"
													>
														{children}
													</a>
												),
												code: ({ children, className }) => {
													const isBlock = Boolean(className);
													return isBlock ? (
														<code className="block overflow-x-auto rounded-xl bg-black/40 px-3 py-2 font-mono text-[12px] text-[#d8dcff]">
															{children}
														</code>
													) : (
														<code className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-[12px] text-[#d8dcff]">
															{children}
														</code>
													);
												},
												pre: ({ children }) => (
													<pre className="mb-3 overflow-x-auto rounded-xl bg-black/40 p-0 last:mb-0">{children}</pre>
												),
												blockquote: ({ children }) => (
													<blockquote className="mb-3 border-l-2 border-[#606bfa] pl-3 italic text-white/75 last:mb-0">
														{children}
													</blockquote>
												),
												h1: ({ children }) => (
													<h1 className="mb-3 text-lg font-bold text-white last:mb-0">{children}</h1>
												),
												h2: ({ children }) => (
													<h2 className="mb-3 text-base font-bold text-white last:mb-0">{children}</h2>
												),
												h3: ({ children }) => (
													<h3 className="mb-2 text-sm font-semibold text-white last:mb-0">{children}</h3>
												),
											}}
										>
											{message.content}
										</ReactMarkdown>
									</div>
								) : (
									<div className="whitespace-pre-wrap break-words">{message.content}</div>
								)}
							</div>
						</div>
					))}

				{!userHasStarted && (
					<div className="grid gap-2">
						{starterPrompts.map((prompt) => (
							<button
								type="button"
								key={prompt}
								onClick={() => onPromptClick(prompt)}
								className="bg-[#606bfa]/14 hover:bg-[#606bfa]/24 rounded-2xl border border-[#7d89ff]/35 px-4 py-2.5 text-left text-sm font-medium text-[#dfe3ff] transition hover:border-[#a0a6fc]/70"
							>
								{prompt}
							</button>
						))}
					</div>
				)}

				{isLoading && (
					<div className="flex justify-start">
						<div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.065] px-4 py-3 text-sm text-white/70">
							<Loader2 className="h-4 w-4 animate-spin text-[#a0a6fc]" aria-hidden="true" />
							AXON is thinking
						</div>
					</div>
				)}
			</div>

			{error && <p className="border-t border-white/10 px-4 py-2 text-xs text-[#ffb4c0]">{error}</p>}

			<form onSubmit={onSubmit} className="border-t border-white/10 bg-black/20 p-3">
				<div className="border-white/12 flex items-end gap-2 rounded-2xl border bg-white/[0.06] p-2 focus-within:border-[#8c96ff] focus-within:ring-2 focus-within:ring-[#606bfa]/35">
					<textarea
						ref={inputRef}
						value={input}
						onChange={(event) => onInputChange(event.target.value)}
						onKeyDown={onKeyDown}
						placeholder="Ask AXON about SPCTEK.AI..."
						rows={1}
						className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35"
					/>
					<button
						type="submit"
						disabled={!input.trim() || isLoading}
						aria-label="Send message to AXON"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#606bfa] text-white transition hover:bg-[#6f79ff] disabled:cursor-not-allowed disabled:opacity-45"
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
						) : (
							<Send className="h-4 w-4" aria-hidden="true" />
						)}
					</button>
				</div>
			</form>
		</>
	);
}
