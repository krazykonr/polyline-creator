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

	$: if (fileContent !== null) {
		try {
			coords = parseGpxToCoords(fileContent);
			const doc = new DOMParser().parseFromString(fileContent, 'application/xml');
			const nameNode =
				doc.querySelector('trk > name') ??
				doc.querySelector('metadata > name') ??
				doc.querySelector('name');
			activityName = nameNode?.textContent?.trim() || null;
		} catch {
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

	function exportPNG() {
		if (!toPngFn) return;
		const svgEl = document.getElementById('polyline-svg') as SVGElement | null;
		if (!svgEl) return;

		toPngFn(svgEl, {
			backgroundColor: bgColor === 'transparent' ? undefined : bgColor
		})
			.then((dataUrl) => {
				const link = document.createElement('a');
				link.download = 'polyline.png';
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => console.log('[Editor] PNG download failed', err));
	}

	function exportSVG() {
		const svgEl = document.getElementById('polyline-svg') as SVGElement | null;
		if (!svgEl) return;

		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svgEl);
		const blob = new Blob([svgString], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'polyline.svg';
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

{#if coords.length > 0}
	<div
		class="from-primary-100 to-secondary-200 border-primary-500 dark:from-primary-700 dark:to-primary-900 dark:border-secondary-500 relative mx-auto
		       flex max-h-[90vh] w-full flex-col
		       gap-6 rounded-lg border-4
		       bg-gradient-to-br p-6 shadow-lg
		       lg:w-3/4 xl:w-2/3"
	>
		<!-- header -->
		<div class="flex w-full items-center justify-between">
			<h2 class="text-primary-900 dark:text-primary-50 truncate text-lg font-semibold">
				{activityName ?? selectedFile?.name}
			</h2>

			<!-- clear button -->
			<Button
				color="secondary"
				pill
				size="sm"
				onclick={() => {
					console.log('[EditorWindow] Dispatching clear event');
					dispatch('clear');
				}}
			>
				Clear File
			</Button>
		</div>

		<!-- two-column desktop layout -->
		<div class="w-full lg:grid lg:grid-cols-2 lg:gap-8">
			<!-- Controls -->
			<EditorControls
				bind:strokeColor
				bind:strokeWidth
				bind:bgColorChoice
				on:exportPNG={exportPNG}
				on:exportSVG={exportSVG}
			/>

			<!-- SVG preview -->
			<div class="flex items-center justify-center">
				<PolylineSVG id="polyline-svg" {coords} {strokeColor} {strokeWidth} {bgColor} />
			</div>
		</div>
	</div>
{:else if fileContent !== null}
	<p class="text-gray-500">No coordinates found in file.</p>
{/if}
