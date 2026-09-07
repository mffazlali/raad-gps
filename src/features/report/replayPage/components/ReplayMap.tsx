import React from 'react'
import MapView from '../../../../common/map/core/MapView'
import MapRoutePathReplay from '../../../../common/map/MapRoutePathReplay'
import MapRoutePoints from '../../../../common/map/MapRoutePoints'
import MapDevicePositions from '../../../../common/map/MapDevicePositions'
import MapCamera from '../../../../common/map/MapCamera'
import SpinnerContainer from '../../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer'
import cls from 'classnames'

interface ReplayMapProps {
  loading: boolean
  positions: any[]
  stopsItem: any[]
  index: number
  onPointClick: (event: any, index: number) => void
  onMarkerClick: (positionId: any) => void
  className?: string,
  isCamera: boolean,
  isCameraFirst: boolean,
}

const ReplayMap: React.FC<ReplayMapProps> = ({
                                               loading,
                                               positions,
                                               stopsItem,
                                               index,
                                               onPointClick,
                                               onMarkerClick,
                                               className,
                                               isCamera,
                                               isCameraFirst,
                                             }) => {
  return (
    <div className={cls('w-full !h-full relative', className)}>
      {loading && <SpinnerContainer />}
      <MapView zoomCheck={true}>
        {!loading && (
          <>
            <MapRoutePathReplay positions={positions} />
            {positions.length > 0 && (
              <MapRoutePoints positions={stopsItem} onClick={onPointClick} />
            )}
            {index < positions.length && (
              <MapDevicePositions
                addressOpen={null}
                positions={[positions[index]]}
                onClick={onMarkerClick}
                titleField="fixTime"
              />
            )}
          </>
        )}
      </MapView>
      {(!loading && (positions && positions.length > 0 && positions[index]) && (isCamera || isCameraFirst)) && (
        <MapCamera
          coordinatesActive={false}
          latitude={positions[index]?.latitude}
          longitude={positions[index]?.longitude}
        />
      )}
    </div>
  )
}

export default ReplayMap 