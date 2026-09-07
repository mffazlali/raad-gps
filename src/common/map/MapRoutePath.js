import {useId, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {map} from './core/MapView'
import {addSvgIcon, findFonts} from './core/mapUtil'
import {useEffectAsync} from '../util/reactHelper.js'


const MapRoutePath = ({name = '', device = {}, positions = [], coordinates = []}) => {
  const id = useId()

  const reportColor = useSelector((state) => {
    const position = positions?.find(() => true)
    if (position) {
      const attributes = state.devices.items[position.deviceId]?.attributes
      if (attributes) {
        const color = attributes['web.reportColor']
        if (color) {
          return color
        }
      }
    }
    return null
  })

  useEffect(() => {
    if (map.addSource) {
      map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      })
      // map.addSource(id, {
      //   type: 'geojson',
      //   data: {
      //     type: 'FeatureCollection',
      //     features: [],
      //   },
      // })

      map.addLayer({
        source: id,
        id: `${id}-line`,
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
      // map.addLayer({
      //   source: id,
      //   id: `${id}-line`,
      //   'type': 'circle',
      //   'paint': {
      //     'circle-radius': 10,
      //     'circle-color': '#3887be'
      //   }
      // });
      if (name) {
        map.addLayer({
          source: id,
          id: `${id}-title`,
          type: 'symbol',
          // layout: {
          //   'text-field': '{name}',
          //   'text-font': findFonts(map),
          //   'text-size': 12,
          // },
          // paint: {
          //   'text-halo-color': 'white',
          //   'text-halo-width': 1,
          // },
          'layout': {
            'icon-image': '{category}{color2}',
            'icon-size': 0.8,
            'icon-allow-overlap': true,
            'icon-overlap': 'always',
            'text-field': '{name}',
            'text-allow-overlap': true,
            'text-overlap': 'always',
            'symbol-z-order': 'viewport-y',
            'text-anchor': 'bottom',
            'text-offset': [0, -2 * 0.75],
            'text-font': ['DanaFaNum Regular'],
            // 'text-font': findFonts(map),
            'text-size': 12,
            // 'icon-rotate': ['get', 'rotation'],
            // 'visibility': 'visible',
          },

        })
      }
    }

    return () => {
      if (map.getLayer(`${id}-title`)) {
        map.removeLayer(`${id}-title`)
      }
      if (map.getLayer(`${id}-report`)) {
        map.removeLayer(`${id}-report`)
      }
      if (map.getLayer(`${id}-line`)) {
        map.removeLayer(`${id}-line`)
      }
      if (map.getSource(id)) {
        map.removeSource(id)
      }
      if (map.getSource(`${id}-report`)) {
        map.removeSource(`${id}-report`)
      }
    }
  }, [])


  useEffectAsync(async () => {
    if (coordinates.length <= 0) {
      coordinates = positions.map((item) => [item.longitude, item.latitude])
    }

    await addSvgIcon(`${device.category}`, device.color ?? '#9e9e9e')
    map.getSource(`${id}`)?.setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates,
      },
      properties: {
        name: name,
        color2: device.color,
        category: device.category,
        color: reportColor,
      },

    })
    // map.getSource(`${id}-report`)?.setData({
    //   type: 'FeatureCollection',
    //   features:[
    //     {
    //       type: 'Feature',
    //       geometry: {
    //         type: 'Point',
    //         coordinates: coordinates[0],
    //       },
    //       properties: {
    //         name,
    //         color2: device.color,
    //         category: device.category,
    //         color: reportColor,
    //       },
    //     },
    //   ],
    //
    // })

  }, [positions, coordinates])

  return null
}

export default MapRoutePath
