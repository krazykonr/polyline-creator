<script lang="ts">
    import { fileContent } from '$lib/stores/fileStore';
</script>

{#if $fileContent !== null}
<textarea
    class="w-full h-96 font-mono border rounded-lg bg-white dark:bg-primary-800 dark:fill-primary-50 resize"
    bind:value={$fileContent}
    ></textarea>
{/if}
