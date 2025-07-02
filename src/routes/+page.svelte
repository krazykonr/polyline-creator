<script lang="ts">
	import FileSelectButton from '$lib/FileSelectionButton.svelte';
	import EditorWindow from '$lib/EditorWindow.svelte';
	import { fileContent } from '$lib/stores/fileStore';
</script>

<!-- Full‑height container so navbar+footer stay visible and content can centre -->
<div class="relative flex flex-1 flex-col items-center justify-center gap-6 p-8">
	<!-- Drop‑zone wrapper -->
	<div
		class="transition-transform duration-700 ease-out"
		style:transform={$fileContent ? 'translateY(calc(-40vh + 4rem)) skewY(-4deg)' : 'none'}
	>
		<FileSelectButton />
	</div>

	<!-- Editor appears once a file is chosen -->
	{#if $fileContent !== null}
		<div class="w-full max-w-4xl" in:fly={{ y: 100, duration: 700 }}>
			<EditorWindow />
		</div>
	{/if}
</div>

<style>
	/* Make the Flowbite Dropzone wider without touching its component file */
	:global(#dropzone) {
		max-width: 48rem; /* 768 px ≈ “4xl” – visibly wider than the old 2xl */
		width: 100%;
	}
</style>
