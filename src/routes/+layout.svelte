<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, Footer, FooterBrand, FooterIcon } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareSolid, GithubSolid, InstagramSolid } from 'flowbite-svelte-icons';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Navbar class="bg-primary-200 dark:bg-primary-800 z-20">
		<NavBrand href="/" class="flex items-center gap-2">
			<ArrowUpRightFromSquareSolid class="text-primary-500 dark:text-secondary-500 h-6 w-6" />
			<span class="text-secondary-950 dark:text-primary-50 text-xl font-semibold whitespace-nowrap"
				>Polyline Creator</span
			>
		</NavBrand>

		<DarkMode
			class="border-primary-500 bg-primary-500 text-secondary-500 hover:bg-primary-400
			    dark:border-secondary-500 dark:bg-secondary-500 dark:text-primary-500 hover:dark:bg-secondary-400"
		/>
	</Navbar>

	<main class="flex-1 px-8">{@render children()}</main>

	<Footer footerType="socialmedia" class="bg-secondary-600 dark:bg-secondary-700 z-20 mt-auto">
		<div class="sm:flex sm:items-center sm:justify-between">
			<FooterBrand
				href="https://noons.dev"
				alt="noons.dev logo"
				name="noons.dev"
				class="text-black dark:text-black"
			/>
			<div class="mt-4 flex space-x-6 sm:mt-0 sm:justify-center rtl:space-x-reverse">
				<FooterIcon href="https://instagram.com/nooons_">
					<InstagramSolid
						class="h-12 w-12 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
					/>
				</FooterIcon>
				<FooterIcon href="https://github.com/krazykonr/polyline-creator">
					<GithubSolid
						class="h-12 w-12 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
					/>
				</FooterIcon>
			</div>
		</div>
	</Footer>
</div>
