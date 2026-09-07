import { useId, useEffect } from 'react'
import circle from '@turf/circle'
import { map } from '../core/MapView'

const MapAccuracy = ({ positions }) => {
  const id = useId()

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })
    map.addLayer({
      source: id,
      id,
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon']],
      paint: {
        'fill-color': '#3bb2d0',
        'fill-outline-color': '#3bb2d0',
        'fill-opacity': 0.25,
      },
    })

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id)
      }
      if (map.getSource(id)) {
        map.removeSource(id)
      }
    }
  }, [])

  useEffect(() => {
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: positions
        .filter((position) => position?.accuracy > 0)
        .map((position) =>
          circle(
            [position?.longitude, position?.latitude],
            position?.accuracy * 0.001
          )
        ),
    })
  }, [positions])

  return null
}

export default MapAccuracy
