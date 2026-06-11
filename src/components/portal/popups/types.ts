export interface PopupContent {
	title: string;
	content: string;
	cta_text: string;
	cta_link: string;
}

export interface Popup {
	id: string;
	path: string;
	content: PopupContent;
	delay: number;
	created_at: string;
	updated_at: string;
}

export interface PopupFormData {
	path: string;
	title: string;
	content: string;
	cta_text: string;
	cta_link: string;
	delay: string;
}

export interface PopupPayload extends Record<string, unknown> {
	path: string;
	content: PopupContent;
	delay: number;
}
