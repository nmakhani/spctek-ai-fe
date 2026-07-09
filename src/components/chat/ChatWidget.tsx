'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot } from 'lucide-react';

import CalendlyModal from '@/components/ui/CalendlyModal';

import ChatConversation from './ChatConversation';
import ChatHeader from './ChatHeader';
import ChatSessionList from './ChatSessionList';
import { createId, initialMessage, loadStoredChatState, persistStoredSessions, upsertStoredSession } from './chatStorage';
import type { ChatMessage, ChatSession, StreamPayload } from './chatTypes';

export default function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [isFullPage, setIsFullPage] = useState(false);
	const [sessionView, setSessionView] = useState<'sessions' | 'chat'>('sessions');
	const [sessions, setSessions] = useState<ChatSession[]>([]);
	const [activeSessionId, setActiveSessionId] = useState('');
	const [hasHydratedSessions, setHasHydratedSessions] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		const restoredState = loadStoredChatState();
		setSessions(restoredState.sessions);
		setActiveSessionId(restoredState.activeSessionId);
		setMessages(restoredState.messages);
		setHasHydratedSessions(true);
	}, []);

	useEffect(() => {
		if (!hasHydratedSessions) return;
		persistStoredSessions(sessions);
	}, [hasHydratedSessions, sessions]);

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
	}, [messages, isLoading]);

	useEffect(() => {
		if (!isOpen || sessionView !== 'chat') return;

		const timeout = window.setTimeout(() => inputRef.current?.focus(), 220);
		return () => window.clearTimeout(timeout);
	}, [isOpen, sessionView]);

	const userHasStarted = messages.some((message) => message.role === 'user');
	const activeSession = sessions.find((session) => session.id === activeSessionId);

	const handleOpenChat = () => {
		setIsOpen(true);
		setSessionView('sessions');
	};

	const handleNewChat = () => {
		if (isLoading) return;

		setIsOpen(true);
		setActiveSessionId(createId());
		setMessages([initialMessage]);
		setInput('');
		setError(null);
		setSessionView('chat');
	};

	const handleSelectSession = (session: ChatSession) => {
		if (isLoading) return;

		setActiveSessionId(session.id);
		setMessages([initialMessage, ...session.messages]);
		setInput('');
		setError(null);
		setSessionView('chat');
	};

	const persistConversation = (sessionId: string, nextMessages: ChatMessage[]) => {
		setSessions((currentSessions) => upsertStoredSession(currentSessions, sessionId, nextMessages));
	};

	const submitMessage = async (value?: string) => {
		const content = (value ?? input).trim();
		if (!content || isLoading) return;

		const sessionId = activeSessionId || createId();
		if (!activeSessionId) {
			setActiveSessionId(sessionId);
		}

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

					if (!eventChunk) continue;

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
				sessionId,
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
		setSessionView('sessions');
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
						initial={{ opacity: 0, y: 18, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 18, scale: 0.97 }}
						transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
						style={{ transformOrigin: 'bottom right' }}
						className={shellClassName}
						aria-label="AXON SPCTEK AI chat"
					>
						<ChatHeader
							title={sessionView === 'sessions' ? 'Recent sessions' : activeSession?.title || 'New AXON chat'}
							isSessionsView={sessionView === 'sessions'}
							isLoading={isLoading}
							isFullPage={isFullPage}
							onOpenSessions={() => setSessionView('sessions')}
							onNewChat={handleNewChat}
							onToggleFullPage={() => setIsFullPage((current) => !current)}
							onClose={closeChat}
						/>

						{sessionView === 'sessions' ? (
							<ChatSessionList
								sessions={sessions}
								activeSessionId={activeSessionId}
								isLoading={isLoading}
								onNewChat={handleNewChat}
								onSelectSession={handleSelectSession}
							/>
						) : (
							<ChatConversation
								messages={messages}
								isLoading={isLoading}
								error={error}
								input={input}
								userHasStarted={userHasStarted}
								onInputChange={setInput}
								onSubmit={handleSubmit}
								onKeyDown={handleKeyDown}
								onPromptClick={(prompt) => void submitMessage(prompt)}
								scrollRef={scrollRef}
								inputRef={inputRef}
							/>
						)}
					</motion.section>
				) : (
					<button
						key="chat-launcher"
						type="button"
						onClick={handleOpenChat}
						aria-label="Open AXON chat"
						aria-expanded={isOpen}
						className="group fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#8f98ff]/45 bg-[#606bfa] text-white shadow-[0_12px_28px_rgba(96,107,250,0.34)] transition-all duration-200 ease-out hover:-translate-y-1 hover:rotate-2 hover:border-[#b8beff] hover:bg-[#7580ff] hover:shadow-[0_16px_34px_rgba(96,107,250,0.48)] sm:bottom-6 sm:right-6"
					>
						<span className="absolute inset-x-2 top-2 h-2 rounded-full bg-white/18 transition group-hover:translate-x-1" />
						<span className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-[#5eead4]/30 transition group-hover:scale-125" />
						<Bot className="relative h-7 w-7" aria-hidden="true" />
					</button>
				)}
			</AnimatePresence>
			<CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
		</>
	);
}
