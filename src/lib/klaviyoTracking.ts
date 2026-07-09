'use client';

type KlaviyoPrimitive = string | number | boolean | null | undefined;
type KlaviyoValue = KlaviyoPrimitive | KlaviyoValue[] | { [key: string]: KlaviyoValue };
type KlaviyoProperties = Record<string, KlaviyoValue>;

type KlaviyoClient = {
	track?: (eventName: string, properties?: KlaviyoProperties) => unknown;
	identify?: (profile: KlaviyoProperties) => unknown;
};

declare global {
	interface Window {
		klaviyo?: KlaviyoClient;
	}
}

interface KlaviyoProfileInput {
	email?: string | null;
	name?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	phone?: string | null;
	company?: string | null;
	source?: string | null;
	properties?: KlaviyoProperties;
}

interface TrackFormSubmittedInput {
	formName: string;
	fields?: Record<string, unknown>;
	profile?: KlaviyoProfileInput;
	page?: string;
	source?: string;
	properties?: KlaviyoProperties;
}

const PRIVATE_FIELD_PATTERN = /password|token|secret|key|authorization|file|attachment/i;
const MAX_STRING_LENGTH = 500;

function getKlaviyo() {
	if (typeof window === 'undefined') {
		return null;
	}

	return window.klaviyo ?? null;
}

function getCurrentPage() {
	if (typeof window === 'undefined') {
		return '';
	}

	return `${window.location.pathname}${window.location.search}`;
}

function splitName(name?: string | null) {
	const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

	if (parts.length === 0) {
		return {};
	}

	return {
		firstName: parts[0],
		lastName: parts.length > 1 ? parts.slice(1).join(' ') : undefined,
	};
}

function sanitizeValue(value: unknown, depth = 0): KlaviyoValue {
	if (value === null || value === undefined) {
		return value;
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed.length > MAX_STRING_LENGTH ? `${trimmed.slice(0, MAX_STRING_LENGTH)}...` : trimmed;
	}

	if (typeof value === 'number' || typeof value === 'boolean') {
		return value;
	}

	if (Array.isArray(value)) {
		if (depth >= 2) {
			return '[array]';
		}

		return value.slice(0, 20).map((item) => sanitizeValue(item, depth + 1));
	}

	if (typeof value === 'object') {
		if (depth >= 2) {
			return '[object]';
		}

		return Object.entries(value as Record<string, unknown>).reduce<KlaviyoProperties>((acc, [key, child]) => {
			if (PRIVATE_FIELD_PATTERN.test(key)) {
				return acc;
			}

			acc[key] = sanitizeValue(child, depth + 1);
			return acc;
		}, {});
	}

	return String(value);
}

function sanitizeFields(fields?: Record<string, unknown>) {
	if (!fields) {
		return undefined;
	}

	return sanitizeValue(fields) as KlaviyoProperties;
}

function buildProfile(profile?: KlaviyoProfileInput, formName?: string) {
	if (!profile?.email) {
		return null;
	}

	const email = profile.email.trim();
	const name = profile.name?.trim();
	const phone = profile.phone?.trim();
	const company = profile.company?.trim();
	const leadSource = profile.source?.trim();
	const nameParts = splitName(profile.name);
	const firstName = profile.firstName?.trim() || nameParts.firstName;
	const lastName = profile.lastName?.trim() || nameParts.lastName;
	const customProperties = sanitizeValue(profile.properties ?? {}) as KlaviyoProperties;

	return {
		email,
		...(firstName ? { first_name: firstName } : {}),
		...(lastName ? { last_name: lastName } : {}),
		...(phone ? { phone_number: phone } : {}),
		...(name ? { name } : {}),
		...(company ? { company } : {}),
		...(phone ? { phone } : {}),
		...(leadSource ? { lead_source: leadSource, source: leadSource } : {}),
		...(formName ? { last_submitted_form: formName } : {}),
		...customProperties,
	};
}

function settle(value: unknown) {
	if (value && typeof (value as PromiseLike<unknown>).then === 'function') {
		Promise.resolve(value).catch(() => undefined);
	}
}

function callSafely(callback: () => unknown) {
	try {
		settle(callback());
	} catch {
		// Tracking should never block or break the user's form submission.
	}
}

export function trackFormSubmitted({ formName, fields, profile, page, source, properties }: TrackFormSubmittedInput) {
	try {
		const klaviyo = getKlaviyo();

		if (!klaviyo) {
			return;
		}

		const profilePayload = buildProfile({ ...profile, source: profile?.source ?? source }, formName);
		if (profilePayload && typeof klaviyo.identify === 'function') {
			setTimeout(() => {
				callSafely(() => klaviyo.identify?.(profilePayload));
			}, 0);
		}

		if (typeof klaviyo.track !== 'function') {
			return;
		}

		setTimeout(() => {
			callSafely(() =>
				klaviyo.track?.('Form Submitted', {
					form_name: formName,
					page: page ?? getCurrentPage(),
					...(source ? { source } : {}),
					...(fields ? { submitted_fields: sanitizeFields(fields) } : {}),
					...properties,
				})
			);
		}, 0);
	} catch {
		// Tracking must never interrupt the form submit path.
	}
}
