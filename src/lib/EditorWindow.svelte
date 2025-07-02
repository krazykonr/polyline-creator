<script lang="ts">
	import { onMount } from 'svelte';
	import { fileContent, selectedFile } from '$lib/stores/fileStore';
	import { fileInputEl } from '$lib/stores/fileInputStore';
	import PolylineSVG from '$lib/PolylineSVG.svelte';
	import { parseGpxToCoords, type LatLng } from '$lib/utils/polyline';

	/* Flowbite */
	import { Button, Range } from 'flowbite-svelte';
	import { DownloadSolid, FileSolid } from 'flowbite-svelte-icons';

	/* Colour picker */
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';

	/* ── state ──────────────────────────────────────────────────────────── */
	let coords: LatLng[] = [];

	let strokeColor = '#ff0000';
	let strokeWidth = 2;

	let bgColorChoice = '#ffffff';
	$: bgColor = bgColorChoice;

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

	/* PNG helper – imported only in the browser */
	import type { toPng } from 'html-to-image';
	let toPngFn: typeof toPng | undefined;
	onMount(async () => {
		const mod = await import('html-to-image');
		toPngFn = mod.toPng;
		console.log('[Editor] html-to-image loaded ✔︎');
	});

	function exportPNG() {
		console.log('[Editor] Export PNG clicked');
		if (!toPngFn) {
			console.warn('[Editor] saveSvgAsPng not yet initialised');
			return;
		}
		const svgEl = document.getElementById('polyline-svg') as HTMLElement | null;
		console.log('[Editor] SVG element found?', !!svgEl);
		if (svgEl) {
			toPngFn(svgEl, {
				backgroundColor: bgColor === 'transparent' ? undefined : bgColor
			})
				.then((dataUrl) => {
					const link = document.createElement('a');
					link.download = 'polyline.png';
					link.href = dataUrl;
					link.click();
					console.log('[Editor] PNG download triggered');
				})
				.catch((err) => console.log('[Editor] PNG download failed', err));
			console.log('[Editor] saveSvgAsPng invoked');
		}
	}

	/* programmatically open the drop-zone file picker */
	function pickAnotherFile() {
		console.log('[Editor] Pick another file clicked');
		let inputEl: HTMLInputElement | null;
		const unsub = fileInputEl.subscribe((el) => (inputEl = el));
		unsub();
		if (inputEl) {
			inputEl.click();
			console.log('[Editor] file picker opened');
		} else {
			console.warn('[Editor] file input element not in store');
		}
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
				{activityName ?? $selectedFile?.name}
			</h2>

			<!-- new 'pick another file' button -->
			<Button color="secondary" pill size="sm" on:click={pickAnotherFile}>
				<FileSolid class="mr-2 h-5 w-5" /> Pick another file
			</Button>
		</div>

		<!-- two-column desktop layout -->
		<div class="w-full lg:grid lg:grid-cols-2 lg:gap-8">
			<!-- SETTINGS CARD -->
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
				<Button pill color="primary" on:click={exportPNG} class="self-start">
					<DownloadSolid class="mr-2 h-5 w-5" /> Export PNG
				</Button>
			</div>

			<!-- SVG preview -->
			<div class="flex items-center justify-center">
				<PolylineSVG id="polyline-svg" {coords} {strokeColor} {strokeWidth} {bgColor} />
			</div>
		</div>
	</div>
{:else if $fileContent !== null}
	<p class="text-gray-500">No coordinates found in file.</p>
{/if}
