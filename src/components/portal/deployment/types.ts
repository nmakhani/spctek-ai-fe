export interface DeploymentLogFile {
	name: string;
	path: string;
	size_bytes: number;
	modified_at: string;
}

export interface DeploymentFileContent {
	name: string;
	content: string;
	size_bytes: number;
	modified_at: string;
	truncated: boolean;
}

export interface DeploymentError {
	timestamp: string | null;
	level: string | null;
	message: string | null;
}

export interface DeploymentDetails {
	status?: string;
	last_run?: string | null;
	started_at?: string | null;
	completed_at?: string | null;
	message?: string;
	commit?: string;
	branch?: string;
	[key: string]: unknown;
}

export interface DeploymentStatus {
	status: string;
	last_run: string | null;
	deployment: DeploymentDetails | null;
	last_success: DeploymentDetails | null;
	last_error: DeploymentError | null;
	recent_errors: string[];
	recent_log: string[];
	logs_directory: string;
	logs_directory_exists: boolean;
	files: DeploymentLogFile[];
}
