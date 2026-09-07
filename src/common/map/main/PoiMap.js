import { useId, useEffect, useState } from 'react'
import { kml } from '@tmcw/togeojson'
import { map } from '../core/MapView'
import { findFonts } from '../core/mapUtil'
import { useEffectAsync } from '../../util/reactHelper.js'
import { usePreference } from '../../util/preferences.js'
import axios from 'axios'
import axiosInstance from '../../util/axiosConfig'

const PoiMap = () => {
  const id = useId()

  const poiLayer = usePreference('poiLayer')

  const [data, setData] = useState(null)

  useEffectAsync(async () => {
    if (poiLayer) {
      try {
        const response = await axiosInstance.get(poiLayer)
        if (response.status === 200) {
          const dom = new DOMParser().parseFromString(response.data, 'text/xml')
          setData(kml(dom))
        }
      } catch (error) {
        console.error('Error fetching POI layer:', error)
      }
    }
  }, [poiLayer])

  useEffect(() => {
    if (data) {
      map.addSource(id, {
        type: 'geojson',
        data,
      })
      map.addLayer({
        source: id,
        id: 'poi-point',
        type: 'circle',
        paint: {
          'circle-radius': 5,
          'circle-color': null,
        },
      })
      map.addLayer({
        source: id,
        id: 'poi-line',
        type: 'line',
        paint: {
          'line-color': null,
          'line-width': 2,
        },
      })
      map.addLayer({
        source: id,
        id: 'poi-title',
        type: 'symbol',
        layout: {
          'text-field': '{name}',
          'text-anchor': 'bottom',
          'text-offset': [0, -0.5],
          'text-font': findFonts(map),
          'text-size': 12,
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 1,
        },
      })
      return () => {
        if (map.getLayer('poi-point')) {
          map.removeLayer('poi-point')
        }
        if (map.getLayer('poi-line')) {
          map.removeLayer('poi-line')
        }
        if (map.getLayer('poi-title')) {
          map.removeLayer('poi-title')
        }
        if (map.getSource(id)) {
          map.removeSource(id)
        }
      }
    }
    return () => {}
  }, [data])

  return null
}

export default PoiMap
