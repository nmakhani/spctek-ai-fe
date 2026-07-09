export type ChatMessage = {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	streaming?: boolean;
};

export type StreamPayload = {
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

export type ChatSession = {
	id: string;
	title: string;
	messages: ChatMessage[];
	createdAt: number;
	updatedAt: number;
};
