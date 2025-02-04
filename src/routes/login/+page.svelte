<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { favorites } from '$lib/stores/favorites';
	import FormError from '$lib/components/FormError.svelte';
	import type { PageData } from './$types';

	/**
	 * Component props
	 * @prop {PageData} data - Server-loaded data
	 * @prop {string} [error] - Error message from form submission
	 */
	let props = $props<PageData & { error?: string }>();

	/**
	 * Form enhancement handler
	 * Manages form submission and post-submission navigation
	 * Redirects to home page on successful login
	 */
	const handleEnhance = () => {
		return async ({ update }: { update: () => Promise<void> }) => {
			// Clear favorites before updating
			favorites.clear();

			await update();
			if (!props.error) {
				await goto('/', { replaceState: true });
			}
		};
	};
</script>

<!-- Login Page Component
	- Provides user authentication interface with form validation and error handling
	- Features:
		- Name and email input fields
		- Client-side validation
		- Error message display
		- Automatic redirection after successful login -->

<svelte:head>
	<title>Login - Fetch A Friend</title>
	<meta
		name="description"
		content="Log in to Fetch A Friend to start browsing and favoriting dogs for adoption."
	/>
</svelte:head>

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

	<main class="relative z-10">
		<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
			<div class="lg:grid lg:grid-cols-12 lg:gap-8">
				<!-- Left Column - Hero Content -->
				<div class="lg:col-span-7">
					<div class="max-w-xl">
						<h1 class="font-lexend text-5xl font-bold tracking-tight text-white sm:text-7xl">
							Fetch A Friend
							<div class="mt-2 text-3xl sm:text-4xl">
								<span
									class="bg-gradient-to-r from-fetch-hot-pink to-fetch-orange bg-clip-text text-transparent"
								>
									Find Your Perfect Match
								</span>
							</div>
						</h1>
						<p class="mt-6 font-rubik text-xl font-light leading-8 text-fetch-gray-light/90">
							Helping you fetch the perfect furry companion.
						</p>

						<!-- Rating Section -->
						<div class="mt-8 flex items-center gap-2">
							<div class="flex text-[#FBA919]">
								{'★'.repeat(5)}
							</div>
							<span class="text-sm text-fetch-gray-light"
								>Trusted by thousands of happy pet owners</span
							>
						</div>
					</div>
				</div>

				<!-- Right Column - Login Form -->
				<div class="mt-12 lg:col-span-5 lg:mt-0">
					<div class="relative">
						<!-- Neon Border Effect -->
						<div
							class="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-fetch-hot-pink via-fetch-orange to-fetch-blue-purple opacity-75 blur-sm"
						></div>

						<div
							class="relative overflow-hidden rounded-xl bg-black/30 p-8 backdrop-blur-xl lg:p-10"
						>
							<div class="mx-auto max-w-md">
								<h2
									class="font-lexend text-2xl font-semibold tracking-tight text-white sm:text-3xl"
								>
									Welcome! Let's get started
								</h2>
								<p class="mt-2 font-rubik text-sm text-fetch-gray-light/80">
									Enter your details to begin your journey
								</p>

								<!-- Login Form -->
								<form method="POST" use:enhance={handleEnhance} class="mt-8 space-y-6">
									{#if props?.error}
										<FormError message={props.error} />
									{/if}

									<!-- Name Input -->
									<div class="space-y-2">
										<label for="name" class="font-rubik text-sm font-medium text-fetch-gray-light">
											Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											required
											class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white placeholder:text-fetch-gray-light/50 focus:border-fetch-hot-pink focus:bg-white/10 focus:ring focus:ring-fetch-hot-pink/20"
											placeholder="Enter your name"
										/>
									</div>

									<!-- Email Input -->
									<div class="space-y-2">
										<label for="email" class="font-rubik text-sm font-medium text-fetch-gray-light">
											Email
										</label>
										<input
											type="email"
											id="email"
											name="email"
											required
											class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white placeholder:text-fetch-gray-light/50 focus:border-fetch-hot-pink focus:bg-white/10 focus:ring focus:ring-fetch-hot-pink/20"
											placeholder="Enter your email"
										/>
									</div>

									<!-- Submit Button -->
									<button
										type="submit"
										class="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-fetch-hot-pink to-fetch-orange px-6 py-3.5 font-rubik font-medium text-white shadow-lg transition-all duration-300"
									>
										<div
											class="absolute inset-0 bg-gradient-to-r from-fetch-orange to-fetch-hot-pink opacity-0 transition-opacity duration-300 group-hover:opacity-100"
										></div>
										<span class="relative z-10 flex items-center justify-center gap-2">
											Start Finding Your Friend
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
													clip-rule="evenodd"
												/>
											</svg>
										</span>
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
