import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import useFeatures from '../../common/util/useFeatures.js'
import MapPadding from '../../common/map/MapPadding.js'
import MapCurrentLocation from '../../common/map/MapCurrentLocation.js'
import MapScale from '../../common/map/MapScale.js'
import PoiMap from '../../common/map/main/PoiMap.js'
import MapSelectedDevice from '../../common/map/main/MapSelectedDevice.js'
import MapDefaultCamera from '../../common/map/main/MapDefaultCamera.js'
import MapPositions from '../../common/map/MapPositions.js'
import MapLiveRoutes from '../../common/map/main/MapLiveRoutes.js'
import MapAccuracy from '../../common/map/main/MapAccuracy.js'
import MapGeofence from '../../common/map/MapGeofence.js'
import MapOverlay from '../../common/map/overlay/MapOverlay.js'
import MapView from '../../common/map/core/MapView.jsx'
import {devicesActions} from '../../common/clientStore/index.js'
import MapFlags from '../../common/map/MapFlags.js'
import ServerTime from './serverTime/ServerTime'
import MapDevicePositions from '../../common/map/MapDevicePositions.js'
import {useLocation} from 'react-router-dom'

const MainMap = ({filteredPositions, selectedPosition, onEventsClick, addressOpen}) => {
  const location = useLocation()
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const historyFlags = useSelector((state) => state.session.historyFlag)
  const geofences = useSelector((state) => state.geofences.items)
  const dispatch = useDispatch()
  const onMarkerClick = useCallback(
    (_, deviceId) => {
      if (deviceId === undefined) {
        dispatch(devicesActions.selectId(undefined))
      } else {
        dispatch(devicesActions.selectId(deviceId))
      }
    },
    [dispatch],
  )

  return (
    <>
      <MapView showDeviceFollow={true} zoomCheck={true}>
        <MapOverlay />
        {(geofences && Object.values(geofences).length > 0) && <MapGeofence />}
        <MapAccuracy positions={filteredPositions} />
        <MapLiveRoutes />
        {/*<MapPositions*/}
        {/*  positions={filteredPositions}*/}
        {/*  onClick={onMarkerClick}*/}
        {/*  selectedPosition={selectedPosition}*/}
        {/*  showStatus*/}
        {/*/>*/}
        {location.pathname == '/' && <MapDevicePositions positions={filteredPositions}
                                                         onClick={onMarkerClick}
                                                         selectedPosition={selectedPosition}
                                                         showStatus
                                                         addressOpen={addressOpen} />}
        {historyFlags && selectedPosition && historyFlags[selectedDeviceId] &&
          <MapFlags markers={historyFlags[selectedDeviceId]} selectedPosition={selectedPosition}/>}
        <MapDefaultCamera />
        <MapSelectedDevice selectActive={true} />
        <PoiMap />
        <MapCurrentLocation />
        {/*<HeatMap />*/}
      </MapView>
      <MapScale />
      {/*<MapSelectedPosition position={filteredPositions[selectedDeviceId]} />*/}
      {/*<MapGeocoder />*/}
      <ServerTime time={selectedPosition?.serverTime} />
    </>
  )
}

export default MainMap
