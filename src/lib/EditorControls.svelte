<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { Button, Range } from 'flowbite-svelte';
	import { DownloadSolid } from 'flowbite-svelte-icons';

	export let strokeColor: string;
	export let strokeWidth: number;
	export let bgColorChoice: string;

	const dispatch = createEventDispatcher();
</script>

<div
	class="dark:border-primary-700 dark:bg-primary-900/30 flex flex-col gap-6 rounded-lg border bg-white/40 p-4"
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
		<label class="text-base font-semibold" for="lineWidthRange">Line width</label>
		<Range
			id="lineWidthRange"
			min={1}
			max={10}
			step={1}
			bind:value={strokeWidth}
			class="w-full lg:w-32"
		/>
	</div>

	<!-- export -->
	<div class="flex items-center gap-4 self-start">
		<Button pill color="primary" onclick={() => dispatch('exportPNG')}>
			<DownloadSolid class="mr-2 h-5 w-5" /> Export PNG
		</Button>
		<Button pill color="secondary" onclick={() => dispatch('exportSVG')}>
			<DownloadSolid class="mr-2 h-5 w-5" /> Export SVG
		</Button>
	</div>
</div>
