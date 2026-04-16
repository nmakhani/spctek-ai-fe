import type { FormValues, FormErrors } from '@/components/ui/GenericForm';

export function validateEstimatorForm(values: FormValues): FormErrors {
	const errors: FormErrors = {};

	if (!values.performanceNotification?.trim()) {
		errors.performanceNotification = 'Please paste your Amazon performance notification';
	}

	if (!values.suspensionDate?.trim()) {
		errors.suspensionDate = 'Suspension date is required';
	}

	if (!values.previousAppeals?.trim()) {
		errors.previousAppeals = 'Please enter the number of previous appeals';
	} else if (isNaN(Number(values.previousAppeals))) {
		errors.previousAppeals = 'Please enter a valid number';
	}

	if (!values.businessModel?.trim()) {
		errors.businessModel = 'Please select your business model';
	}

	if (!values.fulfillmentChannel?.trim()) {
		errors.fulfillmentChannel = 'Please select your fulfillment channel';
	}

	if (!values.suspensionCause?.trim()) {
		errors.suspensionCause = 'Please describe what you believe caused the suspension';
	}

	if (!values.availableDocuments?.trim()) {
		errors.availableDocuments = 'Please list the documents you have available';
	}

	return errors;
}

export function validateEstimatorContactForm(values: FormValues): FormErrors {
	const errors: FormErrors = {};

	if (!values.name?.trim()) {
		errors.name = 'Full name is required';
	}

	if (!values.email?.trim()) {
		errors.email = 'Email address is required';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email as string)) {
		errors.email = 'Please enter a valid email address';
	}

	return errors;
}
