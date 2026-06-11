import type { Author, AuthorFormData } from './types';

export const EMPTY_AUTHOR_FORM: AuthorFormData = {
	name: '',
	profile_picture_url: '',
	profile_picture_file: null,
	about: '',
	organization: '',
	position: '',
	social_links: {},
};

export function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export function authorToFormData(author: Author): AuthorFormData {
	return {
		name: author.name,
		profile_picture_url: author.profile_picture_url || '',
		profile_picture_file: null,
		about: author.about || '',
		organization: author.organization || '',
		position: author.position || '',
		social_links: author.social_links || {},
	};
}
