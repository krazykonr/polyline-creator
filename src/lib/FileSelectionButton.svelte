<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { fileContent } from '$lib/stores/fileStore';
	import { UploadSolid } from 'flowbite-svelte-icons';

	/** Button caption (default: “Open file”). */
	export let label: string = 'Open file';
	/** Accept attribute for the hidden <input>. Example: ".gpx,.csv" */
	export let accept: string = '*/*';

	let fileInput: HTMLInputElement | null = null;

	function openFileDialog() {
		fileInput?.click();
		console.log("Clicking upload button")
	}

	/** Read the first selected file as plain text and push to the store. */
	function handleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.[0]) {
			const reader = new FileReader();
			reader.onload = () => fileContent.set(reader.result as string);
			reader.readAsText(input.files[0]);
		}
	}
</script>

<!-- Hidden native picker -->
<input
	type="file"
	class="hidden"
	bind:this={fileInput}
	accept={accept}
	on:change={handleChange}
/>

<label class="inline-flex items-center cursor-pointer">
    <Button class="items-center p-4 gap-4" size="xl" color="primary" onclick={openFileDialog}>{label} <UploadSolid /></Button>
</label>
