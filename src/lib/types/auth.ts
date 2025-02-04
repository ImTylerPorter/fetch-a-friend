export interface LoginFormData {
	name: string;
	email: string;
}

export interface AuthResponse {
	success: boolean;
	error?: string;
	data?: Partial<LoginFormData>;
}
