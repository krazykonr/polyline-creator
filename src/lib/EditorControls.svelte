<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { Button, Range, Toggle } from 'flowbite-svelte';
	import { DownloadSolid } from 'flowbite-svelte-icons';

	export let strokeColor: string;
	export let strokeWidth: number;
	export let bgColorChoice: string;
	export let exportMode: 'png' | 'svg';
	export let mobile = false;

	// Accept additional classes
	let className = '';
	export { className as class };

	const dispatch = createEventDispatcher();

	function toggleExportMode() {
		exportMode = exportMode === 'png' ? 'svg' : 'png';
	}
</script>

{#if mobile}
	<!-- Mobile horizontal layout -->
	<div
		class="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-800 {className}"
	>
		<!-- Color controls row -->
		<div class="flex gap-4">
			<!-- Line color -->
			<div class="flex flex-1 flex-col items-center">
				<label class="mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">Line</label>
				<div class="relative h-20 w-20">
					<!-- Drop shadow circle -->
					<div class="absolute top-1 left-1 h-full w-full rounded-full bg-black/15"></div>
					<!-- Color picker without wrapper div -->
					<ColorPicker
						bind:hex={strokeColor}
						position="responsive"
						components={ChromeVariant}
						sliderDirection="horizontal"
						label=""
						--input-size="80px"
						class="relative overflow-hidden rounded-full border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
					/>
				</div>
			</div>

			<!-- Background -->
			<div class="flex flex-1 flex-col items-center">
				<label class="mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">BG</label>
				<div class="relative h-20 w-20">
					<!-- Drop shadow circle -->
					<div class="absolute top-1 left-1 h-full w-full rounded-full bg-black/15"></div>
					<!-- Color picker without wrapper div -->
					<ColorPicker
						bind:hex={bgColorChoice}
						position="responsive"
						components={ChromeVariant}
						sliderDirection="horizontal"
						label=""
						--input-size="80px"
						class="relative overflow-hidden rounded-full border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
					/>
				</div>
			</div>
		</div>

		<!-- Line width -->
		<div class="flex flex-1 items-center gap-2">
			<label class="text-base font-semibold text-gray-700 dark:text-gray-200" for="lineWidthRange">
				Width <span class="text-sm font-normal text-gray-600 dark:text-gray-400"
					>({strokeWidth})</span
				>
			</label>
			<Range
				id="lineWidthRange"
				min={1}
				max={10}
				step={1}
				bind:value={strokeWidth}
				class="flex-1"
			/>
		</div>

		<!-- Format toggle -->
		<div class="flex h-12 items-center justify-center">
			<Toggle class="xl" checked={exportMode === 'svg'} onclick={toggleExportMode}>
				{#snippet offLabel()}
					PNG
				{/snippet}
				SVG
			</Toggle>
		</div>

		<!-- Download button -->
		<Button class="w-full" pill color="primary" onclick={() => dispatch('export')}>
			<DownloadSolid class="mr-2 h-5 w-5" />
			Download {exportMode.toUpperCase()}
		</Button>

		<!-- Clear File button for mobile -->
		<Button
			class="w-full bg-red-500 hover:bg-red-400 dark:bg-red-500 dark:hover:bg-red-400"
			pill
			onclick={() => dispatch('clear')}
		>
			Clear File
		</Button>
	</div>
{:else}
	<!-- Desktop vertical layout - now fills height -->
	<div
		class="flex h-full flex-col justify-between gap-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800 {className}"
	>
		<div class="flex flex-col gap-6">
			<!-- Color controls row - now horizontal on desktop too -->
			<div class="flex gap-4">
				<!-- Line color -->
				<div class="flex flex-1 flex-col items-center">
					<label class="mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">Line</label>
					<div class="relative h-20 w-20">
						<!-- Drop shadow circle -->
						<div class="absolute top-1 left-1 h-full w-full rounded-full bg-black/15"></div>
						<!-- Color picker without wrapper div -->
						<ColorPicker
							bind:hex={strokeColor}
							position="responsive"
							components={ChromeVariant}
							sliderDirection="horizontal"
							label=""
							--input-size="80px"
							class="relative overflow-hidden rounded-full border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
						/>
					</div>
				</div>

				<!-- Background -->
				<div class="flex flex-1 flex-col items-center">
					<label class="mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">BG</label>
					<div class="relative h-20 w-20">
						<!-- Drop shadow circle -->
						<div class="absolute top-1 left-1 h-full w-full rounded-full bg-black/15"></div>
						<!-- Color picker without wrapper div -->
						<ColorPicker
							bind:hex={bgColorChoice}
							position="responsive"
							components={ChromeVariant}
							sliderDirection="horizontal"
							label=""
							--input-size="80px"
							class="relative overflow-hidden rounded-full border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
						/>
					</div>
				</div>
			</div>

			<!-- line width -->
			<div class="flex flex-col items-start gap-3">
				<label
					class="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-200"
					for="lineWidthRange"
				>
					Line width <span class="text-sm font-normal text-gray-600 dark:text-gray-400"
						>({strokeWidth})</span
					>
				</label>
				<Range
					id="lineWidthRange"
					min={1}
					max={10}
					step={1}
					bind:value={strokeWidth}
					class="w-full"
				/>
			</div>

			<hr class="my-2 border-t border-gray-300 dark:border-gray-600" />

			<div class="flex h-12 items-center justify-center">
				<!-- Toggle with proper labels -->
				<Toggle checked={exportMode === 'svg'} onclick={toggleExportMode}>
					{#snippet offLabel()}
						PNG
					{/snippet}
					SVG
				</Toggle>
			</div>
		</div>

		<!-- Download button at bottom -->
		<Button class="w-full" pill color="primary" onclick={() => dispatch('export')}>
			<DownloadSolid class="mr-2 h-5 w-5" />
			Download {exportMode.toUpperCase()}
		</Button>
	</div>
{/if}
