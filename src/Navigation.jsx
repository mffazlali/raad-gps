import {useEffect, useLayoutEffect, useState, Suspense, lazy} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  Navigate, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom'
import App from './App.jsx'
import Progress from './common/components/custom/feedback/progress/Progress.jsx'
import ModalWrapper from './common/components/custom/feedback/modalWrapper/ModalWrapper'
import {devicesActions, sessionActions} from './common/clientStore/index.js'
import {useEffectAsync} from './common/util/reactHelper.js'
import useQuery from './common/util/useQuery'
// import LoginPage from './features/auth/login/LoginPage.jsx'
// import RegisterPage from './features/auth/register/RegisterPage.jsx'
// import ResetPasswordPage from './features/auth/resetPassword/ResetPasswordPage.jsx'
// import ChangePasswordPage from './features/auth/changePassword/ChangePasswordPage.jsx'
import NotFoundPage from './features/main/NotFoundPage.jsx'
import {AuthService} from './common/services/authService.jsx'
import axios from 'axios'
import axiosInstance from './common/util/axiosConfig'
import useMobileQuery from './common/util/useMobileQuery.jsx'

// Lazy load components
// const App = lazy(() => import('./App.jsx'))
const LoginPage = lazy(() => import('./features/auth/login/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./features/auth/register/RegisterPage.jsx'))
const ResetPasswordPage = lazy(() => import('./features/auth/resetPassword/ResetPasswordPage.jsx'))
const ChangePasswordPage = lazy(() => import('./features/auth/changePassword/ChangePasswordPage.jsx'))
const ReportPage = lazy(() => import('./features/report/ReportPage.jsx'))
const ChartReportPage = lazy(() => import('./features/report/chartReportPage/ChartReportPage'))
const CombinedReportPage = lazy(() => import('./features/report/combinedReportPage/CombinedReportPage'))
const EventReportPage = lazy(() => import('./features/report/eventReportPage/EventReportPage'))
const HeatReportPage = lazy(() => import('./features/report/heatReportPage/heatReportPage'))
const ReplayPage = lazy(() => import('./features/report/replayPage/ReplayPage'))
const RouteReportPage = lazy(() => import('./features/report/routeReportPage/RouteReportPage'))
const StopReportPage = lazy(() => import('./features/report/stopReportPage/StopReportPage'))
const SummaryReportPage = lazy(() => import('./features/report/summaryReportPage/SummaryReportPage'))
const TripReportPage = lazy(() => import('./features/report/tripReportPage/TripReportPage'))
const LoginHistory = lazy(() => import('./features/report/loginHistory/LoginHistory'))
const SettingsPage = lazy(() => import('./features/settings/SettingsPage.jsx'))
const Calendars = lazy(() => import('./features/settings/calendars/Calendars'))
const CalendarRegister = lazy(() => import('./features/settings/calendars/calendarRegister/CalendarRegister'))
const Commands = lazy(() => import('./features/settings/commands/Commands'))
const CommandRegister = lazy(() => import('./features/settings/commands/commandRegister/CommandRegister'))
const ComputedAttributes = lazy(() => import('./features/settings/computedAttributes/ComputedAttributes'))
const ComputedAttributeRegister = lazy(() => import('./features/settings/computedAttributes/computedAttributeRegister/ComputedAttributeRegister'))
const Devices = lazy(() => import('./features/settings/devices/Devices.tsx'))
const CommandDevice = lazy(() => import('./features/settings/devices/commandDevice/CommandDevice'))
const DeviceConnections = lazy(() => import('./features/settings/devices/deviceConnections/DeviceConnections'))
const DeviceRegister = lazy(() => import('./features/settings/devices/deviceRegister/DeviceRegister'))
const Drivers = lazy(() => import('./features/settings/drivers/Drivers'))
const DriverRegister = lazy(() => import('./features/settings/drivers/driverRegister/DriverRegister'))
const Geofences = lazy(() => import('./features/settings/geofences/Geofences'))
const GeofenceRegister = lazy(() => import('./features/settings/geofences/geofenceRegister/GeofenceRegister'))
const Groups = lazy(() => import('./features/settings/groups/Groups'))
const CommandGroup = lazy(() => import('./features/settings/groups/commandGroup/CommandGroup'))
const GroupConnections = lazy(() => import('./features/settings/groups/groupConnections/GroupConnections'))
const GroupRegister = lazy(() => import('./features/settings/groups/groupRegister/GroupRegister'))
const Maintenances = lazy(() => import('./features/settings/maintenances/Maintenances'))
const MaintenanceRegister = lazy(() => import('./features/settings/maintenances/maintenanceRegister/MaintenanceRegister'))
const Notifications = lazy(() => import('./features/settings/notifications/Notifications'))
const NotificationRegister = lazy(() => import('./features/settings/notifications/notificationRegister/NotificationRegister'))
const Preferences = lazy(() => import('./features/settings/preferences/Preferences'))
const Users = lazy(() => import('./features/users/users/Users'))
const UserConnections = lazy(() => import('./features/users/users/userConnections/UserConnections'))
const NotificationDevice = lazy(() => import('./features/main/notificatonDevice/NotificationDevice'))
const UserRegister = lazy(() => import('./features/users/users/userRegister/UserRegister.tsx'))
const UsersPage = lazy(() => import('./features/users/UsersPage.jsx'))
const Roles = lazy(() => import('./features/users/roles/Roles'))
const roleRegister = lazy(() => import('./features/users/roles/roleRegister/RoleRegister'))
const UserLogs = lazy(() => import('./features/users/users/userLogs/UserLogs'))
const UserRoles = lazy(() => import('./features/users/users/userRoles/UserRoles'))
const UserRoleRegister = lazy(() => import('./features/users/users/userRoles/userRoleRegister/UserRoleRegister'))
const Identifiers = lazy(() => import('./features/settings/identifiers/Identifiers'))
const IdentifierRegister = lazy(() => import('./features/settings/identifiers/identifierRegister/IdentifierRegister'))
const UserChangePassword = lazy(() => import('./features/users/users/userChangePassword/UserChangePassword'))

