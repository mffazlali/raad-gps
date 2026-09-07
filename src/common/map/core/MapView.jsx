import '../../../styles/maplibre-gl.css'
import {config, Map, GeolocationType, Language, setRTLTextPlugin, NavigationControl, FullscreenControl} from '@maptiler/sdk'
import React, {useRef, useLayoutEffect, useEffect, useState} from 'react'
import {SwitcherControl} from '../switcher/switcher'
import {mapImages} from './preloadImages'
import useMapStyles, {styleCustom} from './useMapStyles'
import {useAttributePreference, usePreference} from '../../util/preferences.js'
import usePersistedState, {savePersistedState} from '../../util/usePersistedState.js'
import {useSelector} from 'react-redux'
// import {mapSvgImages} from './preloadSvgs'
import rounded from '../../../resources/images/medias/rounded.png'
import background from '../../../resources/images/background.svg'
import {loadImage, prepareImage} from './mapUtil.js'
import trackActiveSvg from '../../../resources/images/medias/trackActive.svg'
import trackInactiveSvg from '../../../resources/images/medias/trackInactive.svg'
import {getDeviceTrackingState} from '../../util/isTrackingDeviceUtil.js'

// import {
//   MaplibreExportControl,
//   Size,
//   PageOrientation,
//   Format,
//   DPI,
// } from '@watergis/maplibre-gl-export'

setRTLTextPlugin(
  '/scripts/mapbox-gl-rtl-text.js',
  null,
)


export const removeStorageSelectedMapStyle = () => {
  window.localStorage.removeItem('selectedMapStyle')
}


const element = document.createElement('div')
element.style.width = '100%'
element.style.height = '100%'
element.style.boxSizing = 'initial'

export const map = new Map({
  container: element,
  attributionControl: false,
  center: [35.700002691883896, 51.33802967283733],
  scaleControl: false,
  geolocate: GeolocationType.COUNTRY,
  geolocateControl: false,
  fullscreenControl: 'top-left',
  navigationControl: 'top-left',
  renderWorldCopies: false,
  maptilerLogo: false,
  apiKey: 'wAX6Hq3kWqVlejUbYVWX',
  style: import.meta.env.VITE_APP_APN_ENABLE?.toLowerCase?.() === 'true' ? styleCustom({
    tiles: [`${import.meta.env.VITE_APP_APN_MAP_URL}/tile/{z}/{x}/{y}.png`],
    maxZoom: 19,
    attribution:
      `© <a target="_top" rel="noopener" href="${import.meta.env.VITE_APP_APN_MAP_URL}">OpenStreetMap</a> contributors`,
  }) : 'https://api.maptiler.com/maps/streets-v2/style.json?key=wAX6Hq3kWqVlejUbYVWX&mtsid=f732f68a-e003-4705-8e9b-2896db088583',
// terrainControl:'top-left'
})

// Ensure zoom controls are visible when using maplibre (APN mode)
if (import.meta.env.VITE_APP_APN_ENABLE?.toLowerCase?.() === 'true') {
  try {
    // Navigation with compass (reset to north)
    map.addControl(new NavigationControl({showCompass: true}), 'top-left')
    // Fullscreen control
    map.addControl(new FullscreenControl(), 'top-left')
  } catch (e) {}
}

let ready = false
const readyListeners = new Set()
const addReadyListener = (listener) => {
  readyListeners.add(listener)
  listener(ready)
}

const removeReadyListener = (listener) => {
  readyListeners.delete(listener)
}

const updateReadyValue = (value) => {
  ready = value
  readyListeners.forEach((listener) => listener(value))
}

// Global tracking state
let globalTrackingState = {
  isTracking: false,
  selectedDeviceId: null,
  listeners: new Set(),
}

const addTrackingListener = (listener) => {
  globalTrackingState.listeners.add(listener)
  listener(globalTrackingState.isTracking, globalTrackingState.selectedDeviceId)
}

const removeTrackingListener = (listener) => {
  globalTrackingState.listeners.delete(listener)
}

