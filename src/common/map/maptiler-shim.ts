// Shim for @maptiler/sdk using maplibre-gl when APN is enabled
// Expose a subset of @maptiler/sdk API used in the app

import maplibregl, { Map as MLMap, NavigationControl, GeolocateControl, ScaleControl, LngLatBounds, FullscreenControl } from 'maplibre-gl'

// Maptiler SDK exposes Map with extra helpers like setLanguage. Provide a no-op.
// Attach to prototype so instances support the call.
;(MLMap as any).prototype.setLanguage = function (_lang: any) {}

export { MLMap as Map, NavigationControl, GeolocateControl, ScaleControl, LngLatBounds, FullscreenControl }

// Dummy config object to satisfy `config.apiKey = ...`
export const config: { apiKey?: string } = {}

// Minimal enums/constants used in code
export const GeolocationType = {
	COUNTRY: 'country',
} as const

export const Language = {
	PERSIAN: 'fa',
} as const

// No-op for RTL plugin setter to keep call sites intact
export const setRTLTextPlugin = (url: string, callback?: any) => (maplibregl as any)?.setRTLTextPlugin?.(url, callback)

// Note: Other @maptiler/sdk-only options passed to Map constructor are ignored by maplibre-gl

