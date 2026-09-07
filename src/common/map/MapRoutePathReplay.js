import {useId, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {map} from './core/MapView'
import {findFonts} from './core/mapUtil'
import {getDistance} from 'geolib'


const MapRoutePathReplay = ({name = '', positions = [], coordinates = []}) => {
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
          layout: {
            'text-field': '{name}',
            'text-font': findFonts(map),
            'text-size': 12,
          },
          paint: {
            'text-halo-color': 'white',
            'text-halo-width': 1,
          },
        })
      }

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
    }

    return () => {
      if (map.getLayer(`${id}-title`)) {
        map.removeLayer(`${id}-title`)
      }
      if (map.getLayer(`${id}-line`)) {
        map.removeLayer(`${id}-line`)
      }
      if (map.getSource(id)) {
        map.removeSource(id)
      }
    }
  }, [])

  useEffect(() => {
    if (coordinates.length <= 0) {
      coordinates = positions.map((item) => [item.longitude, item.latitude])
    }

    map.getSource(id)?.setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates,
      },
      properties: {
        name,
        color: reportColor,
      },
    })

    // map.getSource(id)?.setData({
    //   type: 'FeatureCollection',
    //   // features: pointsGroup(positions, 5, 0.001).map((group, index) => {
    //   features: coordinates.map((group, index) => {
    //     // console.log(group)
    //     return {
    //       type: 'Feature',
    //       geometry: {
    //         type: 'LineString',
    //         coordinates: group,
    //       },
    //       properties: {
    //         name,
    //         color: index % 2 === 0 ? '#456fff' : '#fff456',
    //       },
    //     }
    //   }),
    // })

  }, [positions, coordinates, reportColor])

  return null
}

export default MapRoutePathReplay


const pointsGroup = (positions, threshold, accuracy) => {
  let a=0
  let b=0
  let group1 = []
  let groups = []
  let group2 = []
  for (let i = 1; i < positions.length; i++) {
    const point = {...positions[i - 1]}
    const otherPoint = positions[i]
    let calculatedSlope = 0
    if (point.latitude - otherPoint.latitude === 0) {
      calculatedSlope = 0
    } else {
      calculatedSlope = Math.abs(point.longitude - otherPoint.longitude) / Math.abs(point.latitude - otherPoint.latitude)
    }
    const distance = getDistance(
      {latitude: point.latitude, longitude: point.longitude},
      {latitude: otherPoint.latitude, longitude: otherPoint.longitude}
      , accuracy)
    // console.log(distance, threshold)
    if(calculatedSlope==0){
      if (distance <= 22) {
        a++
        if (group2.length > 0)
          groups.push([...group2])
        group2 = []

        group1.push([point.longitude, point.latitude])
        if(i == positions.length-1){
          group1.push([otherPoint.longitude, otherPoint.latitude])
        }
      } else {
        b++
        if (group1.length > 0)
          groups.push([...group1])
        group1 = []

        group2.push([point.longitude, point.latitude])
        if(i == positions.length-1){
          group2.push([otherPoint.longitude, otherPoint.latitude])
        }
      }
    }else {
      if (calculatedSlope <= 3) {
        a++
        if (group2.length > 0)
          groups.push([...group2])
        group2 = []

        group1.push([point.longitude, point.latitude])
        if(i == positions.length-1){
          group1.push([otherPoint.longitude, otherPoint.latitude])
        }
      } else {
        b++
        if (group1.length > 0)
          groups.push([...group1])
        group1 = []

        group2.push([point.longitude, point.latitude])
        if(i == positions.length-1){
          group2.push([otherPoint.longitude, otherPoint.latitude])
        }
      }
    }
  }
  // groups.push(group1)
  // groups.push(group2)
  return [...groups]
}
