/// <reference types="@sveltejs/kit" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			isAuthenticated: boolean;
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		PUBLIC_API_URL: string;
	}
}

export { };
