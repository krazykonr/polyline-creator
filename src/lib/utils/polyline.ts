export type LatLng = [number, number];

/**
 * Extracts coordinates from a GPX string.
 * NOTE: Only handles <trkpt lat="…" lon="…"> nodes for now.
 */
export function parseGpxToCoords(xml: string): LatLng[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xml, 'application/xml');
	const trkpts = Array.from(doc.getElementsByTagName('trkpt'));
	return trkpts
		.map((pt) => {
			const lat = parseFloat(pt.getAttribute('lat') ?? '');
			const lon = parseFloat(pt.getAttribute('lon') ?? '');
			return [lat, lon] as LatLng;
		})
		.filter(([lat, lon]) => !isNaN(lat) && !isNaN(lon));
}

/**
 * Google polyline encoding.
 */
export function encodePolyline(coords: LatLng[]): string {
	let prevLat = 0;
	let prevLon = 0;
	let result = '';

	for (const [lat, lon] of coords) {
		const latE5 = Math.round(lat * 1e5);
		const lonE5 = Math.round(lon * 1e5);

		result += encodeValue(latE5 - prevLat);
		result += encodeValue(lonE5 - prevLon);

		prevLat = latE5;
		prevLon = lonE5;
	}

	return result;
}

function encodeValue(value: number): string {
	let v = value < 0 ? ~(value << 1) : value << 1;
	let chunk = '';

	while (v >= 0x20) {
		chunk += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
		v >>= 5;
	}
	chunk += String.fromCharCode(v + 63);
	return chunk;
}
