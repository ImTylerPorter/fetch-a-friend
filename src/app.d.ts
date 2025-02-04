/// <reference types="@sveltejs/kit" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			isAuthenticated: boolean;
			accessToken?: string;
		}
		// interface Error {}
		interface PageData {
			isAuthenticated: boolean;
			breeds?: string[];
		}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		PUBLIC_API_URL: string;
	}
}

export {};
