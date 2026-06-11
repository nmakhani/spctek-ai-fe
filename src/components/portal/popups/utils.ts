import type { Popup, PopupFormData, PopupPayload } from './types';

export const EMPTY_POPUP_FORM: PopupFormData = {
	path: '',
	title: '',
	content: '',
	cta_text: '',
	cta_link: '',
	delay: '0',
};

export function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export function popupToFormData(popup: Popup): PopupFormData {
	return {
		path: popup.path,
		title: popup.content.title,
		content: popup.content.content,
		cta_text: popup.content.cta_text,
		cta_link: popup.content.cta_link,
		delay: String(popup.delay),
	};
}

export function buildPopupPayload(formData: PopupFormData): PopupPayload {
	const parsedDelay = Number.parseInt(formData.delay, 10);
	if (Number.isNaN(parsedDelay) || parsedDelay < 0) {
		throw new Error('Delay must be a number greater than or equal to 0');
	}

	return {
		path: formData.path.trim(),
		content: {
			title: formData.title.trim(),
			content: formData.content.trim(),
			cta_text: formData.cta_text.trim(),
			cta_link: formData.cta_link.trim(),
		},
		delay: parsedDelay,
	};
}
