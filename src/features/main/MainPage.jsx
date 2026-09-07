import cls from 'classnames'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import usePersistedState from '../../common/util/usePersistedState.js'
import EventsDrawer from './EventsDrawer.jsx'
import MainMap from './MainMap.jsx'
import CardDevice from './cardDevice/CardDevice.jsx'
import useFilter from './useFilter.js'
import SidebarDevices from './sidebarDevices/SidebarDevices.jsx'
import ServerTime from './serverTime/ServerTime'
import axios from 'axios'
import axiosInstance from '../../common/util/axiosConfig'
import {devicesActions, sessionActions} from '../../common/clientStore/index.js'
import {useEffectAsync} from '../../common/util/reactHelper.js'
import {useDevices} from '../../common/serverStore/index.js'

const MainPage = () => {
  // const mapOnSelect = useAttributePreference('mapOnSelect', true)
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const positions = useSelector((state) => state.session.positions)
  const [filteredPositions, setFilteredPositions] = useState([])
  const [selectedDeviceIdState, setSelectedDeviceIdState] = useState(undefined)
  const [selectedPosition, setSelectedPosition] = useState({})
  const currentUser = useSelector((state) => state?.session?.user)

  const devices = useSelector((state) => state.devices.items)
  const [filteredDevices, setFilteredDevices] = useState(devices)

  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = usePersistedState('filter', {
    statuses: [],
    groups: [],
  })
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '')
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false)

  const [eventsOpen, setEventsOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen])
  const dispatch = useDispatch()

  const {data: devicesQuery = [], isLoading, isFetching, dataUpdatedAt} = useDevices(currentUser.id)

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions)

  useEffectAsync(async () => {
    if (!devices || Object.entries(devices).length <= 0) {
      const [deviceResponse, positionsResponse] = await Promise.all([
        axiosInstance.get(`/api/devices/sessionDevices?userId=${currentUser.id}`),
        axiosInstance.get('/api/positions'),
      ])
      if (deviceResponse.status === 200 && positionsResponse.status === 200) {
        dispatch(sessionActions.updatePositions(positionsResponse.data))
        dispatch(devicesActions.refresh(deviceResponse.data))
      }
    }
  }, [])

  useEffect(() => {
    const tempSelectedPosition = Object.values(positions).find(
      (position) => selectedDeviceId && position?.deviceId == selectedDeviceId,
    )
    if (tempSelectedPosition) {
      setSelectedPosition(tempSelectedPosition)
    } else {
      setSelectedPosition(undefined)
      setSelectedDeviceIdState(selectedDeviceId)
    }
  }, [selectedDeviceId, positions])


  useEffect(() => {
    setSelectedDeviceIdState(selectedDeviceId)
  }, [selectedPosition])

  useEffect(() => {
    if (dataUpdatedAt) {
      dispatch(devicesActions.refresh(devicesQuery))
    }
  }, [dataUpdatedAt])

  useEffect(() => {
    setFilteredDevices(devices)
  }, [devices])

  useEffect(() => {
    setAddressOpen(false)
  }, [selectedDeviceId])

  const setOpen = (value) => {
    setAddressOpen(value)
  }
  return (
    <div className={cls('relative h-full w-full transition-all')}>
      <SidebarDevices
        devices={filteredDevices}
      />
      <div className={'float-left md:w-[calc(100%-300px)] sm:w-[calc(100%-230px)] h-full'}>
        <MainMap
          filteredPositions={filteredPositions}
          selectedPosition={selectedPosition}
          onEventsClick={onEventsClick}
          addressOpen={addressOpen}
        />
      </div>

      {/*<EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />*/}
      {selectedDeviceIdState && selectedDeviceIdState != 'undefined' && (
        <CardDevice
          position={selectedPosition}
          deviceId={selectedDeviceId}
          addressOpen={addressOpen}
          setAddressOpen={setOpen}
          isMobileMedia={false}
        />
      )}

    </div>
  )
}

export default MainPage
