import { useId, useCallback, useEffect } from 'react'
import { map } from './core/MapView'
import {useAttributePreference} from '../util/preferences.js'

const MapPositions = ({ positions, onClick }) => {
  const id = useId()
  const desktop = true
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1)

  const onMouseEnter = () => (map.getCanvas().style.cursor = 'pointer')
  const onMouseLeave = () => (map.getCanvas().style.cursor = '')

  const onMarkerClick = useCallback(
    (event) => {
      event.preventDefault()
      const feature = event.features[0]
      if (onClick) {
        onClick(feature.properties.id, feature.properties.index)
      }
    },
    [onClick]
  )

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })
    // map.addLayer({
    //   id,
    //   type: 'circle',
    //   source: id,
    //   paint: {
    //     'circle-radius': 5,
    //     'circle-color': '#22c55e',
    //   },
    // })

    map.addLayer({
      id,
      type: 'symbol',
      source: id,
      layout: {
        'icon-image': '{image}',
        'icon-size': iconScale,
        'icon-allow-overlap': true,
        'symbol-z-order': 'viewport-y',
      },
    })


    map.on('mouseenter', id, onMouseEnter)
    map.on('mouseleave', id, onMouseLeave)
    map.on('click', id, onMarkerClick)

    return () => {
      map.off('mouseenter', id, onMouseEnter)
      map.off('mouseleave', id, onMouseLeave)
      map.off('click', id, onMarkerClick)

      if (map.getLayer(id)) {
        map.removeLayer(id)
      }
      if (map.getSource(id)) {
        map.removeSource(id)
      }
    }
  }, [onMarkerClick])

  useEffect(() => {
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: positions.map((position, index) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [position.longitude, position.latitude],
        },
        properties: {
          index,
          image: 'flagStop-error',
          id: position.id,
        },
      })),
    })
  }, [onMarkerClick, positions])

  return null
}

export default MapPositions
