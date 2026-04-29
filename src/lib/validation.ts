export const isValidName = (name: string) => /^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(name.trim());

export const isValidEmail = (email: string) =>
	/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim()) && !/\.\./.test(email.trim());

export const isValidPhone = (phone: string) =>
	!phone.trim() ||
	(/^[+]?[\d()\-\s]{10,25}$/.test(phone.trim()) &&
		phone.replace(/\D/g, '').length >= 10 &&
		phone.replace(/\D/g, '').length <= 15 &&
		!/(\d)\1+$/.test(phone.replace(/\D/g, '')));

export const validateContactForm = (values: Record<string, string>) => {
	const errors: Record<string, string> = {};

	if (!values.name?.trim()) {
		errors.name = 'Name is required';
	} else if (!isValidName(values.name)) {
		errors.name = 'Please enter a valid name';
	}

	if (values.email && !isValidEmail(values.email)) {
		errors.email = 'Please enter a valid email';
	}

	if (values.phone && !isValidPhone(values.phone)) {
		errors.phone = 'Please enter a valid phone number';
	}

	return errors;
};

export const validateEstimatorForm = (values: Record<string, string>) => {
	const errors: Record<string, string> = {};

	if (!values.performanceNotification?.trim()) {
		errors.performanceNotification = 'Performance notification is required';
	}

	if (!values.suspensionDate?.trim()) {
		errors.suspensionDate = 'Suspension date is required';
	}

	if (!values.previousAppeals?.trim()) {
		errors.previousAppeals = 'Number of appeals is required';
	} else if (isNaN(parseInt(values.previousAppeals)) || parseInt(values.previousAppeals) < 0) {
		errors.previousAppeals = 'Please enter a valid number';
	}

	if (!values.businessModel?.trim()) {
		errors.businessModel = 'Business model is required';
	}

	if (!values.fulfillmentChannel?.trim()) {
		errors.fulfillmentChannel = 'Fulfillment channel is required';
	}

	if (!values.suspensionCause?.trim()) {
		errors.suspensionCause = 'Suspension cause is required';
	}

	if (!values.availableDocuments?.trim()) {
		errors.availableDocuments = 'Available documents is required';
	}

	return errors;
};

export const validateEstimatorContactForm = (values: Record<string, string>) => {
	const errors: Record<string, string> = {};

	if (!values.name?.trim()) {
		errors.name = 'Name is required';
	} else if (!isValidName(values.name)) {
		errors.name = 'Please enter a valid name';
	}

	if (!values.email?.trim()) {
		errors.email = 'Email is required';
	} else if (!isValidEmail(values.email)) {
		errors.email = 'Please enter a valid email';
	}

	if (values.phone && !isValidPhone(values.phone)) {
		errors.phone = 'Please enter a valid phone number';
	}

	return errors;
};
