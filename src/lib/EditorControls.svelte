<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { Button, Range, Toggle } from 'flowbite-svelte';
	import { DownloadSolid } from 'flowbite-svelte-icons';

	export let strokeColor: string;
	export let strokeWidth: number;
	export let bgColorChoice: string;
	export let exportMode: 'png' | 'svg';

	const dispatch = createEventDispatcher();

	function toggleExportMode() {
		exportMode = exportMode === 'png' ? 'svg' : 'png';
	}
</script>

<div
	class="dark:border-primary-700 dark:bg-primary-900/30 dark:bg-opacity-70 flex flex-col gap-6 rounded-lg border border-gray-200 bg-white/40 p-4 dark:border-gray-600"
>
	<!-- line colour -->
	<div class="flex flex-col items-start gap-3">
		<label class="text-base font-semibold">Line colour</label>
		<ColorPicker
			bind:hex={strokeColor}
			position="responsive"
			components={ChromeVariant}
			sliderDirection="horizontal"
			label=""
		/>
	</div>

	<!-- background -->
	<div class="flex flex-col items-start gap-3">
		<label class="text-base font-semibold">Background</label>
		<ColorPicker
			bind:hex={bgColorChoice}
			position="responsive"
			components={ChromeVariant}
			sliderDirection="horizontal"
			label=""
		/>
	</div>

	<!-- line width -->
	<div class="flex flex-col items-start gap-3">
		<label class="flex items-center gap-2 text-base font-semibold" for="lineWidthRange">
			Line width <span class="text-sm font-normal text-gray-600 dark:text-gray-300"
				>({strokeWidth})</span
			>
		</label>
		<Range
			id="lineWidthRange"
			min={1}
			max={10}
			step={1}
			bind:value={strokeWidth}
			class="w-full lg:w-32"
		/>
	</div>

	<hr class="my-2 border-t border-gray-300 dark:border-gray-700" />
	<p class="text-sm font-semibold text-gray-700 dark:text-gray-300">File Format</p>

	<!-- Toggle with proper labels -->
	<Toggle checked={exportMode === 'svg'} onclick={toggleExportMode}>
		{#snippet offLabel()}
			PNG
		{/snippet}
		SVG
	</Toggle>

	<Button class="mt-2 w-full" pill color="primary" onclick={() => dispatch('export')}>
		<DownloadSolid class="mr-2 h-5 w-5" />
		Download {exportMode.toUpperCase()}
	</Button>
</div>
