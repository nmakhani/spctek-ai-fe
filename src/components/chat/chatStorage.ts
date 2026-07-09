import type { ChatMessage, ChatSession } from './chatTypes';

export const starterPrompts = [
	'What does SPCTEK.AI do?',
	'Which service is right for me?',
	'How does local AI setup work?',
	'Can you assess my operations?',
];

export const initialMessage: ChatMessage = {
	id: 'chat-welcome',
	role: 'assistant',
	content:
		"Hi, I'm AXON. Ask me about SPCTEK.AI services, automation ideas, local AI, or which path fits your business. I keep things short unless you invite me to nerd out.",
};

export const storedSessionsKey = 'spctek-chat-sessions';
const legacyStoredMessagesKey = 'spctek-chat-message-pairs';
const legacySessionIdKey = 'spctek-chat-session-id';
const maxStoredPairs = 10;
export const maxStoredSessions = 5;

export const createId = () => {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const readJson = <T>(rawValue: string | null): T | null => {
	if (!rawValue) return null;

	try {
		return JSON.parse(rawValue) as T;
	} catch {
		return null;
	}
};

const isStoredMessage = (message: unknown): message is ChatMessage => {
	if (!message || typeof message !== 'object') return false;
	const candidate = message as Partial<ChatMessage>;

	return (
		(candidate.role === 'user' || candidate.role === 'assistant') &&
		typeof candidate.content === 'string' &&
		candidate.content.trim().length > 0
	);
};

const getStoredMessagePairs = (messagesToStore: ChatMessage[]) => {
	const completedMessages = messagesToStore
		.filter((message) => !message.streaming && (message.role === 'user' || message.role === 'assistant'))
		.filter((message) => message.id !== initialMessage.id && message.content.trim().length > 0);

	const pairs: ChatMessage[][] = [];

	for (let index = 0; index < completedMessages.length - 1; index += 1) {
		const userMessage = completedMessages[index];
		const assistantMessage = completedMessages[index + 1];

		if (userMessage?.role === 'user' && assistantMessage?.role === 'assistant') {
			pairs.push([
				{ id: userMessage.id || createId(), role: userMessage.role, content: userMessage.content },
				{ id: assistantMessage.id || createId(), role: assistantMessage.role, content: assistantMessage.content },
			]);
			index += 1;
		}
	}

	return pairs.slice(-maxStoredPairs).flat();
};

export const createSessionTitle = (messagesToStore: ChatMessage[]) => {
	const firstUserMessage = messagesToStore.find((message) => message.role === 'user');
	const fallbackTitle = 'New AXON chat';
	if (!firstUserMessage) return fallbackTitle;

	const title = firstUserMessage.content.replace(/\s+/g, ' ').trim();
	return title.length > 46 ? `${title.slice(0, 43)}...` : title || fallbackTitle;
};

const sanitizeStoredMessages = (value: unknown) => {
	if (!Array.isArray(value)) return [];

	return getStoredMessagePairs(
		value.filter(isStoredMessage).map((message) => ({
			id: typeof message.id === 'string' && message.id ? message.id : createId(),
			role: message.role,
			content: message.content.trim(),
		}))
	);
};

const sanitizeStoredSession = (session: unknown): ChatSession | null => {
	if (!session || typeof session !== 'object') return null;
	const candidate = session as Partial<ChatSession>;
	const messages = sanitizeStoredMessages(candidate.messages);
	if (!messages.length) return null;

	const updatedAt = typeof candidate.updatedAt === 'number' ? candidate.updatedAt : Date.now();
	const createdAt = typeof candidate.createdAt === 'number' ? candidate.createdAt : updatedAt;

	return {
		id: typeof candidate.id === 'string' && candidate.id ? candidate.id : createId(),
		title:
			typeof candidate.title === 'string' && candidate.title.trim()
				? candidate.title.trim()
				: createSessionTitle(messages),
		messages,
		createdAt,
		updatedAt,
	};
};

export const sortAndLimitSessions = (sessionsToSort: ChatSession[]) =>
	[...sessionsToSort].sort((left, right) => right.updatedAt - left.updatedAt).slice(0, maxStoredSessions);

export const formatSessionTime = (updatedAt: number) => {
	const formatter = new Intl.DateTimeFormat(undefined, {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});

	return formatter.format(new Date(updatedAt));
};

export const getSessionPreview = (session: ChatSession) =>
	[...session.messages].reverse().find((message) => message.content.trim())?.content || 'No preview available yet.';

export const getSessionPairCount = (session: ChatSession) => Math.ceil(session.messages.length / 2);

export const loadStoredChatState = () => {
	const fallback = {
		sessions: [] as ChatSession[],
		activeSessionId: createId(),
		messages: [initialMessage],
	};

	if (typeof window === 'undefined') {
		return fallback;
	}

	try {
		const parsedSessions = readJson<unknown>(window.localStorage.getItem(storedSessionsKey));
		const restoredSessions = sortAndLimitSessions(
			Array.isArray(parsedSessions)
				? parsedSessions.map(sanitizeStoredSession).filter((session): session is ChatSession => Boolean(session))
				: []
		);

		if (restoredSessions.length) {
			return {
				sessions: restoredSessions,
				activeSessionId: restoredSessions[0].id,
				messages: [initialMessage, ...restoredSessions[0].messages],
			};
		}

		const legacyMessages = readJson<unknown>(window.localStorage.getItem(legacyStoredMessagesKey));
		const restoredMessages = sanitizeStoredMessages(legacyMessages);

		if (restoredMessages.length) {
			const now = Date.now();
			const migratedSession = {
				id: window.localStorage.getItem(legacySessionIdKey) || createId(),
				title: createSessionTitle(restoredMessages),
				messages: restoredMessages,
				createdAt: now,
				updatedAt: now,
			};

			return {
				sessions: [migratedSession],
				activeSessionId: migratedSession.id,
				messages: [initialMessage, ...restoredMessages],
			};
		}
	} finally {
		window.localStorage.removeItem(legacyStoredMessagesKey);
		window.localStorage.removeItem(legacySessionIdKey);
	}

	return fallback;
};

export const persistStoredSessions = (sessions: ChatSession[]) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(storedSessionsKey, JSON.stringify(sortAndLimitSessions(sessions)));
};

export const clearStoredChatMemory = () => {
	if (typeof window === 'undefined') return;

	window.localStorage.removeItem(storedSessionsKey);
	window.localStorage.removeItem(legacyStoredMessagesKey);
	window.localStorage.removeItem(legacySessionIdKey);
};

export const upsertStoredSession = (currentSessions: ChatSession[], sessionId: string, nextMessages: ChatMessage[]) => {
	const messagesToStore = getStoredMessagePairs(nextMessages);
	if (!messagesToStore.length) return currentSessions;

	const existingSession = currentSessions.find((session) => session.id === sessionId);
	const now = Date.now();
	const nextSession: ChatSession = {
		id: sessionId,
		title: createSessionTitle(messagesToStore),
		messages: messagesToStore,
		createdAt: existingSession?.createdAt ?? now,
		updatedAt: now,
	};

	return sortAndLimitSessions([nextSession, ...currentSessions.filter((session) => session.id !== sessionId)]);
};
