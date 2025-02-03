<script lang="ts">
	import { enhance } from '$app/forms';

	let props = $props<{
		isLoggedIn: boolean;
	}>();

	async function handleLogout() {
		await fetch('/logout', {
			method: 'POST'
		});
	}
</script>

<header class="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
	<nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex lg:flex-1">
			<a href="/" class="-m-1.5 p-1.5 text-white">
				<span class="font-lexend text-xl font-bold tracking-tight">Fetch A Friend</span>
			</a>
		</div>

		{#if props.isLoggedIn}
			<div class="flex flex-1 justify-end">
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