const updateTrackingState = (isTracking, deviceId) => {
  globalTrackingState.isTracking = isTracking
  globalTrackingState.selectedDeviceId = deviceId
  globalTrackingState.listeners.forEach((listener) => listener(isTracking, deviceId))
}

export const getTrackingState = () => globalTrackingState

const initMap = async () => {
  map.setLanguage(Language.PERSIAN)
  if (ready) return
  if (!map.hasImage('background')) {
    Object.entries(mapImages).forEach(([key, value]) => {
      map.addImage(key, value, {
        pixelRatio: window.devicePixelRatio,
      })
    })
    // Object.entries(mapSvgImages).forEach(([key, value]) => {
    //   map.addImage(key, value, {
    //     pixelRatio: window.devicePixelRatio,
    //   })
    // })
    const image = await loadImage(background)
    const imageData = prepareImage(image)
    map.addImage('rounded', imageData, {
      content: [3, 3, 13, 13],
      stretchX: [[7, 9]],
      stretchY: [[7, 9]],
    })
  }
  updateReadyValue(true)
}

// map.addControl(new maptilersdk.NavigationControl({showCompass: false}), 'top-left')
// map.addControl(new maptilersdk.NavigationControl({showZoom: false}), 'top-right')
// map.setCenter({ lat: 0, lng: 0 })

// const exportControl = new MaplibreExportControl({
//   PageSize: Size.A3,
//   PageOrientation: PageOrientation.Portrait,
//   Format: Format.PNG,
//   DPI: DPI[96],
//   Crosshair: true,
//   PrintableArea: true,
//   Local: 'fn',
// })

// map.addControl(exportControl, 'bottom-left')

const switcher = new SwitcherControl(
  () => updateReadyValue(false),
  (styleId) => savePersistedState('selectedMapStyle', styleId),
  () => {
    map.once('styledata', () => {
      const waiting = () => {
        if (!map.loaded()) {
          setTimeout(waiting, 33)
        } else {
          initMap()
        }
      }
      waiting()
    })
  },
)

map.addControl(switcher, 'bottom-left')

class TrackingControl {
  constructor(onTrackingToggle) {
    this.onTrackingToggle = onTrackingToggle
    this.isTracking = true
    this.selectedDeviceId = null
  }

  getDefaultPosition() {
    return 'top-left'
  }

  setSelectedDevice(deviceId) {
    this.selectedDeviceId = deviceId
    this.updateVisibility()
    updateTrackingState(this.isTracking, deviceId)
  }

  setTrackingState(isTracking) {
    this.isTracking = isTracking
    this.updateButtonState()
    updateTrackingState(isTracking, this.selectedDeviceId)
  }

  updateVisibility() {
    if (this.button) {
      if (this.selectedDeviceId && this.selectedDeviceId !== 'undefined') {
        this.button.style.display = 'block'
      } else {
        this.button.style.display = 'none'
      }
    }
  }

  showButton() {
    if (this.button) {
      this.button.style.display = 'block'
    }
  }

  hideButton() {
    if (this.button) {
      this.button.style.display = 'none'
    }
  }

  updateButtonState() {
    if (this.button) {
      if (this.isTracking) {
        this.button.classList.remove('tracking-inactive')
        this.button.classList.add('tracking-active')
        if (this.iconSpan) {
          this.iconSpan.style.backgroundImage = `url("${trackActiveSvg}")`
        }
        this.button.title = 'توقف تعقیب دستگاه'
      } else {
        this.button.classList.remove('tracking-active')
        this.button.classList.add('tracking-inactive')
        if (this.iconSpan) {
          this.iconSpan.style.backgroundImage = `url("${trackInactiveSvg}")`
        }
        this.button.title = 'شروع تعقیب دستگاه'
      }
    }
  }

