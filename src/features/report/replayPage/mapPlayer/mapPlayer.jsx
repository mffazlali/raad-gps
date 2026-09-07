import styles from './mapPlayer.module.css'
import cls from 'classnames'
import React, {useState, useCallback, useEffect} from 'react'
import play from '../../../../resources/images/medias/playOutline.svg'
import pause from '../../../../resources/images/medias/pauseOutline.svg'
import previous from '../../../../resources/images/medias/skipPreviousOutline.svg'
import next from '../../../../resources/images/medias/skipNextOutline.svg'
import nextDisable from '../../../../resources/images/medias/skipNextDisableOutline.svg'
import nextActive from '../../../../resources/images/medias/skipNextActiveOutline.svg'
import playDisable from '../../../../resources/images/medias/playDisableOutline.svg'
import playActive from '../../../../resources/images/medias/playActiveOutline.svg'
import pauseDisable from '../../../../resources/images/medias/pauseDisableOutline.svg'
import pauseActive from '../../../../resources/images/medias/pauseActiveOutline.svg'
import previousDisable from '../../../../resources/images/medias/skipPreviousDisableOutline.svg'
import previousActive from '../../../../resources/images/medias/skipPreviousActiveOutline.svg'
import download from '../../../../resources/images/medias/downloadPlayOutline.svg'
import Button from '../../../../common/components/custom/general/button/Button'
import {Radio, Slider} from 'antd'


const MapPlayer = ({
                     index,
                     setIndex,
                     positions,
                     playing,
                     handlePlay,
                     handleSpeed,
                     handleNext,
                     handlePrevious,
                     handleDownload,
                     handleFilter,
                     isMobileMode = false,
                     isLoading,
                   }) => {

  const [speedPlay, setSpeedPlay] = useState('500')
  const [internalIndex, setInternalIndex] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)

  useEffect(() => {
    if (isScrubbing) return
    const maxIndex = Math.max(positions.length - 1, 0)
    const clamped = Math.min(Math.max(index ?? 0, 0), maxIndex)
    setInternalIndex(clamped)
  }, [index, positions.length, isScrubbing])

  const handleRadioChange = (e) => {
    handleSpeed(e.target.value)
    setSpeedPlay(e.target.value)
  }

  const handleSliderChange = useCallback((newIndex) => {
    if (!Array.isArray(positions)) return
    if (typeof newIndex !== 'number' || Number.isNaN(newIndex)) return
    const maxIndex = Math.max(positions.length - 1, 0)
    const clamped = Math.min(Math.max(newIndex, 0), maxIndex)
    setIsScrubbing(true)
    setInternalIndex(clamped)
  }, [positions.length])

  const handleSliderCommit = useCallback((newIndex) => {
    if (!Array.isArray(positions)) return
    if (typeof newIndex !== 'number' || Number.isNaN(newIndex)) return
    const maxIndex = Math.max(positions.length - 1, 0)
    const clamped = Math.min(Math.max(newIndex, 0), maxIndex)
    if (clamped !== index) {
      setIndex(clamped)
    }
    setIsScrubbing(false)
  }, [setIndex, positions.length, index])

  return (
    <>
      <Slider
        value={internalIndex}
        onChange={handleSliderChange}
        onChangeComplete={handleSliderCommit}
        min={0}
        max={Math.max(positions.length - 1, 0)}
        step={1}
        disabled={!positions || positions?.length <= 0 || isLoading}
        tooltip={{
          formatter: (val) => {
            const v = typeof val === 'number' && !Number.isNaN(val) ? val : 0
            const total = Array.isArray(positions) ? positions.length : 0
            return total > 0 ? `${v + 1} / ${total}` : '0 / 0'
          },
        }}
        className={'bg-red'}
      />
      <div className={cls(styles.mapPlayer, isMobileMode && 'flex-row-reverse')}>
        <div className={styles.mapPlayerContainer}>
          <div></div>
          <div className={styles.controlsWrapper}>
            <Button
              type="button"
              title={''}
              disabled={playing || index >= positions.length - 1 || isLoading}
              onClick={handleNext}
              className={cls(
                styles.controlButton,
                '',
              )}
              icon={next}
              iconHover={nextActive}
              iconDisable={nextDisable} />
            <Button
              type="button"
              title={''}
              disabled={index >= positions.length - 1 || isLoading}
              onClick={handlePlay}
              className={cls(
                styles.controlButton,
                '',
              )}
              icon={playing ? pause : play}
              iconHover={playing ? pauseActive : playActive}
              iconDisable={playing ? pauseDisable : playDisable} />
            <Button
              type="button"
              title={''}
              disabled={playing || index <= 0 || isLoading}
              onClick={handlePrevious}
              className={cls(
                styles.controlButton,
                '',
              )}
              icon={previous}
              iconHover={previousActive}
              iconDisable={previousDisable}
            />
          </div>
          <div>
            <Radio.Group disabled={positions.length <= 0 || isLoading} className={'sm:scale-[0.8] scale-[0.6]'}
                         buttonStyle={'outline'} defaultValue={'500'} value={'small'}
                         onChange={handleRadioChange}>
              <Radio.Button className={(speedPlay === '500' && positions.length > 0 && !isLoading) && '!text-white hover:!text-white !bg-primary-active '}
                            value="500">1X</Radio.Button>
              <Radio.Button className={(speedPlay === '250' && positions.length > 0 && !isLoading) && '!text-white hover:!text-white !bg-primary-active'}
                            value="250">2X</Radio.Button>
              <Radio.Button className={(speedPlay === '125' && positions.length > 0 && !isLoading) && '!text-white hover:!text-white !bg-primary-active'}
                            value="125">4X</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            {/*<Button*/}
            {/*  type="button"*/}
            {/*  title={''}*/}
            {/*  onClick={handleDownload}*/}
            {/*  className={cls(*/}
            {/*    'btn-primary',*/}
            {/*  )}*/}
            {/*  icon={download}*/}
            {/*  disabled={!positions || (positions && positions.length == 0)} />*/}
          </div>
        </div>
      </div>
    </>
  )
}

export default MapPlayer
