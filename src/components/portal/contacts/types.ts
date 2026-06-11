export interface ContactSubmission {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	company?: string;
	message?: string;
	source?: string;
	journey?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
}

export interface JourneyEntry {
	id: string;
	source?: string;
	journey?: Record<string, unknown>;
}

export interface Contact {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	company?: string;
	message?: string;
	status_id?: string | null;
	status_code?: string | null;
	source?: string;
	journey?: Record<string, unknown>;
	created_at?: string;
	submissions?: ContactSubmission[];
}
