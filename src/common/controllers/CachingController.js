import {useDispatch, useSelector, connect} from 'react-redux'
import {
  notificationsActions,
  calendarsActions,
  commandsActions,
  driversActions,
  errorsActions,
  eventsActions,
  computedAttributesActions,
  devicesActions,
  geofencesActions,
  reportsActions,
  rolesActions,
  usersActions,
  groupsActions,
  maintenancesActions,
} from '../clientStore/index.js'
import {useEffectAsync} from '../util/reactHelper.js'
import {useEffect} from 'react'
import {
  useGeofences, useGroups, useDrivers, useMaintenances, useCalendars,
} from '../serverStore'

const CachingController = () => {
  const authenticated = useSelector((state) => !!state.session.user)
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state?.session?.user)
  const permissions = useSelector((state) => state.session.permissions)

  // const {geofences} = useGeofences(currentUser.id)
  const {groups} = useGroups(currentUser.id)
  const {drivers} = useDrivers(currentUser.id, permissions.includes('Driver-read'))
  const {maintenances} = useMaintenances(currentUser.id, permissions.includes('Maintenance-read'))
  const {calendars} = useCalendars(currentUser.id)

  useEffect(() => {
    // dispatch(commandsActions.reset())
    // dispatch(errorsActions.reset())
    // dispatch(eventsActions.reset())
    // dispatch(computedAttributesActions.reset())
    // dispatch(devicesActions.reset())
    // dispatch(reportsActions.reset())
    // dispatch(rolesActions.reset())
    // dispatch(usersActions.reset())
  }, [authenticated])

  useEffectAsync(async () => {
    if (authenticated) {
      try {
        const data = await getGeofences()
        dispatch(geofencesActions.update(data))
      } catch (error) {
        throw Error(error.message)
      }
    }
  }, [authenticated])

  useEffect(() => {
    if (authenticated && groups) {
      dispatch(groupsActions.update(groups))
    }
  }, [authenticated, groups])

  useEffect(() => {
    if (authenticated && drivers) {
      dispatch(driversActions.update(drivers))
    }
  }, [authenticated, drivers])

  useEffect(() => {
    if (authenticated && maintenances) {
      dispatch(maintenancesActions.update(maintenances))
    }
  }, [authenticated, maintenances])

  useEffect(() => {
    if (authenticated && calendars) {
      dispatch(calendarsActions.update(calendars))
    }
  }, [authenticated, calendars])

  return null
}

export default connect()(CachingController)
