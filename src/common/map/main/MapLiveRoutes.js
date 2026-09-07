import {useId, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {map} from '../core/MapView'
import {useAttributePreference} from '../../util/preferences.js'

const MapLiveRoutes = () => {
  const id = useId()

  const theme = {}

  const type = useAttributePreference('mapLiveRoutes', 'selected')

  const devices = useSelector((state) => state.devices.items)
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const devicePathTrackers = useSelector((state) => state.session.devicePathTrackers)

  useEffect(() => {
    if (type !== 'none') {
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
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
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
    }
    return () => {
    }
  }, [type])

  useEffect(() => {
    if (type !== 'none' && selectedDeviceId && devicePathTrackers[selectedDeviceId]) {
      const deviceColor = devices[selectedDeviceId]?.attributes['web.reportColor'] || '#000000'
      
      if (map.getSource(id)) {
        const features = devicePathTrackers[selectedDeviceId].map((path, index) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: path.map(point => [point.longitude, point.latitude]),
          },
          properties: {
            color: deviceColor,
            pathIndex: index,
          },
        }))

        map.getSource(id)?.setData({
          type: 'FeatureCollection',
          features,
        })
      }
    } else if (map.getSource(id)) {
      map.getSource(id)?.setData({
        type: 'FeatureCollection',
        features: [],
      })
    }
  }, [theme, type, devices, selectedDeviceId, devicePathTrackers])

  return null
}

export default MapLiveRoutes
