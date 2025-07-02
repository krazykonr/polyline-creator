<script lang="ts">
	import { fly } from 'svelte/transition';
	import FileSelectButton from '$lib/FileSelectionButton.svelte';
	import EditorWindow from '$lib/EditorWindow.svelte';
	import { fileContent } from '$lib/stores/fileStore';
</script>

{#if $fileContent === null}
	<div
		class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
		in:fly={{ y: -80, duration: 500 }}
		out:fly={{ y: 80, duration: 500 }}
	>
		<FileSelectButton />
	</div>
{:else}
	<div
		class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
		in:fly={{ y: 80, duration: 500 }}
		out:fly={{ y: -80, duration: 500 }}
	>
		<EditorWindow />
	</div>
{/if}

<style>
	/* Drop‑zone: wide and roomy but only as tall as content */
	:global(#dropzone) {
		max-width: 48rem; /* 4xl */
		width: 100%;
		min-height: 16rem; /* ≈ 256 px for nicer target */
	}
</style>
