import type { FormValues, FormErrors } from '@/components/ui/GenericForm';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

/** Validates the contact page form. */
export function validateContactForm(values: FormValues): FormErrors {
	const errors: FormErrors = {};

	if (!values.name?.trim()) {
		errors.name = 'Full name is required';
	}

	if (!values.company?.trim()) {
		errors.company = 'Company is required';
	}

	if (!values.email?.trim() && !values.phone?.trim()) {
		errors.submit = 'At least one of email or phone is required';
	}

	if (values.email?.trim() && !emailRegex.test(values.email)) {
		errors.email = 'Please enter a valid email address';
	}

	if (values.phone?.trim() && !phoneRegex.test(values.phone)) {
		errors.phone = 'Please enter a valid phone number';
	}

	if (!values.message?.trim()) {
		errors.message = 'Message is required';
	}

	return errors;
}
