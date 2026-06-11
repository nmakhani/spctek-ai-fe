import type { Contact, ContactSubmission } from './types';

export function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export function hasJourneyData(journey?: Record<string, unknown>) {
	return Boolean(journey && Object.keys(journey).length > 0);
}

export function getSubmissionDate(submission: ContactSubmission) {
	return submission.created_at ? new Date(submission.created_at).getTime() : 0;
}

export function getContactSubmissions(contact: Contact) {
	return [...(contact.submissions || [])].sort((left, right) => getSubmissionDate(right) - getSubmissionDate(left));
}

export function getContactSources(contact: Contact) {
	const sources = getContactSubmissions(contact)
		.map((submission) => submission.source)
		.filter((source): source is string => Boolean(source));

	if (!sources.length && contact.source) {
		sources.push(contact.source);
	}

	return sources;
}

export function getUniqueContactSources(contacts: Contact[]) {
	return Array.from(
		new Set(
			contacts.flatMap((contact) => getContactSources(contact)).filter((source): source is string => Boolean(source))
		)
	);
}