  onAdd(map) {
    this.map = map
    this.controlContainer = document.createElement('div')
    this.controlContainer.classList.add('maplibregl-ctrl')
    this.controlContainer.classList.add('maplibregl-ctrl-group')
    this.controlContainer.style.marginBottom = '10px'
    this.controlContainer.style.position = 'relative'
    this.controlContainer.style.zIndex = '1'

    this.button = document.createElement('button')
    this.button.type = 'button'
    const span = document.createElement('span')
    this.iconSpan = span
    // ensure svg background is handled on span not affected by button hover
    this.iconSpan.style.display = 'block'
    this.iconSpan.style.width = '33px'
    this.iconSpan.style.height = '33px'
    this.iconSpan.style.backgroundRepeat = 'no-repeat'
    this.iconSpan.style.backgroundPosition = 'center'
    this.iconSpan.style.backgroundOrigin='content-box'
    this.iconSpan.style.backgroundSize = '33px'
    this.iconSpan.style.pointerEvents = 'none'
    this.iconSpan.style.paddingTop='7px'
    this.button.appendChild(span)
    this.button.classList.add('maplibregl-ctrl-icon')
    this.button.classList.add('tracking-control')
    this.button.classList.add('tracking-inactive')
    this.button.style.width = '33px'
    this.button.style.height = '33px'
    // move background image to span so hover styles don't affect svg colors
    this.iconSpan.style.backgroundImage = this.isTracking ? `url("${trackActiveSvg}")` : `url("${trackInactiveSvg}")`
    this.button.title = 'شروع تعقیب دستگاه'
    this.button.style.display = 'none'
    this.button.style.border = 'none'
    // this.button.style.backgroundColor = 'white'
    this.button.style.cursor = 'pointer'
    this.button.style.borderRadius = '3px'
    this.button.style.boxShadow = '0 0 6px 2px rgba(0, 0, 0, 0.08)'
    this.button.style.transition = 'all 0.2s ease'

    // this.button.addEventListener('mouseenter', () => {
    //   this.button.style.backgroundColor = 'rgb(0 0 0 / 5%)'
    // })
    //
    // this.button.addEventListener('mouseleave', () => {
    //   this.button.style.backgroundColor = 'white'
    // })

    this.button.addEventListener('click', () => {
      this.isTracking = !this.isTracking
      this.updateButtonState()
      updateTrackingState(this.isTracking, this.selectedDeviceId)
      if (this.onTrackingToggle) {
        this.onTrackingToggle(this.isTracking, this.selectedDeviceId)
      }
    })

    this.controlContainer.appendChild(this.button)
    this.updateVisibility()
    return this.controlContainer
  }

  onRemove() {
    if (this.controlContainer && this.controlContainer.parentNode) {
      this.controlContainer.parentNode.removeChild(this.controlContainer)
    }
  }
}

const trackingControl = new TrackingControl()

export {addTrackingListener, removeTrackingListener, updateTrackingState}

