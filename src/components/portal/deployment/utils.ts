export function getErrorMessage(err: unknown, fallback: string): string {
	if (err && typeof err === 'object' && 'response' in err) {
		const response = (err as { response?: { data?: { detail?: string; message?: string } } }).response;
		return response?.data?.detail || response?.data?.message || fallback;
	}

	return err instanceof Error ? err.message : fallback;
}

export function formatStatus(status?: string) {
	if (!status) {
		return 'Unknown';
	}

	return status
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function formatBytes(size: number) {
	if (size < 1024) {
		return `${size} B`;
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} KB`;
	}

	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatGmtPlus5Time(value?: string | null) {
	if (!value) {
		return 'None';
	}

	const normalizedValue = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(' ', 'T')}Z` : value;
	const date = new Date(normalizedValue);

	if (Number.isNaN(date.getTime())) {
		return `${value} GMT+5`;
	}

	return new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
		timeZone: 'Asia/Karachi',
	}).format(date);
}

export function statusClasses(status: string) {
	switch (status) {
		case 'success':
			return 'border-emerald-300/35 bg-emerald-500/15 text-emerald-200';
		case 'starting':
		case 'running':
			return 'border-sky-300/35 bg-sky-500/15 text-sky-200';
		case 'failed':
			return 'border-red-300/35 bg-red-500/15 text-red-200';
		default:
			return 'border-white/15 bg-white/[0.06] text-white/75';
	}
}
