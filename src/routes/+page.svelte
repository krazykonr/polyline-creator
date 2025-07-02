<script lang="ts">
	import FileSelectButton from '$lib/FileSelectionButton.svelte';
	import EditorWindow from '$lib/EditorWindow.svelte';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
	<!-- Accept only GPX files -->
	<FileSelectButton accept=".gpx" label="Choose GPX file" />
	<EditorWindow />
</div>
