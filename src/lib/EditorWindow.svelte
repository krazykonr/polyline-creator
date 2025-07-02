<script lang="ts">
	import { fileContent } from '$lib/stores/fileStore';
</script>

{#if $fileContent !== null}
	<textarea
		class="dark:bg-primary-800 dark:fill-primary-50 h-96 w-full resize rounded-lg border bg-white font-mono"
		bind:value={$fileContent}
	></textarea>
{/if}
