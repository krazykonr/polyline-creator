<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import PolylineSVG from '$lib/PolylineSVG.svelte';
	import EditorControls from '$lib/EditorControls.svelte';
	import { parseGpxToCoords, type LatLng } from '$lib/utils/polyline';
	import { Button } from 'flowbite-svelte';
	import type { toPng } from 'html-to-image';

	export let selectedFile: File | null;
	export let fileContent: string | null;

	const dispatch = createEventDispatcher();

	let coords: LatLng[] = [];
	let strokeColor = '#ff0000';
	let strokeWidth = 2;
	let bgColorChoice = '#ffffff00';
	$: bgColor = bgColorChoice;

	let activityName: string | null = null;
	let exportMode: 'png' | 'svg' = 'png';

	$: if (fileContent !== null) {
		try {
			coords = parseGpxToCoords(fileContent);
			const doc = new DOMParser().parseFromString(fileContent, 'application/xml');
			const nameNode =
				doc.querySelector('trk > name') ??
				doc.querySelector('metadata > name') ??
				doc.querySelector('name');
			activityName = nameNode?.textContent?.trim() || null;
		} catch (err) {
			console.warn('[Editor] Failed to parse GPX:', err);
			coords = [];
			activityName = null;
		}
	}

	let toPngFn: typeof toPng | undefined;

	onMount(async () => {
		const mod = await import('html-to-image');
		toPngFn = mod.toPng;
		console.log('[Editor] html-to-image loaded ✔︎');
	});

	function handleExport() {
		if (exportMode === 'png') {
			exportPNG();
		} else {
			exportSVG();
		}
	}

	async function exportPNG() {
		if (!toPngFn) return;

		const svgEl = document.getElementById('polyline-svg') as SVGElement | null;
		if (!svgEl) return;

		try {
			const dataUrl = await toPngFn(svgEl, {
				backgroundColor: bgColor === 'transparent' ? undefined : bgColor
			});

			const blob = await (await fetch(dataUrl)).blob();

			const fileHandle = await window.showSaveFilePicker({
				suggestedName: 'polyline.png',
				types: [
					{
						description: 'PNG Image',
						accept: { 'image/png': ['.png'] }
					}
				]
			});

			const writable = await fileHandle.createWritable();
			await writable.write(blob);
			await writable.close();
		} catch (err) {
			console.error('[Editor] PNG export failed', err);
		}
	}

	async function exportSVG() {
		const svgEl = document.getElementById('polyline-svg') as SVGElement | null;
		if (!svgEl) return;

		try {
			const serializer = new XMLSerializer();
			const svgString = serializer.serializeToString(svgEl);
			const blob = new Blob([svgString], { type: 'image/svg+xml' });

			const fileHandle = await window.showSaveFilePicker({
				suggestedName: 'polyline.svg',
				types: [
					{
						description: 'SVG File',
						accept: { 'image/svg+xml': ['.svg'] }
					}
				]
			});

			const writable = await fileHandle.createWritable();
			await writable.write(blob);
			await writable.close();
		} catch (err) {
			console.error('[Editor] SVG export failed', err);
		}
	}
</script>

{#if coords.length > 0}
	<div
		class="from-primary-100 to-secondary-200 border-primary-500 dark:from-primary-700 dark:to-primary-900 dark:border-secondary-500
			relative mx-auto flex max-h-[90vh] w-full max-w-[1000px] flex-col gap-6 rounded-lg
			border-4 bg-gradient-to-br p-6 shadow-lg"
	>
		<!-- header -->
		<div class="flex w-full items-start justify-between gap-2">
			<div class="flex flex-col truncate">
				<h2 class="text-primary-900 dark:text-primary-50 truncate text-xl font-bold">
					{activityName}
				</h2>
				{#if selectedFile?.name && activityName !== selectedFile?.name}
					<p class="truncate text-sm text-gray-600 dark:text-gray-300">{selectedFile.name}</p>
				{/if}
			</div>

			<Button color="secondary" pill size="xs" class="mt-2" onclick={() => dispatch('clear')}>
				Clear File
			</Button>
		</div>

		<!-- layout -->
		<div class="flex w-full flex-col gap-6 lg:flex-row">
			<!-- Controls -->
			<div class="w-full lg:w-1/3">
				<EditorControls
					bind:strokeColor
					bind:strokeWidth
					bind:bgColorChoice
					bind:exportMode
					on:export={handleExport}
				/>
			</div>

			<!-- SVG preview -->
			<div class="flex w-full items-center justify-center lg:w-2/3">
				<div
					class="dark:bg-primary-800 max-h-[70vh] max-w-full rounded-md border bg-white p-4 shadow-md"
				>
					<PolylineSVG id="polyline-svg" {coords} {strokeColor} {strokeWidth} {bgColor} />
				</div>
			</div>
		</div>
	</div>
{:else if fileContent !== null}
	<p class="text-gray-500">No coordinates found in file.</p>
{/if}
