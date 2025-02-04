<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	/**
	 * Component props
	 * @prop {Object} data - Server-loaded data from +layout.server.ts
	 * @prop {boolean} data.isAuthenticated - Whether the user is currently authenticated
	 */
	let { data, children } = $props();
	let isAuthenticated = $derived(data.isAuthenticated);
</script>

<!-- Root Layout Component
	- The main layout wrapper for the entire application
	- Features:
		- Global styles and CSS imports
		- Common meta tags and SEO configuration
		- Consistent layout structure with header
		- Background styling and effects
		- Authentication state management -->
<svelte:head>
	<title>Fetch A Friend - Find Your Perfect Dog Companion</title>
	<meta
		name="description"
		content="Browse and search through available dogs for adoption. Find your perfect furry companion based on breed, age, location, and more."
	/>
	<meta name="theme-color" content="#1E0924" />
	<meta property="og:title" content="Fetch A Friend - Find Your Perfect Dog Companion" />
	<meta
		property="og:description"
		content="Browse and search through available dogs for adoption. Find your perfect furry companion based on breed, age, location, and more."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/fetch-logo.svg" />
	<link rel="icon" href="/fetch-logo.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/fetch-logo.svg" />
</svelte:head>

<!-- Main Layout Container
	Provides consistent styling and structure for all pages
	Features background effects and proper z-index layering -->
<div class="relative min-h-screen overflow-hidden bg-[#1E0924]">
	<!-- Background Glow Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute -right-[40%] top-0 h-[800px] w-[800px] rounded-full bg-[#890a74] opacity-30 blur-[100px]"
		></div>
		<div
			class="absolute -left-[20%] top-[20%] h-[600px] w-[600px] rounded-full bg-[#6d62dd] opacity-20 blur-[100px]"
		></div>
	</div>

	<!-- Header Component -->
	<Header isLoggedIn={isAuthenticated} />

	<!-- Page Content Slot -->
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