const MapView = ({
                   children,
                   zoomCheck = false,
                   mapZoom = 17,
                   showDeviceFollow = false,
                   selectedMapStyle = '',
                   showStyles = true,
                 }) => {
  const containerEl = useRef(null)

  const [mapReady, setMapReady] = useState(false)
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const [isTracking, setIsTracking] = useState(false)

  const mapStyles = useMapStyles()
  const activeMapStyles = useAttributePreference(
    'activeMapStyles',
    'osm,locationIqStreets,carto',
  )
  const [defaultMapStyle] = usePersistedState(
    'selectedMapStyle',
    usePreference('map', 'osm'))
  const mapboxAccessToken = useAttributePreference('mapboxAccessToken')
  const maxZoom = useAttributePreference('web.maxZoom')
  const mapFollow = useAttributePreference('mapFollow', true)

  // Tracking control is now handled in DeviceItem sidebar
  // Removed tracking control from map

  // useEffect(() => {
  //   console.log({mapFollow})
  //   if (mapFollow) {
  //     trackingControl.showButton()
  //   } else {
  //     trackingControl.hideButton()
  //   }
  // }, [mapFollow, mapReady])

  // Handle selected device changes
  useEffect(() => {
    if (mapReady && selectedDeviceId) {
      const deviceTrackingState = getDeviceTrackingState(selectedDeviceId)
      setIsTracking(deviceTrackingState)
      trackingControl.setSelectedDevice(selectedDeviceId)
      trackingControl.setTrackingState(deviceTrackingState)
    } else if (mapReady) {
      setIsTracking(false)
      trackingControl.setSelectedDevice(null)
      trackingControl.setTrackingState(false)
    }
  }, [selectedDeviceId, mapReady])

  // Handle tracking toggle (now handled in DeviceItem, but keeping for compatibility)
  const handleTrackingToggle = (tracking, deviceId) => {
    setIsTracking(tracking)
    if (tracking) {
      // Start tracking - this will be handled by MapSelectedDevice component
      console.log('Tracking started for device:', deviceId)
    } else {
      // Stop tracking
      console.log('Tracking stopped for device:', deviceId)
    }
  }

  // Set up tracking control callback
  useEffect(() => {
    trackingControl.onTrackingToggle = handleTrackingToggle
  }, [])

  // Make tracking state available globally
  useEffect(() => {
    if (mapReady) {
      map.trackingState = {isTracking, selectedDeviceId}
    }
  }, [isTracking, selectedDeviceId, mapReady])

  useEffect(() => {
    if (maxZoom) {
      map.setMaxZoom(maxZoom)
    }
  }, [maxZoom])

  useEffect(() => {

  }, [])

  useEffect(() => {
    config.apiKey = mapboxAccessToken
  }, [mapboxAccessToken])

  useEffect(() => {
    try {
      if (zoomCheck) {
        if (selectedDeviceId != 'undefined') {
          if (map.setZoom)
            map?.setZoom(17)
        } else {
          if (map && map.setZoom)
            map?.setZoom(14)
        }
      }
    } catch (e) {

    }
  }, [selectedDeviceId])

  useEffect(() => {
    if (selectedMapStyle != '') {
      const filteredStyles = mapStyles.filter(
        (s) => s.id == selectedMapStyle)
      if (filteredStyles.length > 0) {
        switcher.updateStyles(filteredStyles, selectedMapStyle)
      }

    } else {
      const filteredStyles = mapStyles.filter(
        (s) => s.available && activeMapStyles.includes(s.id),
      )
      const styles = filteredStyles.length
        ? filteredStyles
        : mapStyles.filter((s) => s.id === 'osm')
      switcher.updateStyles(styles, defaultMapStyle)
    }
  }, [mapStyles, defaultMapStyle, selectedMapStyle])

  useEffect(() => {
    if (showStyles) {
      switcher.showStyles()
    } else {
      switcher.hidStyles()
    }
  }, [showStyles])

  useEffect(() => {
    const listener = (ready) => setMapReady(ready)
    addReadyListener(listener)
    return () => {
      if (selectedMapStyle != '') {
        const filteredStyles = mapStyles.filter(
          (s) => s.id == defaultMapStyle)
        if (filteredStyles.length > 0) {
          switcher.updateStyles(filteredStyles, defaultMapStyle)
        }
      }
      removeReadyListener(listener)
    }
  }, [])

  // Guard against rapid repeated clicks on the compass (reset bearing to north)
  useEffect(() => {
    let cleanup = () => {}
    // Try to find the compass button after controls are rendered
    const tryAttach = () => {
      try {
        const compass = element?.querySelector?.('.maplibregl-ctrl-compass')
        if (!compass) return false
        if (compass.dataset && compass.dataset.guardAttached === '1') return true

        let clickLocked = false
        let rafId
        const unlock = () => {
          clickLocked = false
          try {
            if (compass) {
              // Re-enable interaction and clear disabled flags
              compass.removeAttribute && compass.removeAttribute('disabled')
              compass.setAttribute && compass.setAttribute('aria-disabled', 'false')
            }
          } catch (e) {}
          try { if (rafId) cancelAnimationFrame(rafId) } catch (e) {}
        }
        const onClick = (e) => {
          if (clickLocked) {
            e.preventDefault && e.preventDefault()
            e.stopImmediatePropagation && e.stopImmediatePropagation()
            return
          }
          // Lock immediately to ignore additional clicks in this cycle
          clickLocked = true
          // Defer disabling attribute to allow the control's native click handler to run
          setTimeout(() => {
            try {
              if (compass) {
                compass.setAttribute && compass.setAttribute('disabled', 'true')
                compass.setAttribute && compass.setAttribute('aria-disabled', 'true')
                compass.blur && compass.blur()
              }
            } catch (e) {}
          }, 0)
          // Start fast polling via render loop to unlock as soon as motion stops
          const checkDone = () => {
            try {
              const bearing = typeof map.getBearing === 'function' ? map.getBearing() : 0
              const pitch = typeof map.getPitch === 'function' ? map.getPitch() : 0
              const moving = typeof map.isMoving === 'function' ? map.isMoving() : false
              const rotating = typeof map.isRotating === 'function' ? map.isRotating() : false
              const nearlyNorth = Math.abs(bearing) <= 0.01
              const nearlyLevel = Math.abs(pitch) <= 0.01
              if (!moving && !rotating && nearlyNorth && nearlyLevel) {
                unlock()
                return
              }
            } catch (e) {}
            rafId = requestAnimationFrame(checkDone)
          }
          try { rafId = requestAnimationFrame(checkDone) } catch (e) {}
          // If no animation will happen (already north/no movement), unlock quickly
          try {
            const bearing = typeof map.getBearing === 'function' ? map.getBearing() : 0
            const pitch = typeof map.getPitch === 'function' ? map.getPitch() : 0
            const moving = typeof map.isMoving === 'function' ? map.isMoving() : false
            const rotating = typeof map.isRotating === 'function' ? map.isRotating() : false
            const needsWait = moving || rotating || Math.abs(bearing) > 0.01 || Math.abs(pitch) > 0.01
            if (!needsWait) {
              setTimeout(unlock, 60)
              return
            }
          } catch (e) {}
          // Fallback unlock in case end events don't fire (defensive, shorter for responsiveness)
          setTimeout(() => {
            try { if (rafId) cancelAnimationFrame(rafId) } catch (e) {}
            unlock()
          }, 700)
        }
        const onRotateEnd = () => unlock()
        const onMoveEnd = () => unlock()
        const onPitchEnd = () => unlock()
        const onIdle = () => unlock()
        const onMouseLeave = () => unlock()

        compass.addEventListener('click', onClick, true)
        compass.addEventListener('mouseleave', onMouseLeave, true)
        map.on('rotateend', onRotateEnd)
        map.on('moveend', onMoveEnd)
        try { map.on('pitchend', onPitchEnd) } catch (e) {}
        try { map.on('idle', onIdle) } catch (e) {}
        if (compass.dataset) compass.dataset.guardAttached = '1'

        cleanup = () => {
          try {
            compass.removeEventListener('click', onClick, true)
          } catch (e) {}
          try {
            compass.removeEventListener('mouseleave', onMouseLeave, true)
          } catch (e) {}
          try {
            map.off('rotateend', onRotateEnd)
          } catch (e) {}
          try {
            map.off('moveend', onMoveEnd)
          } catch (e) {}
          try { map.off('pitchend', onPitchEnd) } catch (e) {}
          try { map.off('idle', onIdle) } catch (e) {}
        }
        return true
      } catch (e) {
        return false
      }
    }

    let attached = tryAttach()
    let timerId
    if (!attached) {
      timerId = setInterval(() => {
        if (tryAttach()) {
          attached = true
          clearInterval(timerId)
        }
      }, 250)
    }

    return () => {
      // try { if (timerId) clearInterval(timerId) } catch (e) {}
      // cleanup()
    }
  }, [])

  useLayoutEffect(() => {
    const currentEl = containerEl.current
    currentEl.appendChild(element)
    map.resize()
    return () => {
      try {
        currentEl.removeChild(element)
      } catch (e) {

      }
    }
  }, [containerEl])

  return (
    <div style={{width: '100%', height: '100%'}} ref={containerEl}>
      {mapReady && children}
    </div>
  )
}

export default MapView