const Navigation = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [permissions, setPermissions] = useState([])
  const [routerIndexSettings, setRouterIndexSettings] = useState('')
  const [routerIndexUsers, setRouterIndexUsers] = useState('')
  const [routerIndexReports, setRouterIndexReports] = useState('')
  const newServer = useSelector((state) => state.session.server?.newServer)
  const curPermissions = useSelector((state) => state.session.permissions)
  const initialized = useSelector((state) => !!state.session.user)
  const currentUser = useSelector((state) => state?.session?.user)
  const [redirectsHandled, setRedirectsHandled] = useState(false)
  const {pathname} = useLocation()
  const query = useQuery()
  const {mobileState, handleQuery} = useMobileQuery()
  const location = useLocation()

  useEffect(() => {
    if (curPermissions.length > 0) {
      setPermissions(curPermissions)
      setRouterIndexSettings(getIndexRouterSettings(curPermissions))
      setRouterIndexUsers(getIndexRouterUsers(curPermissions))
      setRouterIndexReports(getIndexRouterReports(curPermissions))
    } else {
      setPermissions([])
      setRouterIndexSettings('')
      setRouterIndexUsers('')
      setRouterIndexReports('')
    }

  }, [curPermissions])

  useEffectAsync(async () => {
    if (!initialized) {
      const isToken = true
      const token = localStorage.getItem('notificationToken')
      if (!token) {
        dispatch(sessionActions.updateUser(null))
        navigate('/login')
        return
      }
// import.meta.env.VITE_APP_API_IS_TOKEN ? import.meta.env.VITE_APP_API_IS_TOKEN?.toLowerCase?.() === 'true' : false
      try {
        let response
        if (isToken) {
          response = await AuthService.TokenService(token)
        } else {
          response = await AuthService.SessionService()
        }
        if (response.status === 200) {
          dispatch(sessionActions.updateUser(response.data))
        } else if (newServer) {
          dispatch(sessionActions.updateUser(null))
          // navigate('/register')
          navigate('/login')
        } else {
          dispatch(sessionActions.updateUser(null))
          navigate('/login')
        }
      } catch (e) {
        dispatch(sessionActions.updateUser(null))
        if (newServer) {
          // navigate('/register')
          navigate('/login')
        } else {
          navigate('/login')
        }
      }

    }
  }, [])

  useEffectAsync(async () => {
    if (initialized) {
      try {
        const responsePermissions = await axiosInstance.get(`/api/users/my-permissions`)
        const resultPermissions = responsePermissions.data
        const permissions = [...resultPermissions].map(item => item['name'])
        setPermissions(permissions)
        setRouterIndexSettings(getIndexRouterSettings(permissions))
        setRouterIndexUsers(getIndexRouterUsers(permissions))
        setRouterIndexReports(getIndexRouterReports(permissions))
        dispatch(sessionActions.updatePermissions(permissions))
        // dispatch(sessionActions.updateUser(response.data))
        const [deviceResponse, positionsResponse] = await Promise.all([
          axiosInstance.get(`/api/devices/sessionDevices?userId=${currentUser.id}`),
          axiosInstance.get('/api/positions'),
        ])
        if (positionsResponse.status === 200 && deviceResponse.status === 200) {
          dispatch(sessionActions.updatePositions(positionsResponse.data))
          dispatch(devicesActions.refresh(deviceResponse.data))
        }
      } catch (e) {

      }

    }
  }, [initialized])


  useEffectAsync(async () => {
    if (query.get('token')) {
      const token = query.get('token')
      await axiosInstance.get(`/api/session?token=${encodeURIComponent(token)}`)
      navigate(pathname)
    } else if (query.get('deviceId')) {
      const deviceId = query.get('deviceId')
      const response = await axiosInstance.get(`/api/devices/sessionDevices?uniqueId=${deviceId}`)
      if (response.status === 200) {
        const items = response.data
        if (items.length > 0) {
          dispatch(devicesActions.selectId(items[0].id))
        }
      } else {
        throw Error(response.data)
      }
      navigate('/')
    } else if (query.get('eventId')) {
      const eventId = parseInt(query.get('eventId'), 10)
      navigate(`/event/${eventId}`)
    } else {
      setRedirectsHandled(true)
    }
  }, [query])

  useLayoutEffect(() => {
    handleQuery()
  }, [])

  const getIndexRouterSettings = (permissionList) => {
    const permissionsRoute = [
      {permission: 'User-update', route: 'preferences'},
      {permission: 'Event-read', route: 'notifications'},
      {permission: 'Device-read', route: 'devices'},
      {permission: 'Imei-read', route: 'identifier'},
      {permission: 'User-Geofence', route: 'geofences'},
      {permission: 'User-Driver', route: 'drivers'},
      {permission: 'Maintenance-read', route: 'maintenances'},
      {permission: 'Imei-read', route: 'identifiers'},
    ]
    for (const item of permissionsRoute) {
      if (permissionList.includes(item.permission)) {
        return item.route
      }
    }
    return ''
  }

  const getIndexRouterUsers = (permissionList) => {
    const permissionsRoute = [{permission: 'User-read', route: 'users'}, {permission: 'Role-read', route: 'roles'}]
    for (const item of permissionsRoute) {
      if (permissionList.includes(item.permission)) {
        return item.route
      }
    }
    return ''
  }

  const getIndexRouterReports = (permissionList) => {
    const permissionsRoute = [{permission: 'getCombined', route: 'combined'}, {
      permission: 'getRoute',
      route: 'route',
    }, {permission: 'getEvents', route: 'event'}, {
      permission: 'getIgnitionOn',
      route: 'stop',
    }, {permission: 'getIgnitionDiagram', route: 'chart'}, {permission: 'getStopTime', route: 'replay'},
      {permission: 'getHeatCombined', route: 'heat'},
      // {permission: 'getLoginHistory', route: 'loginhistory'}
    ]
    for (const item of permissionsRoute) {
      if (permissionList.includes(item.permission)) {
        return item.route
      }
    }
    return ''
  }

  if (!redirectsHandled) {
    return <Progress reload={() => navigate('/')} />
  }
  return (
    <Suspense fallback={<Progress reload={() => navigate('/')} />}>
      {mobileState ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/" element={<App />}>
            <Route path="notification/:id"
                   element={<ModalWrapper typeForm={'mobileContentPopup'} RegisterComponent={NotificationDevice} />} />
            <Route path="device"
                   element={<ModalWrapper typeForm={'mobileContentPopup'} RegisterComponent={DeviceRegister} />} />
            <Route path="device/:id"
                   element={<ModalWrapper typeForm={'mobileContentPopup'} RegisterComponent={DeviceRegister} />} />
            <Route path="user"
                   element={<ModalWrapper typeForm={'mobileContentPopup'} RegisterComponent={UserRegister} />} />
            <Route path="user/:id"
                   element={<ModalWrapper typeForm={'mobileContentPopup'} RegisterComponent={UserRegister} />} />
            <Route path="replay" element={<ReplayPage showStatus={'mobile'} />} />
          </Route>
          {permissions.length < 1 ? (
            <Route path="/*" element={<Progress reload={() => navigate('/')} />} />
          ) : (
            <Route path="/*" element={<NotFoundPage />} />
          )}
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<App />}>
            <Route path="notification/:id"
                   element={<ModalWrapper typeForm={'page'} RegisterComponent={NotificationDevice} />} />
            <Route path="device" element={<ModalWrapper typeForm={'page'} RegisterComponent={DeviceRegister} />} />
            <Route path="device/:id" element={<ModalWrapper typeForm={'page'} RegisterComponent={DeviceRegister} />} />
            <Route path="user" element={<ModalWrapper typeForm={'page'} RegisterComponent={UserRegister} />} />
            <Route path="user/:id" element={<ModalWrapper typeForm={'page'} RegisterComponent={UserRegister} />} />
            <Route path="replay" element={<ReplayPage />} />

            {routerIndexSettings !== '' && (
              <Route path="settings" element={<SettingsPage />}>
                {routerIndexSettings !== '' && <Route index element={<Navigate replace to={routerIndexSettings} />} />}
                {permissions.includes('User-update') && (
                  <Route path="preferences" element={<Preferences />} />
                )}
                {permissions.includes('Event-read') && (
                  <Route path="notifications" element={<Notifications />}>
                    {permissions.includes('Event-persist') && (
                      <Route path="notification"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={NotificationRegister} />} />
                    )}
                    {permissions.includes('Event-update') && (
                      <Route path="notification/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={NotificationRegister} />} />
                    )}
                  </Route>
                )}
                {permissions.includes('Device-read') && (
                  <Route path="devices" element={<Devices />}>
                    {permissions.includes('Device-persist') && (
                      <Route path="device"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={DeviceRegister} />} />
                    )}
                    {permissions.includes('Device-update') && (
                      <Route path="device/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={DeviceRegister} />} />
                    )}
                    <Route path="device/:id/connections"
                           element={<ModalWrapper typeForm={'tab'} RegisterComponent={DeviceConnections} />} />
                    <Route path="device/:id/command"
                           element={<ModalWrapper typeForm={'tab'} RegisterComponent={CommandDevice} />} />
                  </Route>
                )}
                {permissions.includes('Imei-read') && (
                  <Route path="identifiers" element={<Identifiers />}>
                    {permissions.includes('Imei-persist') && (
                      <Route path="identifier"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={IdentifierRegister} />} />
                    )}
                    {permissions.includes('Imei-update') && (
                      <Route path="identifier/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={IdentifierRegister} />} />
                    )}
                  </Route>
                )}
                {permissions.includes('Geofence-read') && (
                  <Route path="geofences" element={<Geofences />}>
                    {permissions.includes('Geofence-persist') && (
                      <Route path="geofence"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={GeofenceRegister} />} />
                    )}
                    {permissions.includes('Geofence-update') && (
                      <Route path="geofence/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={GeofenceRegister} />} />
                    )}
                  </Route>
                )}
                <Route path="groups" element={<Groups />}>
                  <Route path="group" element={<ModalWrapper typeForm={'tab'} RegisterComponent={GroupRegister} />} />
                  <Route path="group/:id"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={GroupRegister} />} />
                  <Route path="group/:id/connections"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={GroupConnections} />} />
                  <Route path="group/:id/command"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={CommandGroup} />} />
                </Route>
                {permissions.includes('Driver-read') && (
                  <Route path="drivers" element={<Drivers />}>
                    {permissions.includes('Driver-persist') && (
                      <Route path="driver"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={DriverRegister} />} />
                    )}
                    {permissions.includes('Driver-update') && (
                      <Route path="driver/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={DriverRegister} />} />
                    )}
                  </Route>
                )}
                <Route path="calendars" element={<Calendars />}>
                  <Route path="calendar"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={CalendarRegister} />} />
                  <Route path="calendar/:id"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={CalendarRegister} />} />
                </Route>
                <Route path="attributes" element={<ComputedAttributes />}>
                  <Route path="attribute"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={ComputedAttributeRegister} />} />
                  <Route path="attribute/:id"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={ComputedAttributeRegister} />} />
                </Route>
                {permissions.includes('Maintenance-read') && (
                  <Route path="maintenances" element={<Maintenances />}>
                    {permissions.includes('Maintenance-persist') && (
                      <Route path="maintenance"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={MaintenanceRegister} />} />
                    )}
                    {permissions.includes('Maintenance-update') && (
                      <Route path="maintenance/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={MaintenanceRegister} />} />
                    )}
                  </Route>
                )}
                <Route path="commands" element={<Commands />}>
                  <Route path="command"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={CommandRegister} />} />
                  <Route path="command/:id"
                         element={<ModalWrapper typeForm={'tab'} RegisterComponent={CommandRegister} />} />
                </Route>
              </Route>
            )}

            {routerIndexReports !== '' && (
              <Route path="report" element={<ReportPage />}>
                {routerIndexUsers !== '' && <Route index element={<Navigate replace to={routerIndexReports} />} />}
                {permissions.includes('getCombined') && <Route path="combined" element={<CombinedReportPage />} />}
                {permissions.includes('getRoute') && <Route path="route" element={<RouteReportPage />} />}
                {permissions.includes('getEvents') && <Route path="event" element={<EventReportPage />} />}
                {permissions.includes('getIgnitionOn') && <Route path="stop" element={<StopReportPage />} />}
                {permissions.includes('getStopTime') && (
                  <Route path="replay" element={<ReplayPage showStatus={'report'} />} />
                )}
                {permissions.includes('getIgnitionDiagram') && <Route path="chart" element={<ChartReportPage />} />}
                {permissions.includes('getHeatCombined') && <Route path="heat" element={<HeatReportPage />} />}
                {/*{permissions.includes('getLoginHistory') && <Route path="loginhistory" element={<LoginHistory />} />}*/}
              </Route>
            )}

            {routerIndexUsers !== '' && (
              <Route path="users" element={<UsersPage />}>
                {routerIndexUsers !== '' && <Route index element={<Navigate replace to={routerIndexUsers} />} />}
                {permissions.includes('User-read') && (
                  <Route path="users" element={<Users />}>
                    {permissions.includes('User-persist') && (
                      <Route path="user"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={UserRegister} />} />
                    )}
                    {permissions.includes('User-update') && (
                      <Route path="user/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={UserRegister} />} />
                    )}
                    {permissions.includes('User-update') && (
                      <Route path="user/:id/change-password"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={UserChangePassword} />} />
                    )}
                    <Route path="user/:id/connections"
                           element={<ModalWrapper typeForm={'tab'} RegisterComponent={UserConnections} />} />
                  </Route>
                )}
                {permissions.includes('Role-read') && (
                  <Route path="roles" element={<Roles />}>
                    {permissions.includes('Role-persist') && (
                      <Route path="role"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={roleRegister} />} />
                    )}
                    {permissions.includes('Role-update') && (
                      <Route path="role/:id"
                             element={<ModalWrapper typeForm={'tab'} RegisterComponent={roleRegister} />} />
                    )}
                  </Route>
                )}
              </Route>
            )}
          </Route>
          {permissions.length < 1 ? (
            <Route path="/*" element={<Progress reload={() => navigate('/')} />} />
          ) : (
            <Route path="/*" element={<NotFoundPage />} />
          )}
        </Routes>
      )}
    </Suspense>
  )
}

export default Navigation
