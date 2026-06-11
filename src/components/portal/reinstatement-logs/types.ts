export interface ReinstatementLog {
	id: string;
	contact_id: string;
	performance_notification: string;
	suspension_date: string;
	business_model: string;
	fulfillment_channel: string;
	appeals_made: number;
	seller_belief: string;
	available_documents: string;
	report_status: string;
	report_error?: string | null;
	report_generated_at?: string | null;
	report_emailed_at?: string | null;
	created_at: string;
	updated_at: string;
}

export interface Contact {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	created_at?: string;
}
