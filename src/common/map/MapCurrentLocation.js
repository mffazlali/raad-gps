import maplibregl from 'maplibre-gl'
import * as maptilersdk from '@maptiler/sdk'
import { useEffect } from 'react'
import { map } from './core/MapView'

const MapCurrentLocation = () => {
  useEffect(() => {
    const control = new maptilersdk.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
      trackUserLocation: true,
    })
    map.addControl(control,'top-left')
    return () => map.removeControl(control)
  }, [])

  return null
}

export default MapCurrentLocation
