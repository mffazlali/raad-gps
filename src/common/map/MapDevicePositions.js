import {useCallback, useEffect, useId, useState} from 'react'
import {useSelector} from 'react-redux'
import {map} from './core/MapView'
import {addSvgIcon, findFonts} from './core/mapUtil'
import {formatTime} from '../util/formatter.js'
import {useAttributePreference, usePreference} from '../util/preferences.js'
import * as turf from '@turf/turf'

const MapDevicePositions = ({
                              positions = [],
                              onClick = (p) => {
                              },
                              showStatus = null,
                              selectedPosition = null,
                              titleField = '',
                              addressOpen,
                            }) => {
  const id = useId()
  const clusters = `${id}-clusters`
  const selected = `${id}-selected`
  const selectedAddress = `${id}-selectedAddress`
  const accuracyGPS = `${id}-accuracyGPS`

  const desktop = true
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1)

  const devices = useSelector((state) => state.devices.items)
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const addressPositions = useSelector((state) => state.session.addressPositions)

  const mapCluster = useAttributePreference('mapCluster', true)
  const hours12 = usePreference('twelveHourFormat')
  const directionType = useAttributePreference('mapDirection', 'selected')
  const [address, setAddress] = useState('')

  const calcCategoryDirection = (course) => {
    if (course <= 189) {
      return 'UpRight'
    } else {
      return 'UpLeft'
    }
  }
  const createFeature = (devices, position, selectedPositionId) => {
    const device = devices[position.deviceId]
    let color = device.color ? device.color : '#9e9e9e'
    let showDirection
    switch (directionType) {
      case 'none':
        showDirection = false
        break
      case 'all':
        showDirection = true
        break
      default:
        showDirection = selectedPositionId === position.id
        break
    }
    const result = {
      id: position.id,
      deviceId: position.deviceId,
      name: device.name,
      fixTime: formatTime(position.fixTime, 'seconds', hours12),
      category: device.category ?? 'car2',
      // category: `${device.category}${calcCategoryDirection(position.course)}`,
      color: color,
      rotation: position.course,
      direction: showDirection,
    }
    return result
  }

  const onMouseEnter = () => (map.getCanvas().style.cursor = 'pointer')
  const onMouseLeave = () => (map.getCanvas().style.cursor = '')

  const onMapClick = useCallback(
    (event) => {
      if (!event.defaultPrevented && onClick) {
        onClick()
      }
    },
    [onClick],
  )

  const onMarkerClick = useCallback(
    (event) => {
      event.preventDefault()
      const feature = event.features[0]
      if (onClick) {
        onClick(feature.properties.id, feature.properties.deviceId)
      }
    },
    [onClick],
  )

  const onClusterClick = useCallback(
    (event) => {
      event.preventDefault()
      const features = map.queryRenderedFeatures(event.point, {
        layers: [clusters],
      })
      const clusterId = features[0].properties.cluster_id
      map.getSource(id).getClusterExpansionZoom(clusterId, (error, zoom) => {
        if (!error) {
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom,
          })
        }
      })
    },
    [clusters],
  )

  // useEffect(() => {
  //   map.on('zoom', () => {
  //     const currentZoom = map.getZoom()
  //     if (map.setLayoutProperty){
  //       map.setLayoutProperty(id, 'icon-size', currentZoom / 100)
  //     }
  //   })
  // }, [])

  useEffect(() => {
    map.addSource(selectedAddress, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: mapCluster,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: mapCluster,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })
    map.addSource(selected, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })

    map.addSource(accuracyGPS, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })

    map.addLayer({
      id: accuracyGPS,
      type: 'fill',
      source: accuracyGPS,
      // minzoom:20,
      paint: {
        'fill-color': '#8CCFFF',
        'fill-opacity': 0.2,
      },
    })

    map.addLayer({
      id: selectedAddress,
      type: 'symbol',
      source: selectedAddress,
      layout: {
        'icon-image': 'rounded',
        'icon-allow-overlap': false,
        'icon-overlap': 'always',
        'icon-offset': [0, -8 * iconScale],
        'icon-size': 1,
        'icon-text-fit': 'both',
        'text-field': '{address}',
        'text-font': ['Open Sans Regular,Arial Unicode MS Regular'],
        // 'text-font': ['DanaFaNum Regular'],
        // 'text-allow-overlap': true,
        'text-offset': [0, -8 * iconScale],
        'text-size': 14,
        'visibility': 'visible',
      },
      paint: {
        'text-halo-color': 'white',
        'text-halo-width': 1,
      },
      // layout: {
      //   'icon-allow-overlap': false,
      //   'icon-overlap': 'always',
      //   'icon-offset': [0, -45 * iconScale],
      //   'icon-size': 1,
      //   'icon-text-fit':'both',
      //   // 'text-field': '',
      //   // 'text-font': ['DanaFaNum Regular'],
      //   // 'text-allow-overlap': true,
      //   // 'text-offset': [0, -10 * iconScale],
      //   // 'text-size': 14,
      //   // 'visibility': 'visible',
      //   'text-field': '',
      //   'text-allow-overlap': true,
      //   'text-overlap': 'always',
      //   'symbol-z-order': 'viewport-y',
      //   'text-anchor': 'bottom',
      //   'text-offset': [0, -10 * iconScale],
      //   'text-font': ['DanaFaNum Regular'],
      //   // 'text-font': findFonts(map),
      //   'text-size': 14,
      //   'text-max-width': 20,
      //   // 'text-variable-anchor': ['left', 'bottom', 'top', 'right'],
      //   'text-radial-offset': 0.5,
      //   'text-justify': 'auto'      },
      // paint: {
      //   "text-color": "#202",
      //   "text-halo-color": "#fff",
      //   "text-halo-width": 2,
      //   // 'text-color':'black',
      // },
    })

    ;[id, selected].forEach((source) => {
      map.addLayer({
        'id': source,
        'type': 'symbol',
        'source': source,
        'filter': ['!has', 'point_count'],
        'layout': {
          'icon-image': '{category}{color}',
          'icon-size': 0.8,
          'icon-allow-overlap': true,
          'icon-overlap': 'always',
          'text-field': '{name}',
          'text-allow-overlap': true,
          'text-overlap': 'always',
          'symbol-z-order': 'viewport-y',
          'text-anchor': 'bottom',
          'text-offset': [0, -2 * iconScale],
          'text-font': ['DanaFaNum Regular'],
          // 'text-font': findFonts(map),
          'text-size': 12,
          // 'icon-rotate': ['get', 'rotation'],
          // 'visibility': 'visible',
        },
      })

      map.addLayer({
        id: `direction-${source}`,
        type: 'symbol',
        source,
        filter: [
          'all',
          ['!has', 'point_count'],
          ['==', 'direction', true],
        ],
        layout: {
          'icon-image': 'direction',
          'icon-size': iconScale,
          'icon-allow-overlap': true,
          'icon-rotate': ['get', 'rotation'],
          'icon-rotation-alignment': 'map',
        },
      })

      map.on('mouseenter', source, onMouseEnter)
      map.on('mouseleave', source, onMouseLeave)
      map.on('click', source, onMarkerClick)
    })

    map.addLayer({
      id: clusters,
      type: 'symbol',
      source: id,
      filter: ['has', 'point_count'],
      layout: {
        'icon-image': 'background',
        'icon-size': iconScale,
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DanaFaNum Regular'],
        'text-size': 14,
      },
    })

    map.on('mouseenter', clusters, onMouseEnter)
    map.on('mouseleave', clusters, onMouseLeave)
    map.on('click', clusters, onClusterClick)
    map.on('click', onMapClick)

    return () => {
      map.off('mouseenter', clusters, onMouseEnter)
      map.off('mouseleave', clusters, onMouseLeave)
      map.off('click', clusters, onClusterClick)
      map.off('click', onMapClick)

      if (map.getLayer(clusters)) {
        map.removeLayer(clusters)
      }

      ;[id, selected, accuracyGPS, selectedAddress].forEach((source) => {
        map.off('mouseenter', source, onMouseEnter)
        map.off('mouseleave', source, onMouseLeave)
        map.off('click', source, onMarkerClick)

        if (map.getLayer(source)) {
          map.removeLayer(source)
        }
        if (map.getLayer(`direction-${source}`)) {
          map.removeLayer(`direction-${source}`)
        }
        if (map.getSource(source)) {
          map.removeSource(source)
        }
      })
    }
  }, [mapCluster, clusters, onMarkerClick, onClusterClick])

  useEffect(() => {
    Object.values(devices).forEach(async (device) => {
      let color = device.color ? device.color : '#9e9e9e'
      if (color) {
        await addSvgIcon(`${device.category}`, color)
        // let iconsDirection = ['UpLeft', 'UpRight', 'Left']
        // iconsDirection.map(async (value) => {
        //   await addSvgImage(`${device.category}${value}`, color)
        // })
      }
    })

    ;[id, selected, accuracyGPS].forEach((source) => {
      if (source === id || source === selected) {
        map.getSource(source)?.setData({
          type: 'FeatureCollection',
          features: positions
            .filter((it) => devices.hasOwnProperty(it?.deviceId))
            .filter((it) =>
              source === id
                ? it.deviceId !== selectedDeviceId
                : it.deviceId === selectedDeviceId,
            )
            .map((position) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [position.longitude, position.latitude],
              },
              properties: createFeature(
                devices,
                position,
                selectedPosition && selectedPosition.id,
              ),
            })),
        })
      } else if (source === accuracyGPS) {
        map.getSource(source)?.setData({
          type: 'FeatureCollection',
          features: positions
            .filter((it) => devices.hasOwnProperty(it?.deviceId))
            .filter((it) => it.deviceId == selectedDeviceId)
            .filter((it) => (it.longitude && !Number.isNaN(it.longitude)) && (it.latitude && !Number.isNaN(it.latitude)))
            .map((position) => {
              const HDOP = (position?.attributes?.hdop ?? 0) * 10 ?? 0
              const radius = (HDOP * 3) * 0.5
              const options = {
                steps: 64,
                units: 'meters',
              }
              return turf.circle([position.longitude, position.latitude], radius, options)
            }),
        })
      }
    })

  }, [
    mapCluster,
    clusters,
    onMarkerClick,
    onClusterClick,
    devices,
    positions,
    selectedPosition,
  ])

  useEffect(() => {

    ;[selectedAddress].forEach((source) => {
      if (addressOpen) {
        map.getSource(source)?.setData({
          type: 'FeatureCollection',
          features: positions
            .filter((it) => devices.hasOwnProperty(it.deviceId))
            .filter((it) => (addressOpen && it.deviceId == selectedDeviceId && addressPositions[String(selectedDeviceId)] && addressPositions[String(selectedDeviceId)] != ''))
            .map((position) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [position.longitude, position.latitude],
              },
              properties: {
                address: addressPositions[String(selectedDeviceId)],
              },
            })),
        })
      } else {
        map.getSource(source)?.setData({
          type: 'FeatureCollection',
          features: [],
        })
      }
    })

  }, [
    mapCluster,
    clusters,
    onMarkerClick,
    onClusterClick,
    selectedDeviceId,
    positions,
    selectedPosition,
    addressOpen,
  ])

  return null
}

export default MapDevicePositions
