<script lang="ts">
	import { Dropzone } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let value: FileList | null = null;

	$: if (value && value.length > 0) {
		const file = value[0];
		console.log('📤 Dispatching "select" event with file:', file.name);
		dispatch('select', file);
	}

	function showFiles(files: FileList | null): string {
		if (!files || files.length === 0) return 'No files selected.';
		return Array.from(files)
			.map((f) => f.name)
			.join(', ');
	}
</script>

<Dropzone
	id="dropzone"
	class="w-full max-w-screen-md min-w-[300px] flex-1"
	bind:files={value}
	accept=".gpx,.tcx,.fit"
	ondragover={(e) => e.preventDefault()}
>
	<svg
		aria-hidden="true"
		class="mb-3 h-10 w-10 text-gray-400"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
		/>
	</svg>

	{#if !value || value.length === 0}
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			<span class="font-semibold">Click to upload</span> or drag and drop
		</p>
		<p class="text-xs text-gray-500 dark:text-gray-400">GPX (max 6MB)</p>
	{:else}
		<p class="text-sm text-green-600">{showFiles(value)}</p>
	{/if}
</Dropzone>
