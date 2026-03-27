<template>
	<div class="interactive-map">
		<div class="map-controls angled-corner">
			<div class="control-group">
				<label class="control-label">
					<span class="label-text">SEA LEVEL</span>
					<span class="label-value">+{{ seaLevel }}m</span>
				</label>
				<input
					type="range"
					v-model.number="seaLevel"
					min="0"
					max="30"
					step="0.5"
					class="sea-level-slider"
				/>
				<div class="slider-marks">
					<span>0m</span>
					<span>10m</span>
					<span>20m</span>
					<span>30m</span>
				</div>
			</div>
			<div class="flood-status" :class="{ 'flood-status--critical': seaLevel >= 13 }">
				<span v-if="seaLevel === 0">Current sea level</span>
				<span v-else-if="seaLevel < 5">Minor coastal flooding</span>
				<span v-else-if="seaLevel < 10">Significant flooding</span>
				<span v-else-if="seaLevel < 13">Severe flooding</span>
				<span v-else-if="seaLevel < 20">CRITICAL: 2050 projected level</span>
				<span v-else>CATASTROPHIC: Total inundation</span>
			</div>
		</div>
		<div ref="mapContainer" class="map-container"></div>
		<canvas ref="floodCanvas" class="flood-overlay"></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

// Helsinki coordinates
const HELSINKI_CENTER: [number, number] = [24.9384, 60.1699]
const DEFAULT_ZOOM = 11.5

const mapContainer = ref<HTMLDivElement | null>(null)
const floodCanvas = ref<HTMLCanvasElement | null>(null)
const seaLevel = ref(0)

let map: maplibregl.Map | null = null
let isRendering = false

// Terrain tile configuration - using AWS Terrain Tiles (Terrarium format)
// Elevation = (red * 256 + green + blue / 256) - 32768
const TERRAIN_TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"

// Cache for terrain tile images
const terrainTileCache = new Map<string, HTMLImageElement>()

// Calibration offset - the terrain data reports 16.5m as sea level
const ELEVATION_OFFSET = 16.5

function terrariumToElevation(r: number, g: number, b: number): number {
	const rawElevation = (r * 256 + g + b / 256) - 32768
	return rawElevation - ELEVATION_OFFSET
}

// Convert lat/lng to tile coordinates (returns fractional values)
function latLngToTileCoords(lat: number, lng: number, zoom: number): { x: number; y: number } {
	const n = Math.pow(2, zoom)
	const x = (lng + 180) / 360 * n
	const latRad = lat * Math.PI / 180
	const y = (1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n
	return { x, y }
}

// Convert tile coordinates to lat/lng
function tileCoordsToLatLng(x: number, y: number, zoom: number): { lat: number; lng: number } {
	const n = Math.pow(2, zoom)
	const lng = x / n * 360 - 180
	const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)))
	const lat = latRad * 180 / Math.PI
	return { lat, lng }
}

async function loadTerrainTileImage(z: number, x: number, y: number): Promise<HTMLImageElement | null> {
	const key = `${z}/${x}/${y}`
	if (terrainTileCache.has(key)) {
		return terrainTileCache.get(key)!
	}

	return new Promise((resolve) => {
		const img = new Image()
		img.crossOrigin = "anonymous"
		img.onload = () => {
			terrainTileCache.set(key, img)
			resolve(img)
		}
		img.onerror = () => resolve(null)
		img.src = TERRAIN_TILE_URL
			.replace("{z}", z.toString())
			.replace("{x}", x.toString())
			.replace("{y}", y.toString())
	})
}

