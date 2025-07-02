<script lang="ts">
	/* External state */
	import { fileContent, selectedFile } from '$lib/stores/fileStore';

	/* Utilities & display */
	import PolylineSVG from '$lib/PolylineSVG.svelte';
	import { parseGpxToCoords, type LatLng } from '$lib/utils/polyline';

	/* Flowbite */
	import { Button, Toggle, Range, Label } from 'flowbite-svelte';
	import { XSolid } from 'flowbite-svelte-icons';

	/* Colour picker */
	import ColorPicker from 'svelte-awesome-color-picker';

	/* PNG export helper */
	import pkg from 'save-svg-as-png';
	const { saveSvgAsPng } = pkg;

	/*‑‑ State --------------------------------------------------------------*/
	let coords: LatLng[] = [];

	/* line */
	let strokeColor = '#ff0000';
	let strokeWidth = 2;

	/* background */
	let bgColorChoice = '#ffffff';
	let showBackground = false;
	$: bgColor = showBackground ? bgColorChoice : 'transparent';

	/* activity title */
	let activityName: string | null = null;

	/* Whenever the loaded file (text) changes, (1) parse coords, (2) grab name */
	$: if ($fileContent !== null) {
		try {
			coords = parseGpxToCoords($fileContent);

			// Try to extract <name> from GPX
			const doc = new DOMParser().parseFromString($fileContent, 'application/xml');
			const nameNode =
				doc.querySelector('trk > name') ??
				doc.querySelector('metadata > name') ??
				doc.querySelector('name');
			activityName = nameNode?.textContent?.trim() || null;
		} catch {
			coords = [];
			activityName = null;
		}
	}

	function exportPNG() {
		const svgEl = document.getElementById('polyline-svg') as SVGElement | null;
		if (svgEl) {
			saveSvgAsPng(svgEl, 'polyline.png', {
				backgroundColor: bgColor === 'transparent' ? undefined : bgColor
			});
		}
	}

	function removeActivity() {
		selectedFile.set(null);
		fileContent.set(null);
	}
</script>

{#if coords.length > 0}
	<!--‑‑ EDITOR CONTAINER ----------------------------------------------->
	<div
		class="border-primary-500 bg-primary-100 dark:border-secondary-500 dark:bg-primary-800 mx-auto flex max-w-fit flex-col
		       items-center gap-6 rounded-lg border-4 p-6
		       shadow-lg"
	>
		<!-- Header: file / activity title + close button -->
		<div class="flex w-full items-center justify-between gap-4">
			<h2 class="text-primary-800 dark:text-primary-50 truncate text-lg font-semibold">
				{activityName ?? $selectedFile?.name}
			</h2>

			<Button color="failure" size="sm" pill on:click={removeActivity} aria-label="Close">
				<XSolid class="h-5 w-5" />
			</Button>
		</div>

		<!-- SVG preview -->
		<PolylineSVG id="polyline-svg" class="mx-auto" {coords} {strokeColor} {strokeWidth} {bgColor} />

		<!-- Controls -->
		<div class="flex flex-wrap justify-center gap-8">
			<!-- Line colour -->
			<div class="flex flex-col items-center gap-2">
				<Label>Line&nbsp;colour</Label>
				<ColorPicker bind:hex={strokeColor} position="responsive" isAlpha={false} />
			</div>

			<!-- Background colour + toggle -->
			<div class="flex flex-col items-center gap-2">
				<Label>Background</Label>
				<ColorPicker bind:hex={bgColorChoice} position="responsive" isAlpha={false} />
				<Toggle id="bgToggle" bind:checked={showBackground}>Show</Toggle>
			</div>

			<!-- Line width slider -->
			<div class="flex w-48 flex-col items-center gap-2">
				<Label for="lineWidthRange">Line&nbsp;width</Label>
				<Range
					id="lineWidthRange"
					min={1}
					max={10}
					step={1}
					bind:value={strokeWidth}
					class="w-full"
				/>
			</div>

			<!-- Export button -->
			<div class="flex items-end">
				<Button on:click={exportPNG} color="primary">Export&nbsp;PNG</Button>
			</div>
		</div>
	</div>
{:else if $fileContent !== null}
	<p class="text-gray-500">No coordinates found in file.</p>
{/if}
