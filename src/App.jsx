import React, {useEffect, useLayoutEffect, useState, Suspense, lazy} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import SocketController from './common/controllers/SocketController.jsx'
import CachingController from './common/controllers/CachingController.js'
import {useEffectAsync} from './common/util/reactHelper.js'
import {notificationsActions, sessionActions, errorsActions, devicesActions} from './common/clientStore'
import Progress from './common/components/custom/feedback/progress/Progress.jsx'
import {ConfigProvider} from 'antd'
import UpdateController from './common/controllers/UpdateController'
import {AuthService} from './common/services/authService.jsx'
import useConnectChecker from './common/util/useConnectChecker'
import useNotification from './common/util/useNotification'
import useHistoryFlagState from './common/util/useHistoryFlagState.js'
import usePersistedCheckInOutTime from './common/util/usePersistedCheckInOutTime.js'
import usePersistedNotificationsState from './common/util/usePersistedNotificationsState.js'
import useMobileQuery from './common/util/useMobileQuery.jsx'
import {useTranslation} from './common/components/LocalizationProvider.jsx'
import PWAController from './common/controllers/PWAController.jsx'
import axios from 'axios'
import axiosInstance from './common/util/axiosConfig'
import {getDevicesRoutesState, saveDevicesRoutesState} from './common/util/devicesRoutesStateUtil.js'
import DevicePathTracker from './common/util/devicePathTracker'

// Lazy load components
const MainLayout = lazy(() => import('./common/layouts/mainLayout/MainLayout.jsx'))
const MobileLayout = lazy(() => import('./common/layouts/mobileLayout/MobileLayout.jsx'))

