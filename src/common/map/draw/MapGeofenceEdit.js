import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import maplibregl from 'maplibre-gl'
import * as maptilersdk from '@maptiler/sdk'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {map} from '../core/MapView'
import {findFonts, geofenceToFeature, geometryToArea} from '../core/mapUtil'
import {useCatchCallback} from '../../util/reactHelper'
import {geofencesActions} from '../../clientStore/index'
import {useTheme} from '@mui/styles'
import theme from './theme'
import DrawCircle from 'mapbox-gl-draw-circle-mode'
import {useGeofences, useCreateGeofence, useUpdateGeofence, useDeleteGeofence} from '../../serverStore/useGeofence'

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    line_string: true,
    trash: true,
  },
  modes: {
    ...MapboxDraw.modes,
    draw_line_string: DrawCircle,
  },
  userProperties: true,
  styles: [...theme, {
    id: 'gl-draw-title',
    type: 'symbol',
    filter: ['all'],
    layout: {
      'text-field': '{user_name}',
      'text-font': ['DanaFaNum Regular'],
      'text-size': 12,
    },
    paint: {
      'text-halo-color': 'white',
      'text-halo-width': 1,
    },
  }],
})


const MapGeofenceEdit = ({selectedGeofenceId}) => {
  const theme = useTheme()
  const permissions = useSelector((state) => state.session.permissions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const geofences = useSelector((state) => state.geofences.items)
  const currentUser = useSelector((state) => state?.session?.user)
  const {refetch: refreshGeofences, data: geofences} = useGeofences(currentUser.id)
  const createGeofence = useCreateGeofence()
  const updateGeofence = useUpdateGeofence()
  const deleteGeofence = useDeleteGeofence()

  useEffect(() => {
    refreshGeofences()
    if (map) {
      map.addControl(draw, 'top-right')
      checkHideControlsDraw()
    }
    return () => {
      map.removeControl(draw)
    }
  }, [refreshGeofences])

  useEffect(() => {
    checkHideControlsDraw()
  }, [permissions])

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0]
      const newItem = {area: geometryToArea(feature.geometry)}
      draw.delete(feature.id)
      navigate(`/settings/geofences/geofence`, {state: newItem})
    }

    map.on('draw.create', listener)
    return () => map.off('draw.create', listener)
  }, [dispatch, navigate])

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0]
      try {
        await deleteGeofence.mutateAsync(feature.id)
        refreshGeofences()
      } catch (error) {
        // dispatch(errorsActions.push(error.message))
      }
    }

    map.on('draw.delete', listener)
    return () => map.off('draw.delete', listener)
  }, [dispatch, refreshGeofences, deleteGeofence])

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0]
      const item = (geofences).find((i) => i.id === feature.id)
      if (item) {
        const updatedItem = {...item, area: geometryToArea(feature.geometry)}
        try {
          await updateGeofence.mutateAsync({id: feature.id, geofence: updatedItem})
          refreshGeofences()
        } catch (error) {
          // dispatch(errorsActions.push(error.message))
        }
      }
    }

    map.on('draw.update', listener)
    return () => map.off('draw.update', listener)
  }, [dispatch, geofences, refreshGeofences, updateGeofence])

  useEffect(() => {
    draw.deleteAll()
    if (geofences) {
      (geofences)?.forEach((geofence) => {
        draw.add(geofenceToFeature(theme, geofence))
      })
    }
  }, [geofences])

  useEffect(() => {
    if (selectedGeofenceId) {
      const feature = draw.get(selectedGeofenceId)
      let {coordinates} = feature.geometry
      if (Array.isArray(coordinates[0][0])) {
        ;[coordinates] = coordinates
      }
      const bounds = coordinates.reduce(
        (bounds, coordinate) => bounds.extend(coordinate),
        new maptilersdk.LngLatBounds(coordinates[0], coordinates[1]),
      )
      const canvas = map.getCanvas()
      map.fitBounds(bounds, {
        padding: Math.min(canvas.width, canvas.height) * 0.1,
      })
    }
  }, [selectedGeofenceId])

  const checkHideControlsDraw = () => {
    if (!permissions.includes('Geofence-persist')) {
      document.getElementsByClassName('mapbox-gl-draw_line')[0].style.display = 'none'
      document.getElementsByClassName('mapbox-gl-draw_polygon')[0].style.display = 'none'
    }
    if (!permissions.includes('Geofence-delete')) {
      document.getElementsByClassName('mapbox-gl-draw_trash')[0].style.display = 'none'
    }
  }

  return null
}

export default MapGeofenceEdit
