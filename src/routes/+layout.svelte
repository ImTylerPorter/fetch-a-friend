<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	let { data } = $props();
	let isAuthenticated = $derived(data.isAuthenticated);
</script>

<div class="relative min-h-screen overflow-hidden bg-[#1E0924]">
	<!-- Glow Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute -right-[40%] top-0 h-[800px] w-[800px] rounded-full bg-[#890a74] opacity-30 blur-[100px]"
		/>
		<div
			class="absolute -left-[20%] top-[20%] h-[600px] w-[600px] rounded-full bg-[#6d62dd] opacity-20 blur-[100px]"
		/>
	</div>

	<Header isLoggedIn={isAuthenticated} />

	<div class="relative z-10">
		<slot />
	</div>
</div>
