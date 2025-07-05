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

	async function exportImage(format: 'png' | 'svg') {
		const svgEl = document.getElementById('polyline-svg') as SVGElement | null;
		if (!svgEl) return;

		try {
			let blob: Blob;
			let extension = format;
			let mimeType = format === 'svg' ? 'image/svg+xml' : 'image/png';

			if (format === 'png') {
				if (!toPngFn) {
					console.error('[Editor] PNG export failed: toPngFn not loaded');
					return;
				}

				const dataUrl = await toPngFn(svgEl, {
					backgroundColor: bgColor === '#ffffff00' ? undefined : bgColor
				});

				// Convert data URL to blob correctly
				const byteString = atob(dataUrl.split(',')[1]);
				const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

				const ab = new ArrayBuffer(byteString.length);
				const ia = new Uint8Array(ab);
				for (let i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				blob = new Blob([ab], { type: mimeString });
			} else {
				const serializer = new XMLSerializer();
				const svgString = serializer.serializeToString(svgEl);
				blob = new Blob([svgString], { type: mimeType });
			}

			// Generate filename
			const filename = activityName
				? `${activityName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`
				: `polyline.${extension}`;

			// Try to use File System Access API first (gives user control over save location)
			if ('showSaveFilePicker' in window) {
				try {
					const handle = await window.showSaveFilePicker({
						suggestedName: filename,
						types: [
							{
								description: `${format.toUpperCase()} Image`,
								accept: { [mimeType]: [`.${extension}`] }
							}
						]
					});

					const writable = await handle.createWritable();
					await writable.write(blob);
					await writable.close();

					console.log(
						`[Editor] ${format.toUpperCase()} export successful (File System Access API)`
					);
					return;
				} catch (err) {
					// User cancelled or API not supported, fall through to download method
					if (err.name !== 'AbortError') {
						console.warn('[Editor] File System Access API failed, falling back to download:', err);
					}
				}
			}

			// Fallback to traditional download
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up the URL after a short delay
			setTimeout(() => URL.revokeObjectURL(url), 100);

			console.log(`[Editor] ${format.toUpperCase()} export successful (download method)`);
		} catch (err) {
			console.error(`[Editor] ${format.toUpperCase()} export failed`, err);
			// Optionally show user-friendly error
			alert(`Failed to export ${format.toUpperCase()} file. Please try again.`);
		}
	}

	function handleExport() {
		exportImage(exportMode);
	}

	// Window dimensions
	let windowWidth = 0;
	let windowHeight = 0;

	// Determine if we're on mobile based on viewport width
	$: isMobile = windowWidth < 1024;

	// Calculate SVG size for mobile
	function calculateMobileSvgSize() {
		if (!isMobile) return { width: 400, height: 400 };

		const navbarHeight = 64;
		const footerHeight = 80;
		const totalPadding = 32 + 48 + 32; // page + editor + svg container
		const headerHeight = 60;
		const controlsHeight = 320; // Increased to account for Clear File button
		const gaps = 48;
		const safetyMargin = 40;

		const usedHeight =
			navbarHeight +
			footerHeight +
			totalPadding +
			headerHeight +
			controlsHeight +
			gaps +
			safetyMargin;
		const availableHeight = windowHeight - usedHeight;

		// Also consider width constraints
		const maxWidth = windowWidth - 80; // Account for padding

		// Use the smaller dimension to maintain square aspect ratio
		// Allow it to scale up with available height, not just limited to 400
		const size = Math.max(200, Math.min(availableHeight, maxWidth));

		return { width: size, height: size };
	}

	$: svgSize = calculateMobileSvgSize();
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

{#if coords.length > 0}
	<div
		class="from-primary-100 to-secondary-200 border-primary-500 dark:from-primary-700 dark:to-primary-900 dark:border-secondary-500
			relative mx-auto flex max-h-[90vh] w-full max-w-[1000px] flex-col gap-6 rounded-lg
			border-4 bg-gradient-to-br p-6 shadow-lg"
	>
		<!-- layout -->
		<div class="flex w-full flex-1 flex-col gap-6 lg:flex-row lg:items-stretch">
			{#if isMobile}
				<!-- Mobile layout - flex column that fills height -->
				<div class="flex flex-1 flex-col gap-4">
					<!-- Mobile header -->
					<div class="flex w-full items-start justify-between gap-2">
						<div class="flex flex-col truncate">
							<h2 class="text-primary-900 dark:text-primary-50 truncate text-xl font-bold">
								{activityName || 'Untitled Activity'}
							</h2>
							{#if selectedFile?.name && activityName !== selectedFile?.name}
								<p class="truncate text-base text-gray-600 dark:text-gray-300">
									{selectedFile.name}
								</p>
							{/if}
						</div>
					</div>

					<!-- Compact mobile controls -->
					<EditorControls
						bind:strokeColor
						bind:strokeWidth
						bind:bgColorChoice
						bind:exportMode
						on:export={handleExport}
						on:clear={() => dispatch('clear')}
						mobile={true}
					/>

					<!-- Mobile SVG preview - fills remaining height -->
					<div class="flex flex-1 items-center justify-center">
						<div
							class="flex h-full w-full max-w-full items-center justify-center rounded-md border border-gray-300 bg-white p-4 shadow-md dark:border-gray-600 dark:bg-gray-800"
							style="max-width: min(calc(100vw - 80px), {svgSize.width}px); max-height: {svgSize.height}px;"
						>
							<div class="relative h-full w-full [&>svg]:h-full [&>svg]:w-full">
								<PolylineSVG
									id="polyline-svg"
									{coords}
									{strokeColor}
									{strokeWidth}
									{bgColor}
									width={svgSize.width}
									height={svgSize.height}
								/>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Desktop layout -->
				<div class="flex w-full flex-col">
					<!-- Main content row first to establish the layout -->
					<div class="flex flex-col">
						<!-- Header row constrained to content width -->
						<div class="mb-4 flex items-start justify-between">
							<!-- Activity name and file name -->
							<div class="flex flex-col">
								<h2 class="text-primary-900 dark:text-primary-50 text-2xl font-bold">
									{activityName || 'Untitled Activity'}
								</h2>
								{#if selectedFile?.name && activityName !== selectedFile?.name}
									<p class="text-sm text-gray-600 dark:text-gray-300">
										{selectedFile.name}
									</p>
								{/if}
							</div>

							<!-- Clear File button -->
							<Button
								size="xl"
								class="bg-red-500 px-6 py-3 text-base font-semibold hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-400"
								onclick={() => dispatch('clear')}
							>
								Clear File
							</Button>
						</div>

						<!-- Content row -->
						<div class="flex items-stretch gap-6">
							<!-- Controls column -->
							<div class="flex w-1/3">
								<EditorControls
									bind:strokeColor
									bind:strokeWidth
									bind:bgColorChoice
									bind:exportMode
									on:export={handleExport}
									mobile={false}
									class="flex-1"
								/>
							</div>

							<!-- Desktop SVG preview -->
							<div class="flex w-2/3 items-center justify-end">
								<div
									class="flex h-full items-center rounded-md border border-gray-300 bg-white p-4 shadow-md dark:border-gray-600 dark:bg-gray-800"
								>
									<PolylineSVG id="polyline-svg" {coords} {strokeColor} {strokeWidth} {bgColor} />
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else if fileContent !== null}
	<p class="text-gray-500">No coordinates found in file.</p>
{/if}
