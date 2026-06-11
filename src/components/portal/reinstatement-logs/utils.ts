import type { Contact } from './types';

export function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export function getStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		pending: 'Pending',
		generating: 'Generating',
		email_pending: 'Email Pending',
		emailed: 'Emailed',
		email_failed: 'Email Failed',
		generation_failed: 'Generation Failed',
	};
	return labels[status] || status.replace(/_/g, ' ');
}

export function getStatusClass(status: string): string {
	if (status === 'emailed') return 'border-emerald-300/35 bg-emerald-500/15 text-emerald-200';
	if (status === 'email_failed' || status === 'generation_failed')
		return 'border-red-300/35 bg-red-500/15 text-red-200';
	if (status === 'generating' || status === 'email_pending') return 'border-blue-300/35 bg-blue-500/15 text-blue-200';
	return 'border-white/15 bg-white/[0.07] text-white/65';
}

export function getContactOption(contact: Contact) {
	const displayName = contact.name || contact.email || `Contact ${contact.id.slice(0, 8)}`;
	return `${displayName} (${contact.id.slice(0, 8)})`;
}

export function findContactByOption(contacts: Contact[], option: string) {
	const idMatch = option.match(/\(([0-9a-fA-F]{8})\)$/);
	if (!idMatch) {
		return null;
	}

	return contacts.find((contact) => contact.id.startsWith(idMatch[1])) || null;
}

export function previewText(value: string, maxLength = 200) {
	return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
}
