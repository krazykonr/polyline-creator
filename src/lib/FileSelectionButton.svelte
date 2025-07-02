<script lang="ts">
	import { onMount } from 'svelte';
	import { Dropzone } from 'flowbite-svelte';
	import { fileContent, selectedFile } from '$lib/stores/fileStore';

	// Bound to the Dropzone component:
	let value: FileList | null = null;

	onMount(() => {
		console.log('🟢 FileSelectionButton mounted');
	});

	// Reactive debug: log whenever the bound `value` changes
	$: console.log('🔄 Dropzone files value:', value);

	// Reactive file‐load: as soon as `value` has a FileList, read it
	$: if (value && value.length > 0) {
		const file = value[0];
		console.log('⚙️  Reactive handler sees file:', file.name);
		selectedFile.set(file);

		file.text().then((text) => {
			console.log('📄 Reactive read text length:', text.length);
			fileContent.set(text);
		});
	} else if (value !== null) {
		// value === [] or null
		console.log('❌ Reactive handler: no files');
		selectedFile.set(null);
		fileContent.set(null);
	}

	async function handleChange(event: Event) {
		// still keep this in case the Dropzone does forward change
		const target = event.target as HTMLInputElement;
		const files = target.files;
		console.log('👆 handleChange files:', files);
		value = files;
	}

	async function dropHandle(event: DragEvent) {
		event.preventDefault();
		const dtFiles = event.dataTransfer?.files;
		console.log('👆 dropHandle files:', dtFiles);
		value = dtFiles ?? null;
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
	class="w-full max-w-2xl"
	bind:files={value}
	accept=".gpx,.tcx,.fit"
	on:drop={dropHandle}
	on:dragover={(e) => e.preventDefault()}
	on:change={handleChange}
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
			<span class="font-semibold">Click to upload</span>
			or drag and drop
		</p>
		<p class="text-xs text-gray-500 dark:text-gray-400">GPX, TCX or FIT (max 6MB)</p>
	{:else}
		<p class="text-sm text-green-600">{showFiles(value)}</p>
	{/if}
</Dropzone>
