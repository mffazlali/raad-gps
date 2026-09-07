import {useId, useEffect} from 'react'
import {map} from './core/MapView'

const HeatMap = ({heatData = []}) => {
  const id = useId()

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })

    map.addLayer(
      {
        'id': id,
        'type': 'heatmap',
        'source': id,
        'minzoom': 0,
        'paint': {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            6,
            1
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            9,
            3
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparency color
          // to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.1,
            'rgb(35,149,209)',
            0.2,
            'rgb(103,169,207)',
            0.3,
            'rgb(169,211,234)',
            0.4,
            'rgb(209,229,240)',
            0.5,
            'rgb(246,234,227)',
            0.6,
            'rgb(246,224,210)',
            0.7,
            'rgb(255,199,166)',
            0.8,
            'rgb(234,139,101)',
            0.9,
            'rgb(237,118,71)',
            1,
            'rgb(178,24,43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            2,
            9,
            10
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            50,
            0
          ]
        }
      },
      'waterway'
    );

    // map.addLayer(
    //   {
    //     'id': id,
    //     'type': 'circle',
    //     'source': id,
    //     'minzoom': 0,
    //     'paint': {
    //       // Size circle radius by earthquake magnitude and zoom level
    //       'circle-radius': [
    //         'interpolate',
    //         ['linear'],
    //         ['zoom'],
    //         7,
    //         ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
    //         16,
    //         ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
    //       ],
    //       // Color circle by earthquake magnitude
    //       'circle-color': [
    //         'interpolate',
    //         ['linear'],
    //         ['get', 'mag'],
    //         1,
    //         'rgba(33,102,172,0)',
    //         2,
    //         'rgb(103,169,207)',
    //         3,
    //         'rgb(209,229,240)',
    //         4,
    //         'rgb(253,219,199)',
    //         5,
    //         'rgb(239,138,98)',
    //         6,
    //         'rgb(178,24,43)'
    //       ],
    //       'circle-stroke-color': 'gray',
    //       'circle-stroke-width': 1,
    //       // Transition from heatmap to circle layer by zoom level
    //       'circle-opacity': [
    //         'interpolate',
    //         ['linear'],
    //         ['zoom'],
    //         7,
    //         0,
    //         8,
    //         1
    //       ]
    //     }
    //   },
    //   'waterway'
    // );
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
      features: heatData,
    })
  }, [heatData])

  return null
}

export default HeatMap
