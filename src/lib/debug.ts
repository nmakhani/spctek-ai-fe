const IS_LOGGING_ENABLED = false;

export const debugConsole = {
	log: (message: string, data?: unknown) => {
		if (IS_LOGGING_ENABLED) {
			console.log(message, data ?? '');
		}
	},
	error: (message: string, error?: unknown) => {
		if (IS_LOGGING_ENABLED) {
			console.error(message, error ?? '');
		}
	},
	warn: (message: string, warning?: unknown) => {
		if (IS_LOGGING_ENABLED) {
			console.warn(message, warning ?? '');
		}
	},
};
