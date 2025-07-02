<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import type { LatLng } from '$lib/utils/polyline';

	/** Coordinate list (lat, lon). */
	export let coords: LatLng[] = [];

	/** Presentation props. */
	export let width = 400;
	export let height = 400;
	export let strokeColor = '#ff0000';
	export let strokeWidth = 2;
	export let bgColor = 'transparent';
	export let id = 'polyline-svg';

	let pathStr = '';

	$: if (coords.length) {
		const lats = coords.map((c) => c[0]);
		const lons = coords.map((c) => c[1]);

		const x = scaleLinear()
			.domain([Math.min(...lons), Math.max(...lons)])
			.range([10, width - 10]);

		const y = scaleLinear()
			.domain([Math.min(...lats), Math.max(...lats)])
			.range([height - 10, 10]);

		pathStr = coords.map((c, i) => `${i ? 'L' : 'M'}${x(c[1])},${y(c[0])}`).join(' ');
	}
</script>

<svg {id} {width} {height} viewBox={`0 0 ${width} ${height}`}>
	<rect width="100%" height="100%" fill={bgColor} />
	<path d={pathStr} fill="none" stroke={strokeColor} stroke-width={strokeWidth} />
</svg>
