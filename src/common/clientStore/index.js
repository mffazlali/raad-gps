import {applyMiddleware, combineReducers, compose, configureStore} from '@reduxjs/toolkit'

import {errorsReducer as errors} from './errors.js'
import {sessionReducer as session} from './session.js'
import {devicesReducer as devices} from './devices.js'
import {eventsReducer as events} from './events.js'
import {notificationsReducer as notifications} from './notifications.js'
import {geofencesReducer as geofences} from './geofences.js'
import {groupsReducer as groups} from './groups.js'
import {driversReducer as drivers} from './drivers.js'
import {computedAttributesReducer as computedAttributes} from './computedAttributes.js'
import {maintenancesReducer as maintenances} from './maintenances.js'
import {commandsReducer as commands} from './commands.js'
import {calendarsReducer as calendars} from './calendars.js'
import {reportsReducer as reports} from './reports.js'
import {usersReducer as users} from './users.js'
import {rolesReducer as roles} from './roles.js'
import {permissionsReducer as permissions} from './permissions.js'
import {imeiReducer as imei} from './imei.js'
import {layoutReducer as layout} from './layout.js'
import throttleMiddleware from './throttleMiddleware.js'
import {composeWithDevTools} from 'redux-devtools-extension'

const reducer = combineReducers({
  errors,
  session,
  devices,
  events,
  notifications,
  geofences,
  groups,
  drivers,
  computedAttributes,
  commands,
  maintenances,
  calendars,
  reports,
  users,
  roles,
  permissions,
  imei,
  layout,
})

export {errorsActions} from './errors.js'
export {sessionActions} from './session.js'
export {devicesActions} from './devices.js'
export {eventsActions} from './events.js'
export {notificationsActions} from './notifications.js'
export {geofencesActions} from './geofences.js'
export {groupsActions} from './groups.js'
export {driversActions} from './drivers.js'
export {computedAttributesActions} from './computedAttributes.js'
export {maintenancesActions} from './maintenances.js'
export {commandsActions} from './commands.js'
export {calendarsActions} from './calendars.js'
export {reportsActions} from './reports.js'
export {usersActions} from './users.js'
export {rolesActions} from './roles.js'
export {permissionsActions} from './permissions.js'
export {imeiActions} from './imei.js'
export {layoutActions} from './layout.js'

// const composeFunc = (typeof window !== 'undefined' && composeWithDevTools(options)) || compose;
// const enhancer = composeFunc(applyMiddleware());

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export default configureStore({
  reducer,
  composeEnhancers,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(throttleMiddleware),
})
