import {useEffect, useState} from 'react'
import maplibregl from 'maplibre-gl'
import * as maptilersdk from '@maptiler/sdk'
import {map} from './core/MapView'

const MapCamera = ({
                     latitude = null,
                     longitude = null,
                     positions = [],
                     coordinates = [],
                     coordinatesActive = true,
                     isFirstEnable = false,
                   }) => {
  const [enbaleCamera, setEnbaleCamera] = useState(true)

  useEffect(() => {
    if (enbaleCamera) {
      if (coordinatesActive && (coordinates || positions)) {
        if (coordinates && positions.length > 0) {
          coordinates = positions.map((item) => [item.longitude, item.latitude])
        }
        if (coordinates.length) {
          const bounds = coordinates.reduce(
            (bounds, item) => bounds.extend(item),
            new maptilersdk.LngLatBounds(coordinates[0], coordinates[0]),
          )
          const canvas = map.getCanvas()
          map.fitBounds(bounds, {
            padding: Math.min(canvas.width, canvas.height) * 0.1,
            duration: 0,
          })
        }
      } else {
        map.jumpTo({
          center: [longitude, latitude],
          zoom: Math.max(map.getZoom(), 10),
        })
      }
      if (isFirstEnable) {
        setEnbaleCamera(false)
      }
    }

  }, [latitude, longitude, positions, coordinates])

  return null
}

export default MapCamera
