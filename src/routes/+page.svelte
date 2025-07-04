<script lang="ts">
	import { fly } from 'svelte/transition';
	import FileInput from '$lib/FileInput.svelte';
	import EditorWindow from '$lib/EditorWindow.svelte';

	let selectedFile: File | null = null;
	let fileContent: string | null = null;

	$: if (selectedFile) {
		selectedFile.text().then((text) => {
			console.log('[Page] File loaded:', text.length, 'chars');
			fileContent = text;
		});
	}
</script>

{#if !selectedFile}
	<!-- File picker screen -->
	<div
		class="fixed inset-0 z-10 flex items-center justify-center p-4"
		in:fly={{ y: -80, duration: 500 }}
		out:fly={{ y: 80, duration: 500 }}
	>
		<FileInput
			on:select={(e) => {
				console.log('[Page] File selected: ', e.detail?.name);
				selectedFile = e.detail;
			}}
		/>
	</div>
{:else}
	<!-- Editor screen -->
	<div
		class="fixed inset-0 z-10 flex items-center p-4"
		in:fly={{ y: 80, duration: 500 }}
		out:fly={{ y: -80, duration: 500 }}
	>
		<EditorWindow
			{selectedFile}
			{fileContent}
			on:clear={() => {
				console.log('[Page] Clear event received');
				selectedFile = null;
				fileContent = null;
			}}
		/>
	</div>
{/if}
