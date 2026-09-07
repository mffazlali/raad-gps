import {useId, useEffect} from 'react'
import {map} from './core/MapView'
import {findFonts} from './core/mapUtil'
import {useAttributePreference} from '../util/preferences.js'
import flagStop from '../../resources/images/medias/flagStop.svg'

const MapFlags = ({markers, selectedPosition}) => {
  const id = useId()
  const desktop = true
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1)

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })

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
      features: markers.slice(0, markers.length - 1).filter(item => item.counter > 1 && (selectedPosition.longitude != item.longitude && selectedPosition.latitude != item.latitude)).map(({
                                                                                                                                                                                             latitude,
                                                                                                                                                                                             longitude,
                                                                                                                                                                                             image,
                                                                                                                                                                                             title,
                                                                                                                                                                                           }) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: {
          image: 'flagStop-error',
          title: title || '',
        },
      })),
    })
  }, [markers, selectedPosition])

  return null
}

export default MapFlags
