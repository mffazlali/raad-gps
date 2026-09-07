import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import cls from 'classnames'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useAttributePreference} from '../../common/util/preferences.js'
import usePersistedState from '../../common/util/usePersistedState.js'
import EventsDrawer from './EventsDrawer.jsx'
import MainMap from './MainMap.jsx'
import DeviceList from './sidebarDevices/deviceList/deviceList.jsx'
import CardDevice from './cardDevice/CardDevice.jsx'
import useFilter from './useFilter.js'
import CardDevicesMobile from './CardDevicesMobile/CardDevicesMobile.jsx'
import {devicesActions, layoutActions} from '../../common/clientStore/index.js'
import MainMobileHeader from './mainMobileHeader/MainMobileHeader.jsx'
import {useDevices} from '../../common/serverStore/index.js'

const MainMobilePage = () => {
  const dispatch = useDispatch()
  const theme = useTheme()

  const desktop = useMediaQuery(theme.breakpoints.up('md'))

  const mapOnSelect = useAttributePreference('mapOnSelect', true)

  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const positions = useSelector((state) => state.session.positions)
  const currentUser = useSelector((state) => state.session.user)

  const [filteredPositions, setFilteredPositions] = useState([])
  const [selectedPosition, setSelectedPosition] = useState()
  const [addressOpen, setAddressOpen] = useState(false)
  // const filteredDevices = useSelector((state) => state.layout.filteredDevices)
  const [showDevices, setShowDevices] = useState(false)

  useEffect(() => {
    const tempSelectedPosition = Object.values(positions).find(
      (position) => selectedDeviceId && position.deviceId == selectedDeviceId,
    )
    setSelectedPosition(tempSelectedPosition)
  }, [selectedDeviceId, positions])

  const devices = useSelector((state) => state.devices.items)
  const [filteredDevices, setFilteredDevices] = useState(devices)

  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = usePersistedState('filter', {
    statuses: [],
    groups: [],
  })
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '')
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false)
  const {data: devicesQuery = [], isLoading, isFetching, dataUpdatedAt} = useDevices(currentUser.id)

  const [devicesOpen, setDevicesOpen] = useState(desktop)
  const [eventsOpen, setEventsOpen] = useState(false)

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen])

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false)
    }
  }, [desktop, mapOnSelect, selectedDeviceId])

  useEffect(() => {
    let deviceList = Object.entries(devices).map((value) => {
      return value[1]
    })
    setFilteredDevices(deviceList)
  }, [devices])

  // const setFilteredDevices = (devices) => {
  //   dispatch(layoutActions.setFilteredDevices(devices))
  // }

  useEffect(() => {
    setFilteredDevices(devices)
  }, [devices])

  useEffect(() => {
    if (dataUpdatedAt) {
      dispatch(devicesActions.refresh(devicesQuery))
    }
  }, [dataUpdatedAt])

  useEffect(() => {
    setAddressOpen(false)
  }, [selectedDeviceId])

  const setOpen=(value)=>{
    setAddressOpen(value)
  }

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions,
  )

  return (
    <>
      <MainMobileHeader devices={filteredDevices} setKeyword={setKeyword} showDevices={showDevices} setShowDevices={setShowDevices} />
      <div className={'h-[calc(100%-44px)]'}>
        <div className={'h-full flex flex-col'}>
          {selectedDeviceId && selectedDeviceId != 'undefined' && (
            <CardDevice
              position={selectedPosition}
              deviceId={selectedDeviceId}
              addressOpen={addressOpen}
              setAddressOpen={setOpen}
              isMobileMedia={true}
            />
          )}
          <div className={'max-h-[100%] h-full'}>
            <MainMap
              filteredPositions={filteredPositions}
              selectedPosition={selectedPosition}
              onEventsClick={onEventsClick}
              addressOpen={addressOpen}
            />
          </div>
        </div>
      </div>
      <CardDevicesMobile devices={filteredDevices} showDevices={showDevices} setShowDevices={setShowDevices} />
    </>
  )
}

export default MainMobilePage
