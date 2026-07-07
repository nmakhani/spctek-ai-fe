import { NextResponse } from 'next/server';

import { novaSystemPrompt } from '@/data/novaKnowledgeBase';

type ClientMessage = {
	role: 'user' | 'assistant';
	content: string;
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const FREE_MODEL = 'openrouter/free';

const cleanMessages = (messages: unknown): ClientMessage[] => {
	if (!Array.isArray(messages)) return [];

	return messages
		.filter((message): message is ClientMessage => {
			if (!message || typeof message !== 'object') return false;
			const candidate = message as Partial<ClientMessage>;
			return (
				(candidate.role === 'user' || candidate.role === 'assistant') &&
				typeof candidate.content === 'string' &&
				candidate.content.trim().length > 0
			);
		})
		.slice(-20)
		.map((message) => ({
			role: message.role,
			content: message.content.trim().slice(0, 1400),
		}));
};

export async function POST(request: Request) {
	const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

	if (!apiKey) {
		return NextResponse.json(
			{ error: 'NOVA is not configured yet. Add NEXT_PUBLIC_OPENROUTER_API_KEY to the frontend environment.' },
			{ status: 500 }
		);
	}

	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
	}

	const { messages, sessionId } = (body || {}) as { messages?: unknown; sessionId?: unknown };
	const cleanedMessages = cleanMessages(messages);

	if (!cleanedMessages.length || cleanedMessages[cleanedMessages.length - 1]?.role !== 'user') {
		return NextResponse.json({ error: 'A user message is required.' }, { status: 400 });
	}

	try {
		const response = await fetch(OPENROUTER_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': 'https://www.spctek.ai',
				'X-Title': 'SPCTEK.AI NOVA Chat',
			},
			body: JSON.stringify({
				model: FREE_MODEL,
				messages: [{ role: 'system', content: novaSystemPrompt }, ...cleanedMessages],
				temperature: 0.45,
				max_completion_tokens: 450,
				stream: true,
				session_id: typeof sessionId === 'string' ? sessionId.slice(0, 256) : undefined,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('OpenRouter NOVA error:', response.status, errorText);
			return NextResponse.json({ error: 'NOVA had trouble responding. Please try again.' }, { status: 502 });
		}

		if (!response.body) {
			return NextResponse.json({ error: 'NOVA returned an empty response.' }, { status: 502 });
		}

		return new Response(response.body, {
			status: 200,
			headers: {
				'Content-Type': 'text/event-stream; charset=utf-8',
				'Cache-Control': 'no-cache, no-transform',
				Connection: 'keep-alive',
				'X-Accel-Buffering': 'no',
			},
		});
	} catch (error) {
		console.error('NOVA chat route error:', error);
		return NextResponse.json({ error: 'NOVA is temporarily unavailable. Please try again soon.' }, { status: 500 });
	}
}
