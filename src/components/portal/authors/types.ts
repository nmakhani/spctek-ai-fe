export interface Author {
	id: string;
	name: string;
	profile_picture_url?: string | null;
	about?: string | null;
	organization?: string | null;
	position?: string | null;
	social_links?: Record<string, string>;
	created_at: string;
	updated_at: string;
}

export interface AuthorFormData {
	name: string;
	profile_picture_url: string;
	profile_picture_file: File | null;
	about: string;
	organization: string;
	position: string;
	social_links: Record<string, string>;
}
