<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';

	let { children } = $props();
</script>

<Navbar class="bg-primary-200 dark:bg-primary-800">
	<NavBrand href="/">
		<img
			src="/images/flowbite-svelte-icon-logo.svg"
			class="me-3 h-6 sm:h-9"
			alt="Polyline Creator Icon"
		/>
		<span
			class="text-secondary-950 dark:text-primary-50 self-center text-xl font-semibold whitespace-nowrap"
			>Polyline Creator</span
		>
	</NavBrand>
	<DarkMode
		class="border-primary-500 bg-primary-500 text-secondary-500 via-primary-300
		    dark:border-secondary-500 dark:bg-secondary-500 dark:text-primary-500"
	/>
</Navbar>

{@render children()}

<Footer>
	<FooterCopyright href="/" by="Midday Software Development™" year={2025} />
</Footer>
