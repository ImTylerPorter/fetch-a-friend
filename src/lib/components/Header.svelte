<script lang="ts">
	import { favorites } from '$lib/stores/favorites';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	/**
	 * Component props
	 * @prop {boolean} isLoggedIn - Whether the user is currently authenticated
	 */
	let props = $props<{
		isLoggedIn: boolean;
	}>();

	async function handleLogout() {
		// Clear favorites
		favorites.clear();

		// Clear any other local storage items if needed
		if (browser) {
			localStorage.clear();
		}

		// Perform the logout
		await fetch('/logout', {
			method: 'POST'
		});
		window.location.href = '/';
	}

	async function checkAuthStatus() {
		try {
			const response = await fetch('/api/auth/check');
			if (!response.ok && props.isLoggedIn) {
				// Session expired, log out the user
				await handleLogout();
			}
		} catch (error) {
			console.error('Failed to check auth status:', error);
		}
	}

	onMount(() => {
		if (props.isLoggedIn) {
			// Check auth status every minute
			const interval = setInterval(checkAuthStatus, 60000);
			return () => clearInterval(interval);
		}
	});
</script>

<!-- Header.svelte
	- The main navigation header component for the application
	- Features include logo, navigation links, and authentication state handling -->

<header class="sticky top-0 z-50 border-b border-white/10 bg-[#1E0924]/80 backdrop-blur-xl">
	<nav class="container mx-auto flex items-center justify-between px-6 py-4 lg:px-8">
		<!-- Logo and Home Link -->
		<a href="/" class="flex items-center gap-3">
			<img src="/fetch-logo.svg" alt="Fetch A Friend Logo" class="h-8 w-8" />
			<span class="font-lexend text-lg font-bold text-white">Fetch A Friend</span>
		</a>

		<!-- Authentication Actions -->
		{#if props.isLoggedIn}
			<div class="flex items-center gap-4">
				<!-- Favorites Link with Counter -->
				<a
					href="/favorites"
					class="flex items-center gap-2 rounded-lg bg-fetch-hot-pink/10 px-4 py-2 font-rubik text-sm font-medium text-fetch-hot-pink transition-colors hover:bg-fetch-hot-pink/20"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"
						/>
					</svg>
					<span>Favorites</span>
					{#if $favorites.size > 0}
						<span
							class="ml-1 rounded-full bg-fetch-hot-pink px-2 py-0.5 text-xs font-medium text-white"
						>
							{$favorites.size}
						</span>
					{/if}
				</a>

				<!-- Logout Form -->
				<form action="/logout" method="POST">
					<button
						type="submit"
						class="rounded-lg bg-fetch-hot-pink/10 px-4 py-2 font-rubik text-sm font-medium text-fetch-hot-pink transition-colors hover:bg-fetch-hot-pink/20"
					>
						Logout
					</button>
				</form>
			</div>
		{/if}
	</nav>
</header>
