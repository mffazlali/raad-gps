import {useEffect} from 'react'

import {useSelector} from 'react-redux'
import {map} from '../core/MapView'
import dimensions from '../../theme/dimensions.js'
import {useAttributePreference} from '../../util/preferences.js'
import {usePrevious} from '../../util/reactHelper.js'
import {getDeviceTrackingState} from '../../util/isTrackingDeviceUtil.js'


const MapSelectedDevice = ({selectActive = false}) => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const previousDeviceId = usePrevious(selectedDeviceId)

  const selectZoom = useAttributePreference('web.selectZoom', 10)
  const mapFollow = useAttributePreference('mapFollow', true)

  const position = useSelector(
    (state) => state.session.positions[selectedDeviceId],
  )

  useEffect(() => {
    if ((selectedDeviceId !== previousDeviceId || mapFollow) && position && Object.keys(position).includes('longitude') && Object.keys(position).includes('latitude')) {
      if (position.longitude !== 0 && position.latitude !== 0) {
        // Check if tracking is active for this device using per-device tracking state
        const isTracking = getDeviceTrackingState(selectedDeviceId)

        if (isTracking) {
          // If tracking is active, smoothly follow the device
          map.easeTo({
            center: [position.longitude, position.latitude],
            zoom: Math.max(map.getZoom(), selectZoom),
            offset: [0, -dimensions.popupMapOffset / 5],
            duration: 1000,
          })
        } else if (selectedDeviceId !== previousDeviceId) {
          // Only move to device if it's a new selection and not tracking
          map.easeTo({
            center: [position.longitude, position.latitude],
            zoom: Math.max(map.getZoom(), selectZoom),
            offset: [0, -dimensions.popupMapOffset / 5],
          })
        }
      }
    }
  })

  useEffect(() => {
    if (selectActive) {
      if ((selectedDeviceId != 'undefined') && position && Object.keys(position).includes('longitude') && Object.keys(position).includes('latitude')) {
        if (position.longitude !== 0 && position.latitude !== 0) {
          map.jumpTo({
            center: [position.longitude, position.latitude],
            // zoom: Math.max(map.getZoom(), selectZoom),
            // offset: [0, -dimensions.popupMapOffset / 2],
          })
        }
      }
    }
  }, [selectedDeviceId, selectActive])

  return null
}

export default MapSelectedDevice

