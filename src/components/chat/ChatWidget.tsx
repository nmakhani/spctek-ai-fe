'use client';

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, Maximize2, Minimize2, Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import CalendlyModal from '@/components/ui/CalendlyModal';

type ChatMessage = {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	streaming?: boolean;
};

type StreamPayload = {
	type?: string;
	tool?: string;
	action?: string;
	error?: string;
	choices?: {
		delta?: { content?: string };
		message?: { content?: string };
		text?: string;
	}[];
};

const starterPrompts = [
	'What does SPCTEK.AI do?',
	'Which service is right for me?',
	'How does local AI setup work?',
	'Can you assess my operations?',
];

const initialMessage: ChatMessage = {
	id: 'chat-welcome',
	role: 'assistant',
	content:
		"Hi, I'm AXON. Ask me about SPCTEK.AI services, automation ideas, local AI, or which path fits your business. I keep things short unless you invite me to nerd out.",
};

const storedMessagesKey = 'spctek-chat-message-pairs';
const maxStoredPairs = 10;

const createId = () => {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [isFullPage, setIsFullPage] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLTextAreaElement | null>(null);

	const sessionId = useMemo(() => {
		if (typeof window === 'undefined') return 'chat-session';

		const storageKey = 'spctek-chat-session-id';
		const existing = window.localStorage.getItem(storageKey);
		if (existing) return existing;

		const nextId = createId();
		window.localStorage.setItem(storageKey, nextId);
		return nextId;
	}, []);

	useEffect(() => {
		try {
			const storedMessages = window.localStorage.getItem(storedMessagesKey);
			if (!storedMessages) return;

			const parsedMessages = JSON.parse(storedMessages);
			if (!Array.isArray(parsedMessages)) return;

			const restoredMessages = parsedMessages
				.filter((message): message is ChatMessage => {
					if (!message || typeof message !== 'object') return false;
					const candidate = message as Partial<ChatMessage>;
					return (
						(candidate.role === 'user' || candidate.role === 'assistant') &&
						typeof candidate.content === 'string' &&
						candidate.content.trim().length > 0
					);
				})
				.slice(-(maxStoredPairs * 2))
				.map((message) => ({
					id: createId(),
					role: message.role,
					content: message.content,
				}));

			if (restoredMessages.length) {
				setMessages([initialMessage, ...restoredMessages]);
			}
		} catch {
			window.localStorage.removeItem(storedMessagesKey);
		}
	}, []);

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
	}, [messages, isLoading]);

	useEffect(() => {
		if (!isOpen) return;

		const timeout = window.setTimeout(() => inputRef.current?.focus(), 220);
		return () => window.clearTimeout(timeout);
	}, [isOpen]);

	const userHasStarted = messages.some((message) => message.role === 'user');

	const persistConversation = (nextMessages: ChatMessage[]) => {
		const completedMessages = nextMessages
			.filter((message) => !message.streaming && (message.role === 'user' || message.role === 'assistant'))
			.filter((message) => message.id !== initialMessage.id && message.content.trim().length > 0);

		const pairs: ChatMessage[][] = [];

		for (let index = 0; index < completedMessages.length - 1; index += 1) {
			const userMessage = completedMessages[index];
			const assistantMessage = completedMessages[index + 1];

			if (userMessage?.role === 'user' && assistantMessage?.role === 'assistant') {
				pairs.push([
					{ id: userMessage.id, role: userMessage.role, content: userMessage.content },
					{ id: assistantMessage.id, role: assistantMessage.role, content: assistantMessage.content },
				]);
				index += 1;
			}
		}

		const messagesToStore = pairs.slice(-maxStoredPairs).flat();
		window.localStorage.setItem(storedMessagesKey, JSON.stringify(messagesToStore));
	};

	const submitMessage = async (value?: string) => {
		const content = (value ?? input).trim();
		if (!content || isLoading) return;

		const userMessage: ChatMessage = { id: createId(), role: 'user', content };
		const assistantId = createId();
		const assistantMessage: ChatMessage = {
			id: assistantId,
			role: 'assistant',
			content: '',
			streaming: true,
		};
		const nextMessages = [...messages, userMessage, assistantMessage];

		setMessages(nextMessages);
		setInput('');
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId,
					messages: nextMessages.map(({ role, content }) => ({ role, content })),
				}),
			});

			if (!response.ok) {
				const data = await response.json().catch(() => null);
				throw new Error(data?.error || 'AXON could not respond right now.');
			}

			if (!response.body) {
				throw new Error('AXON returned an empty stream.');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			let assistantText = '';
			let done = false;

			while (!done) {
				const { value, done: streamDone } = await reader.read();
				done = streamDone;
				buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

				let boundaryIndex = buffer.indexOf('\n\n');
				while (boundaryIndex !== -1) {
					const eventChunk = buffer.slice(0, boundaryIndex).trim();
					buffer = buffer.slice(boundaryIndex + 2);
					boundaryIndex = buffer.indexOf('\n\n');

					if (!eventChunk) {
						continue;
					}

					for (const line of eventChunk.split('\n')) {
						if (!line.startsWith('data:')) continue;
						const data = line.slice(5).trim();

						if (!data || data === '[DONE]') {
							done = true;
							break;
						}

						let payload: StreamPayload;
						try {
							payload = JSON.parse(data);
						} catch {
							// Ignore non-JSON event lines.
							continue;
						}

						if (payload.type === 'tool_result') {
							if (payload.tool === 'book_meeting' && payload.action === 'open_calendly') {
								setIsCalendlyOpen(true);
							}
							continue;
						}

						if (payload.type === 'error') {
							throw new Error(
								typeof payload.error === 'string'
									? payload.error
									: 'AXON is temporarily unavailable. Please try again soon.'
							);
						}

						const delta =
							payload?.choices?.[0]?.delta?.content ??
							payload?.choices?.[0]?.message?.content ??
							payload?.choices?.[0]?.text ??
							'';

						if (typeof delta === 'string' && delta) {
							assistantText += delta;
							setMessages((current) =>
								current.map((message) =>
									message.id === assistantId ? { ...message, content: assistantText, streaming: true } : message
								)
							);
						}
					}
				}
			}

			setMessages((current) =>
				current.map((message) => (message.id === assistantId ? { ...message, streaming: false } : message))
			);
			persistConversation(
				nextMessages.map((message) =>
					message.id === assistantId ? { ...message, content: assistantText, streaming: false } : message
				)
			);
		} catch (requestError) {
			const message =
				requestError instanceof Error
					? requestError.message
					: 'AXON is temporarily unavailable. Please try again soon.';
			setError(message);
			setMessages((current) => [
				...current.filter((item) => !item.streaming),
				{
					id: createId(),
					role: 'assistant',
					content:
						"I'm having trouble reaching my model right now. You can still ask about SPCTEK.AI services, or use the contact page if this is urgent.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		void submitMessage();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			void submitMessage();
		}
	};

	const closeChat = () => {
		setIsOpen(false);
		setIsFullPage(false);
	};

	const shellClassName = isFullPage
		? 'fixed inset-3 z-[60] flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#070a18]/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.62),0_0_44px_rgba(96,107,250,0.18)] backdrop-blur-2xl sm:inset-5 lg:inset-x-[max(1rem,calc((100vw-1360px)/2))] lg:inset-y-6'
		: 'fixed bottom-5 right-4 z-[60] flex h-[72vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#070a18]/95 text-white shadow-[0_20px_58px_rgba(0,0,0,0.52),0_0_32px_rgba(96,107,250,0.16)] backdrop-blur-2xl sm:bottom-6 sm:right-6 sm:h-[70vh] sm:min-h-[500px] sm:max-h-[760px] sm:w-[min(33vw,380px)] sm:min-w-[320px]';

	return (
		<>
			<AnimatePresence mode="wait">
				{isOpen ? (
					<motion.section
						key="chat-window"
						layoutId="chat-widget-shell"
						initial={{ opacity: 0.92, scale: 0.18, borderRadius: 16 }}
						animate={{ opacity: 1, scale: 1, borderRadius: 16 }}
						exit={{ opacity: 0, scale: 0.18, borderRadius: 16 }}
						transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
						style={{ transformOrigin: 'bottom right' }}
						className={shellClassName}
						aria-label="AXON SPCTEK AI chat"
					>
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
										<p className="text-white/62 mt-1 truncate text-xs font-medium">SPCTEK.AI agent</p>
									</div>
								</div>
								<div className="flex shrink-0 items-center gap-2">
									<button
										type="button"
										onClick={() => setIsFullPage((current) => !current)}
										aria-label={isFullPage ? 'Return AXON chat to compact view' : 'Open AXON chat in full page view'}
										className="border-white/12 flex h-9 w-9 items-center justify-center rounded-full border bg-white/[0.06] text-white/75 transition hover:bg-[#606bfa]/25 hover:text-white"
									>
										{isFullPage ? (
											<Minimize2 className="h-4 w-4" aria-hidden="true" />
										) : (
											<Maximize2 className="h-4 w-4" aria-hidden="true" />
										)}
									</button>
									<button
										type="button"
										onClick={closeChat}
										aria-label="Close AXON chat"
										className="border-white/12 flex h-9 w-9 items-center justify-center rounded-full border bg-white/[0.06] text-white/75 transition hover:bg-[#606bfa]/25 hover:text-white"
									>
										<X className="h-4 w-4" aria-hidden="true" />
									</button>
								</div>
							</div>
						</header>

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
															ul: ({ children }) => (
																<ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
															),
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
																<pre className="mb-3 overflow-x-auto rounded-xl bg-black/40 p-0 last:mb-0">
																	{children}
																</pre>
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
											onClick={() => void submitMessage(prompt)}
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

						<form onSubmit={handleSubmit} className="border-t border-white/10 bg-black/20 p-3">
							<div className="border-white/12 flex items-end gap-2 rounded-2xl border bg-white/[0.06] p-2 focus-within:border-[#8c96ff] focus-within:ring-2 focus-within:ring-[#606bfa]/35">
								<textarea
									ref={inputRef}
									value={input}
									onChange={(event) => setInput(event.target.value)}
									onKeyDown={handleKeyDown}
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
					</motion.section>
				) : (
					<motion.button
						key="chat-launcher"
						layoutId="chat-widget-shell"
						type="button"
						onClick={() => setIsOpen(true)}
						aria-label="Open AXON chat"
						aria-expanded={isOpen}
						animate={{ scale: [1, 1.06, 1] }}
						transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
						className="group fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#8f98ff]/45 bg-[#606bfa] text-white shadow-[0_12px_28px_rgba(96,107,250,0.34)] transition hover:-translate-y-1 hover:rotate-3 hover:border-[#b8beff] hover:bg-[#7580ff] hover:shadow-[0_16px_34px_rgba(96,107,250,0.48)] sm:bottom-6 sm:right-6"
					>
						<span className="bg-white/18 absolute inset-x-2 top-2 h-2 rounded-full transition group-hover:translate-x-1" />
						<span className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-[#5eead4]/30 transition group-hover:scale-125" />
						<Bot className="relative h-7 w-7" aria-hidden="true" />
					</motion.button>
				)}
			</AnimatePresence>
			<CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
		</>
	);
}
