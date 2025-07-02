<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand } from "flowbite-svelte"
	import { DarkMode } from "flowbite-svelte";
	import { Footer, FooterCopyright } from "flowbite-svelte";

	let { children } = $props();
</script>

<Navbar class="bg-primary-200 dark:bg-primary-800">
  <NavBrand href="/">
    <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Polyline Creator Icon" />
    <span class="self-center text-xl font-semibold whitespace-nowrap text-secondary-950 dark:text-primary-50">Polyline Creator</span>
  </NavBrand>
  <DarkMode class="bg-primary-500 dark:bg-secondary-500 border dark:border-secondary-500 text-primary-200 dark:fill-primary-200 "/>
</Navbar>

{@render children()}

<Footer>
  <FooterCopyright href="/" by="Midday Software Development™" year={2025} />
</Footer>
