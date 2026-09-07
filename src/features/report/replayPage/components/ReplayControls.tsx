import React from 'react'
import styles from './ReplayControls.module.css'
import cls from 'classnames'
import MapPlayer from '../mapPlayer/mapPlayer'
import CardDevice from '../../../main/cardDevice/CardDevice'
import PopupPlayer from '../popupPlayer/PopupPlayer'

interface ReplayControlsProps {
  index: number
  setIndex: (index: number) => void
  playing: boolean
  positions: any[]
  handlePlay: () => void
  handleSpeed: (speed: string) => void
  handlePrevious: () => void
  handleNext: () => void
  handleDownload: () => void
  handleFilter: () => void
  addressOpen: boolean
  setAddressOpen: (value: boolean) => void
  isMainPage?: boolean
  isMobileMode?: boolean
  isLoading: boolean
  device: any,
  deviceId: any,
  className?: string
}

const ReplayControls: React.FC<ReplayControlsProps> = ({
                                                         index,
                                                         setIndex,
                                                         playing,
                                                         positions,
                                                         handlePlay,
                                                         handleSpeed,
                                                         handlePrevious,
                                                         handleNext,
                                                         handleDownload,
                                                         handleFilter,
                                                         addressOpen,
                                                         setAddressOpen,
                                                         isMobileMode = false,
                                                         isMainPage = true,
                                                         device,
                                                         className,
                                                         deviceId,
                                                         isLoading
                                                       }) => {
  return (
    <div className={cls(styles.controls, className as any, !isMobileMode && '!absolute' as any)}>
      {positions && positions.length > 0 && (
        <CardDevice
          position={positions[index] ? positions[index] : positions[index - 1] ? positions[index - 1] : positions[index]}
          deviceId={deviceId}
          addressOpen={addressOpen}
          setAddressOpen={setAddressOpen}
          isMobileMedia={isMobileMode}
          showOnlyPositionFields={true}
          isReport={true}
        />
      )}
      {isMobileMode ? <MapPlayer
        index={index}
        setIndex={setIndex}
        playing={playing}
        positions={positions}
        handlePlay={handlePlay}
        handleSpeed={handleSpeed}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleDownload={handleDownload}
        isMobileMode={isMobileMode}
        handleFilter={handleFilter}
        isLoading={isLoading}
      /> : <PopupPlayer
        index={index}
        setIndex={setIndex}
        playing={playing}
        positions={positions}
        handlePlay={handlePlay}
        handleSpeed={handleSpeed}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleDownload={handleDownload}
        handleFilter={handleFilter}
        device={device}
      />}
    </div>
  )
}

export default ReplayControls
