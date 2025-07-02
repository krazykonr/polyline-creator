<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareSolid } from 'flowbite-svelte-icons';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Navbar class="bg-primary-200 dark:bg-primary-800">
		<NavBrand href="/" class="flex items-center gap-2">
			<ArrowUpRightFromSquareSolid class="text-primary-500 dark:text-secondary-500 h-6 w-6" />
			<span
				class="text-secondary-950 dark:text-primary-50 self-center text-xl font-semibold whitespace-nowrap"
				>Polyline Creator</span
			>
		</NavBrand>

		<DarkMode
			class="border-primary-500 bg-primary-500 text-secondary-500 hover:text-primary-500 hover:text-primary-800 hover:bg-primary-400
			    dark:border-secondary-500 dark:bg-secondary-500 dark:text-primary-500 hover:dark:text-secondary-500 hover:dark:bg-primary-500"
		/>
	</Navbar>

	<main class="flex-1 overflow-auto px-8">
		{@render children()}
	</main>

	<Footer type="socialmedia" class="bg-secondary-600 dark:bg-secondary-700 mt-auto">
		<FooterCopyright
			href="/"
			by="Midday Software Development™"
			year={2025}
			class="dark:fill-white"
		/>
	</Footer>
</div>