function processTerrainTile(
	img: HTMLImageElement,
	level: number
): ImageData {
	const tileCanvas = document.createElement("canvas")
	tileCanvas.width = 256
	tileCanvas.height = 256
	const tileCtx = tileCanvas.getContext("2d")!

	// Draw terrain tile to read elevation data
	tileCtx.drawImage(img, 0, 0)
	const terrainData = tileCtx.getImageData(0, 0, 256, 256)

	// Create flood overlay for this tile
	const floodData = tileCtx.createImageData(256, 256)

	for (let i = 0; i < terrainData.data.length; i += 4) {
		const r = terrainData.data[i]
		const g = terrainData.data[i + 1]
		const b = terrainData.data[i + 2]
		const elevation = terrariumToElevation(r, g, b)

		if (elevation <= level && elevation > -100) {
			// Flooded/underwater - cyan with depth-based opacity
			const depth = Math.max(0, level - elevation)
			const opacity = Math.min(0.75, 0.4 + depth * 0.03)
			floodData.data[i] = 0        // R
			floodData.data[i + 1] = 220  // G
			floodData.data[i + 2] = 255  // B
			floodData.data[i + 3] = Math.floor(opacity * 255)
		} else if (elevation <= level + 2 && elevation > level) {
			// At risk - cyan with lower opacity
			floodData.data[i] = 0        // R
			floodData.data[i + 1] = 220  // G
			floodData.data[i + 2] = 255  // B
			floodData.data[i + 3] = 50   // Lower opacity than flooded
		}
		// else: transparent (already 0)
	}

	return floodData
}

async function renderFloodOverlay() {
	if (!map || !floodCanvas.value || isRendering) return

	isRendering = true

	const canvas = floodCanvas.value
	const ctx = canvas.getContext("2d")
	if (!ctx) {
		isRendering = false
		return
	}

	const container = map.getContainer()
	canvas.width = container.clientWidth
	canvas.height = container.clientHeight

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const bounds = map.getBounds()
	const zoom = map.getZoom()
	const terrainZoom = Math.min(Math.floor(zoom), 13)

	// Get tile range for current view
	const nwCoords = latLngToTileCoords(bounds.getNorth(), bounds.getWest(), terrainZoom)
	const seCoords = latLngToTileCoords(bounds.getSouth(), bounds.getEast(), terrainZoom)

	const minTileX = Math.floor(nwCoords.x)
	const maxTileX = Math.floor(seCoords.x)
	const minTileY = Math.floor(nwCoords.y)
	const maxTileY = Math.floor(seCoords.y)

	// Load all visible terrain tiles
	const tilePromises: Promise<{
		tileX: number
		tileY: number
		img: HTMLImageElement | null
	}>[] = []

	for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
		for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
			tilePromises.push(
				loadTerrainTileImage(terrainZoom, tileX, tileY).then(img => ({
					tileX,
					tileY,
					img
				}))
			)
		}
	}

	const tiles = await Promise.all(tilePromises)
	const level = seaLevel.value

	// Process and render each tile
	for (const { tileX, tileY, img } of tiles) {
		if (!img) continue

		// Calculate where this tile should be drawn on the canvas
		// Get the lat/lng of tile corners
		const tileNW = tileCoordsToLatLng(tileX, tileY, terrainZoom)
		const tileSE = tileCoordsToLatLng(tileX + 1, tileY + 1, terrainZoom)

		// Project to screen coordinates
		const screenNW = map.project([tileNW.lng, tileNW.lat])
		const screenSE = map.project([tileSE.lng, tileSE.lat])

		const screenX = screenNW.x
		const screenY = screenNW.y
		const screenWidth = screenSE.x - screenNW.x
		const screenHeight = screenSE.y - screenNW.y

		// Process terrain data to create flood overlay
		const floodData = processTerrainTile(img, level)

		// Create temporary canvas for this tile's flood data
		const tileCanvas = document.createElement("canvas")
		tileCanvas.width = 256
		tileCanvas.height = 256
		const tileCtx = tileCanvas.getContext("2d")!
		tileCtx.putImageData(floodData, 0, 0)

		// Draw the flood tile at the correct position and scale
		ctx.drawImage(
			tileCanvas,
			0, 0, 256, 256,
			screenX, screenY, screenWidth, screenHeight
		)
	}

	isRendering = false
}

