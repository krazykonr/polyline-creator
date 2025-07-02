<script lang="ts">
	import FileSelectButton from '$lib/FileSelectionButton.svelte';
	import EditorWindow from '$lib/EditorWindow.svelte';
</script>

<div class="flex flex-col min-h-screen justify-center items-center gap-6 p-8">
	<!-- Accept only GPX files -->
	<FileSelectButton accept=".gpx" label="Choose GPX file" />
	<EditorWindow />
</div>
