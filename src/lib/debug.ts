const IS_LOGGING_ENABLED = false;

export const debugConsole = {
  log: (message: string, data?: any) => {
    if (IS_LOGGING_ENABLED) {
      console.log(message, data ?? "");
    }
  },
  error: (message: string, error?: any) => {
    if (IS_LOGGING_ENABLED) {
      console.error(message, error ?? "");
    }
  },
  warn: (message: string, warning?: any) => {
    if (IS_LOGGING_ENABLED) {
      console.warn(message, warning ?? "");
    }
  },
};
