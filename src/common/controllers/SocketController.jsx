import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector, connect} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import {devicesActions, sessionActions} from '../clientStore/index.js'
import {useEffectAsync} from '../util/reactHelper.js'
import {useTranslation} from '../components/LocalizationProvider.jsx'
import alarm from '../../resources/alarm.mp3'
import {eventsActions} from '../clientStore/events.js'
import {notificationsActions} from '../clientStore/notifications.js'
import useFeatures from '../util/useFeatures.js'
import {useAttributePreference, usePreference} from '../util/preferences.js'
import useNotification from '../util/useNotification'
import usePersistedNotificationsState from '../util/usePersistedNotificationsState.js'
import axiosInstance from '../util/axiosConfig'

const logoutCode = 4000


const SocketController = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const historyFlags = useSelector((state) => state.session.historyFlag)
  const t = useTranslation()

  const authenticated = useSelector((state) => !!state.session.user)
  const devices = useSelector((state) => state.devices.items)
  const socketMode = useSelector((state) => state.session.socket)
  let [socketCounterTimeOut, setSocketCounterTimeOut] = useState(0)
  const socketRef = useRef()

  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [enableNotifications, setEnableNotifications] = useState(true)
  const soundEvents = useAttributePreference('soundEvents', '')
  const soundAlarms = useAttributePreference('soundAlarms', 'sos')
  const {contextHolder, showNotification, closeNotification} = useNotification()
  const features = useFeatures()
  const hours12 = usePreference('twelveHourFormat')
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const {saveNotifications, getNotifications, saveNotificationsFlag} = usePersistedNotificationsState()
  const notificationsItems = useSelector((state) => state.notifications.items)
  const notificationsFlags = useSelector((state) => state.notifications.flags)
  const currentUser = useSelector((state) => state?.session?.user)
  const positions = useSelector((state) => state?.session?.positions)
  const devicePathTrackers = useSelector((state) => state?.session?.devicePathTrackers)


  const connectSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/socket`)
    let timeoutSocket
    socketRef.current = socket
    socket.onopen = () => {
      dispatch(sessionActions.updateSocket(true))
      console.log('onopen')
    }

    socket.onclose = async (event) => {
      console.log('onclose')
      if (event.code !== logoutCode) {
        try {
          const timestampResponse = await axiosInstance.get('/api/timestamp/public')
          if (timestampResponse.status === 200) {
            dispatch(sessionActions.updateTimestamp(timestampResponse.data))
          }
          const devicesResponse = await axiosInstance.get(`/api/devices/sessionDevices?userId=${currentUser.id}`)
          if (devicesResponse.status === 200) {
            dispatch(devicesActions.update(devicesResponse.data))
          }
          const positionsResponse = await axiosInstance.get('/api/positions')
          if (positionsResponse.status === 200) {
            dispatch(sessionActions.updatePositions(positionsResponse.data))
          }
          if (devicesResponse.status === 401 || positionsResponse.status === 401) {
            navigate('/login')
          }
        } catch (error) {
          // console.error('Error fetching data:', error)
        }
        if (socketCounterTimeOut >= 0) {
          dispatch(sessionActions.updateSocket(false))
          setSocketCounterTimeOut(0)
        } else {
          setSocketCounterTimeOut(socketCounterTimeOut + 1)
        }
        setTimeout(() => {
          connectSocket()
        }, 1000)
      }
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if(data.timestamp){
        dispatch(sessionActions.updateTimestamp(data.timestamp))
      }

      if (data.positions) {
        dispatch(sessionActions.updatePositions(data.positions))
        dispatch(sessionActions.updateDeviceRoutes(data.positions))
      }

      if (data.devices) {
        dispatch(devicesActions.update(data.devices))
      }
      if (data.events) {
        // if (!features.disableEvents) {
        dispatch(notificationsActions.add(data.events))
        // }
        setEvents(data.events)
      }
    }
  }

  useEffect(() => {
    if (events.length > 0)
      saveNotifications(notificationsItems)
  }, [notificationsItems])

  // useEffect(()=>{
  //   console.log({devicePathTrackers})
  // },[devicePathTrackers])

  // useEffect(() => {
  //   const interval = setInterval(() => setTimestamp(Date.now()), 1000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  // useEffect(() => {
  //   let deviceList = Object.values(devices)
  //   const resultDevices = []
  //   const resulPositions = []
  //   if (deviceList.length > 0) {
  //     deviceList.filter(device => {
  //       const deviceTime = dayjs(positions[String(device.id)].deviceTime)
  //       const currentDay = dayjs()
  //       const diffSecond = currentDay.diff(deviceTime, 'millisecond')
  //       return device.status === 'online' && diffSecond >= 5000
  //     }).forEach(device => {
  //       const currentDay = dayjs()
  //       resultDevices.push({
  //         ...device,
  //         status: 'offline',
  //         lastUpdate: currentDay.toISOString(),
  //         attributes: {...device.attributes, ignition: false},
  //       })
  //       if (positions[String(device.id)]) {
  //         resulPositions.push({
  //           ...positions[String(device.id)],
  //           deviceTime: currentDay.toISOString(),
  //           speed: 0,
  //           attributes: {...positions[String(device.id)].attributes, motion: false, ignition: false},
  //         })
  //       } else {
  //         resulPositions.push({
  //           deviceTime: currentDay.toISOString(),
  //           speed: 0,
  //           attributes: {motion: false, ignition: false},
  //         })
  //       }
  //     })
  //     if (resultDevices.length > 0) {
  //       dispatch(devicesActions.update(resultDevices))
  //       dispatch(sessionActions.updatePositions(resulPositions))
  //     }
  //   }
  // }, [timestamp])

  useEffect(() => {
    if (events.length > 0)
      saveNotificationsFlag(notificationsFlags)
  }, [notificationsFlags])

  useEffectAsync(async () => {
    if (authenticated && !socketRef.current) {
      connectSocket()
      return () => {
        const socket = socketRef.current
        if (socket) {
          socket.close(logoutCode)
        }
      }
    }
    return null
  }, [authenticated])

  useEffect(() => {
    if (enableNotifications && events && events.length > 0) {
      events.forEach((event) => {
        // if (event.deviceId == selectedDeviceId) {
        showNotification({
          message: event.attributes?.messageFa,
          type: 'info',
          duration: 6,
          placement: 'bottom',
          key: 'events',
          // onClose: () => setEvents(events.filter((e) => e.id !== event.id)),
        })
        // }
      })
    } else {
      closeNotification('events')
    }
  }, [events])

  useEffect(() => {
    events.forEach((event) => {
      if (soundEvents.includes(event.type) || (event.type === 'alarm' && soundAlarms.includes(event.attributes.alarm))) {
        new Audio(alarm).play()
      }
    })
  }, [events, soundEvents, soundAlarms])

  useEffect(() => {
    if (pathname === '/replay') {
      setEnableNotifications(false)
    } else {
      setEnableNotifications(true)
    }
  }, [pathname])

  return (
    <>
      {contextHolder}
    </>
  )
}

export default connect()(SocketController)
