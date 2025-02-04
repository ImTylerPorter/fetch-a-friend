<script lang="ts">
	import { onMount } from 'svelte';
	import { favorites } from '$lib/stores/favorites';

	let form: HTMLFormElement;

	onMount(() => {
		// Clear favorites first
		favorites.clear();
		// Then submit the form
		form?.submit();
	});
</script>

<div class="container mx-auto px-6 py-8 text-center text-white lg:px-8 lg:py-12">
	<p class="mb-4 font-rubik">Logging out...</p>
	<form bind:this={form} method="POST" action="/logout">
		<input type="hidden" name="logout" value="true" />
	</form>
</div>