// Debounced render function
let renderTimeout: number | null = null
function debouncedRender() {
	if (renderTimeout) {
		clearTimeout(renderTimeout)
	}
	renderTimeout = window.setTimeout(() => {
		renderFloodOverlay()
	}, 50)
}

function initMap() {
	if (!mapContainer.value) return

	map = new maplibregl.Map({
		container: mapContainer.value,
		style: {
			version: 8,
			sources: {
				"carto-dark": {
					type: "raster",
					tiles: [
						"https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
						"https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
						"https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
						"https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
					],
					tileSize: 256,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
				}
			},
			layers: [
				{
					id: "carto-dark-layer",
					type: "raster",
					source: "carto-dark",
					paint: {
						"raster-saturation": -0.5,
						"raster-brightness-min": 0.15,
						"raster-brightness-max": 1,
						"raster-contrast": 0.1
					}
				}
			]
		},
		center: HELSINKI_CENTER,
		zoom: DEFAULT_ZOOM,
		maxZoom: 16,
		minZoom: 9
	})

	map.addControl(new maplibregl.NavigationControl(), "bottom-right")

	map.on("load", () => {
		renderFloodOverlay()
	})

	map.on("moveend", debouncedRender)
	map.on("move", debouncedRender)
}

watch(seaLevel, () => {
	debouncedRender()
})

onMounted(() => {
	initMap()
})

onUnmounted(() => {
	if (renderTimeout) {
		clearTimeout(renderTimeout)
	}
	if (map) {
		map.remove()
		map = null
	}
})
</script>

<style scoped lang="scss">
$primary: #ff047b;
$cyan: #00f0ff;

.interactive-map {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}

.map-container {
	width: 100%;
	height: 100%;
	background: #0d0d0d;
}

.flood-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
}

.map-controls {
	position: absolute;
	top: 1rem;
	left: 1rem;
	z-index: 1000;
	padding: 1rem;
	min-width: 220px;
}

.control-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.control-label {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.label-text {
	color: #888;
}

.label-value {
	color: $cyan;
	font-weight: bold;
	font-family: monospace;
	font-size: 1rem;
}

.sea-level-slider {
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 4px;
	background: linear-gradient(to right, #333, $cyan);
	outline: none;
	cursor: pointer;

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		background: $primary;
		cursor: pointer;
		clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
	}

	&::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: $primary;
		cursor: pointer;
		border: none;
		clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
	}
}

.slider-marks {
	display: flex;
	justify-content: space-between;
	font-size: 0.6rem;
	color: #555;
	margin-top: 0.25rem;
}

.flood-status {
	margin-top: 0.75rem;
	padding: 0.5rem;
	background: rgba(0, 240, 255, 0.1);
	border-left: 2px solid $cyan;
	font-size: 0.7rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: $cyan;

	&--critical {
		background: rgba(255, 4, 123, 0.2);
		border-left-color: $primary;
		color: $primary;
		animation: pulse 1s ease-in-out infinite;
	}
}

:deep(.maplibregl-ctrl-group) {
	background: rgba(0, 0, 0, 0.8);
	border: 1px solid $cyan;

	button {
		background-color: transparent;

		&:hover {
			background-color: rgba(0, 240, 255, 0.2);
		}

		.maplibregl-ctrl-icon {
			filter: invert(1) sepia(1) saturate(5) hue-rotate(150deg);
		}
	}

	button + button {
		border-top: 1px solid rgba(0, 240, 255, 0.3);
	}
}

:deep(.maplibregl-ctrl-attrib) {
	background: rgba(0, 0, 0, 0.7);
	color: #666;
	font-size: 10px;

	a {
		color: $cyan;
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.6;
	}
}

@media (max-width: 768px) {
	.map-controls {
		min-width: 180px;
		padding: 0.75rem;
	}
}
</style>