const preloadImages = () => import('./common/map/core/preloadImages.js').then(module => module.default())

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const newServer = useSelector((state) => state.session.server?.newServer)
  const user = useSelector((state) => state.session.user)
  const initialized = useSelector((state) => !!state.session.user)
  const socket = useSelector((state) => state.session.socket)
  const historyFlags = useSelector((state) => state.session.historyFlag)
  const devicePathTrackers = useSelector((state) => state.session.devicePathTrackers)
  const {contextHolder, showNotification, closeNotification} = useNotification()
  const online = useConnectChecker()
  const {getHistoryFlagState, saveHistoryFlagState} = useHistoryFlagState()
  const {saveFirstTime, saveLastTime} = usePersistedCheckInOutTime()
  const {saveNotifications, getNotifications, getNotificationsFlag} = usePersistedNotificationsState()
  const notifications = useSelector((state) => state.notifications.items)
  const {mobileState, handleQuery} = useMobileQuery()
  const {pathname} = useLocation()
  const errorMessage = useSelector((state) => state.errors.errorMessage)
  const t = useTranslation()

  useEffect(() => {
    saveHistoryFlagState(historyFlags)
  }, [historyFlags])

  useEffect(() => {
    if (initialized) {
      preloadImages()
      saveFirstTime()
      const notificationsStore = getNotifications()
      if (notificationsStore != null) {
        dispatch(notificationsActions.setItems({...notificationsStore}))
      }
      const notificationsFlagStore = getNotificationsFlag()
      if (notificationsFlagStore != null) {
        dispatch(notificationsActions.setNotificationFlag({...notificationsFlagStore}))
      }

      // Load history flag
      const historyFlagsValue = getHistoryFlagState()
      if (historyFlagsValue !== null) {
        dispatch(sessionActions.updateHistoryFlag(historyFlagsValue))
      }

      // Load saved device routes
      const savedRoutes = getDevicesRoutesState()
      if (savedRoutes) {
        dispatch(sessionActions.updateDevicePathTrackers(savedRoutes))
      }

      const handelBeforeunload = (event) => {
        saveLastTime()
        // saveNotifications(notifications)
      }
      window.addEventListener(' beforeunload', handelBeforeunload)
      return () => {
        saveLastTime()
        // saveNotifications('notifications')
        window.removeEventListener('beforeunload', handelBeforeunload)
      }
    }
  }, [initialized])

  useEffectAsync(async () => {
    if (!initialized) {
      // navigate('/login')
    }
    //
    //   if (!initialized) {
    //     const isToken = import.meta.env.VITE_APP_API_IS_TOKEN ? import.meta.env.VITE_APP_API_IS_TOKEN?.toLowerCase?.() === 'true' : false
    //     try {
    //       let response
    //       if (isToken) {
    //         const token = localStorage.getItem('notificationToken')
    //         response = await AuthService.TokenService(token)
    //       } else {
    //         response = await AuthService.SessionService()
    //       }
    //       if (response.status === 200) {
    //         // const responsePermissions = await axiosInstance.get(`/api/users/my-permissions`)
    //         // if (responsePermissions.status === 200) {
    //         //   const resultPermissions = responsePermissions.data
    //         //   const permissions = [...resultPermissions].map(item => item['name'])
    //         //   dispatch(sessionActions.updatePermissions(permissions))
    //         dispatch(sessionActions.updateUser(response.data))
    //         console.log('user')
    //         // const [deviceResponse, positionsResponse] = await Promise.all([
    //         //   axiosInstance.get(`/api/devices?userId=${response.data.id}`),
    //         //   axiosInstance.get('/api/positions'),
    //         // ])
    //         // if (positionsResponse.status === 200 && deviceResponse.status === 200) {
    //         //   dispatch(sessionActions.updatePositions(positionsResponse.data))
    //         //   dispatch(devicesActions.refresh(deviceResponse.data))
    //         // }
    //         // }
    //       } else if (newServer) {
    //         dispatch(sessionActions.updateUser(null))
    //         // navigate('/register')
    //         navigate('/login')
    //       } else {
    //         dispatch(sessionActions.updateUser(null))
    //         navigate('/login')
    //       }
    //     } catch (e) {
    //       dispatch(sessionActions.updateUser(null))
    //       if (newServer) {
    //         // navigate('/register')
    //         navigate('/login')
    //       } else {
    //         navigate('/login')
    //       }
    //     }
    //   }
    //   return null
  }, [initialized])

  useLayoutEffect(() => {
    handleQuery()
  }, [])

  useEffect(() => {
    if (!online) {
      if (initialized) {
        closeNotification('socketConnection')
        showNotification({
          message: t('responseConnectAPI'), type: 'error', duration: 0, key: 'internetNetwork',
        })
      } else {
        dispatch(errorsActions.updateErrorMessage(t('responseConnectAPI')))
      }
    } else {
      closeNotification('internetNetwork')
      dispatch(errorsActions.updateErrorMessage(''))
    }
  }, [online])

  useEffect(() => {
    if (online) {
      if (socket === false) {
        if (initialized) {
          // showNotification({
          //   message: t('responseConnectSocket'), type: 'error', duration: 0, key: 'socketConnection',
          // })
        } else {
          dispatch(errorsActions.updateErrorMessage(t('responseConnectSocket')))
        }
      } else {
        // closeNotification('socketConnection')
        dispatch(errorsActions.updateErrorMessage(''))
      }
    }
  }, [socket])

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '#22c55e',
            colorTextBase: '#000',
            borderRadius: 8,
          },
        }}
      >
        {contextHolder}
        <SocketController />

        {initialized && <CachingController />}
        <UpdateController />
        {initialized && <PWAController />}

        {!mobileState && <div>
          {initialized && (
            <Suspense fallback={<Progress reload={() => navigate('/')} />}>
              <MainLayout />
            </Suspense>
          )}
          {!initialized && <Progress reload={() => navigate('/')} />}
        </div>}
        {mobileState && <div>
          {initialized && (
            <Suspense fallback={<Progress reload={() => navigate('/')} />}>
              <MobileLayout />
            </Suspense>
          )}
          {!initialized && <Progress reload={() => navigate('/')} />}
        </div>}

      </ConfigProvider>
    </>
  )
}

export default App
