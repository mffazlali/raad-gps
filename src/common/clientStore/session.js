import {createSlice} from '@reduxjs/toolkit'
import {formatNumber} from '../util/formatter.js'
import {saveDevicesRoutesState} from '../util/devicesRoutesStateUtil.js'
import moment from 'moment-jalaali'
import {toJalaliMoment} from '../util/DateTimeUtil.js'

const {reducer, actions} = createSlice({
  name: 'session',
  initialState: {
    server: {
      'id': 1,
      'attributes': {},
      'registration': true,
      'readonly': false,
      'deviceReadonly': false,
      'map': null,
      'bingKey': null,
      'mapUrl': null,
      'overlayUrl': null,
      'latitude': 0.0,
      'longitude': 0.0,
      'zoom': 0,
      'twelveHourFormat': false,
      'forceSettings': false,
      'coordinateFormat': null,
      'limitCommands': false,
      'disableReports': false,
      'fixedEmail': false,
      'poiLayer': null,
      'announcement': null,
      'emailEnabled': true,
      'geocoderEnabled': true,
      'textEnabled': false,
      'storageSpace': [
        905814016,
        124377993216,
      ],
      'newServer': false,
      'openIdEnabled': false,
      'openIdForce': false,
      'version': '5.12',
    },
    // server: null,
    user: null,
    socket: null,
    positions: {},
    addressPositions: {},
    history: {},
    historyFlag: {},
    positionsOld: {},
    permissions: [],
    devicePathTrackers: {},
    timestamp: '',
  },
  reducers: {
    reset(state) {
      // state.server = null
      state.user = null
      state.socket = null
      state.positions = {}
      state.addressPositions = {}
      state.history = {}
      state.historyFlag = {}
      state.positionsOld = {}
      state.devicePathTrackers = {}
      // state.permissions = []
    },
    updateTimestamp(state, action) {
      state.timestamp = action.payload
    },
    updateServer(state, action) {
      state.server = action.payload
    },
    updatePermissions(state, action) {
      state.permissions = action.payload
    },
    updateUser(state, action) {
      state.user = action.payload
    },
    updateHistoryFlag(state, action) {
      state.historyFlag = action.payload
    },
    refreshHistoryFlag(state, action) {
      const historyFlag = action.payload.historyFlag
      const liveRoutes =
        state?.user?.attributes?.mapLiveRoutes ||
        state.server?.attributes?.mapLiveRoutes ||
        'none'
      const liveRoutesLimit =
        state.user?.attributes['web.liveRouteLength'] ||
        // state.server?.attributes['web.liveRouteLength'] ||
        10
      action.payload.positions.forEach((position) => {
        if (position && position?.deviceId) {
          if (!position?.attributes?.motion) {
            const routeFlag = state.historyFlag[position.deviceId] || []
            // const lastFlag = routeFlag.at(-1)
            if (routeFlag.length > 0) {
              const longitudeFlag = position.longitude
              const latitudeFlag = position.latitude
              if (state.historyFlag[position.deviceId].length > liveRoutesLimit) {
                const route = state.historyFlag[position.deviceId] || []
                state.historyFlag[position.deviceId] = [
                  ...route.slice(1 - liveRoutesLimit),
                  [{longitude: longitudeFlag, latitude: latitudeFlag, counter: 2, fixTime: position.fixTime}],
                ]
              } else {
                state.historyFlag[position.deviceId].push({
                  longitude: longitudeFlag,
                  latitude: latitudeFlag,
                  counter: 2,
                  fixTime: position.fixTime,
                })
              }
            } else {
              state.historyFlag[position.deviceId] = []
              state.historyFlag[position.deviceId].push({
                longitude: position.longitude,
                latitude: position.latitude,
                counter: 2,
                fixTime: position.fixTime,
              })
            }
            // try {
            //
            // } catch (e) {
            //   state.historyFlag[position.deviceId] = []
            //   state.historyFlag[position.deviceId].push({
            //     longitude: position.longitude,
            //     latitude: position.latitude,
            //     counter: 2,
            //   })
            // }
          }


          if (state.positionsOld[position.deviceId]) {
            const longitudeFlag = state.positionsOld[position.deviceId].longitude
            const latitudeFlag = state.positionsOld[position.deviceId].latitude
            if (parseFloat(longitudeFlag) === parseFloat(position.longitude) && parseFloat(latitudeFlag) === parseFloat(position.latitude)) {
              const routeFlag = state.historyFlag[position.deviceId] || []
              if (routeFlag.length > 0) {
                const devicePosition = state.historyFlag[position.deviceId][state.historyFlag[position.deviceId].length - 1]
                if (devicePosition.longitude !== longitudeFlag && devicePosition.latitude !== latitudeFlag) {
                  if (state.historyFlag[position.deviceId].length > liveRoutesLimit) {
                    const route = state.historyFlag[position.deviceId] || []
                    state.historyFlag[position.deviceId] = [
                      ...route.slice(1 - liveRoutesLimit),
                      [{longitude: longitudeFlag, latitude: latitudeFlag, counter: 1, fixTime: position.fixTime}],
                    ]
                  } else {
                    state.historyFlag[position.deviceId].push({
                      longitude: longitudeFlag,
                      latitude: latitudeFlag,
                      counter: 1,
                      fixTime: position.fixTime,
                    })
                  }
                } else {
                  devicePosition.counter++
                }
              } else {
                state.historyFlag[position.deviceId] = []
                state.historyFlag[position.deviceId].push({
                  longitude: position.longitude,
                  latitude: position.latitude,
                  counter: 1,
                  fixTime: position.fixTime,
                })
              }
            }
          }

          if (true || liveRoutes !== 'none') {
            const route = state.history[position.deviceId] || []
            const last = route.at(-1)
            if (
              !last ||
              (last[0] !== position.longitude && last[1] !== position.latitude)
            ) {
              state.history[position.deviceId] = [
                ...route.slice(1 - liveRoutesLimit),
                [position.longitude, position.latitude],
              ]
            }
          } else {
            state.history = {}
          }
        }
      })
      state.positionsOld = state.positions
    },

    updateHistoryFlagByLiveRouteLength(state, action) {
      Object.entries(state.history).forEach(([key, value]) => {
        const length = state.history[key].length
        if (length > action.payload) {
          state.history[key] = state.history[key].slice(length - action.payload, length)
        }
      })
    },
    updateSocket(state, action) {
      state.socket = action.payload
    },
    updateAddressPosition(state, action) {
      state.addressPositions[action.payload.deviceId] = action.payload.address
    },

    updatePosition(state, action) {
      state.positions[action.payload.deviceId] = action.payload.position
    },

    updateLengthRoutes(state, action) {
      const {routeLinesLength, routeLocationsLength} = action.payload
      const tempDevicePathTrackers = {...state.devicePathTrackers}
      Object.keys(tempDevicePathTrackers).forEach((key, i) => {
        if (tempDevicePathTrackers[key].length >= routeLinesLength) {
          tempDevicePathTrackers[key] = tempDevicePathTrackers[key].slice(1 - (+routeLinesLength + 1))
        }
        tempDevicePathTrackers[key].forEach((_, j) => {
          if (tempDevicePathTrackers[key][j].length >= routeLocationsLength) {
            tempDevicePathTrackers[key][j] = tempDevicePathTrackers[key][j].slice(1 - (+routeLocationsLength + 1))
          }
        })
      })
      state.devicePathTrackers = tempDevicePathTrackers
      saveDevicesRoutesState(tempDevicePathTrackers)
    },

    updateDeviceRoutes(state, action) {
      const routeLinesLength = state.user?.attributes?.web?.routeLinesLength || 5
      const routeLocationsLength = state.user?.attributes?.web?.routeLocationsLength || 10 // state.server?.attributes['web.liveRouteLength']
      const deletionThreshold = 8
      const positions = action.payload
      positions.forEach((position) => {
        if (position && position.deviceId) {
          if (!state.devicePathTrackers[position.deviceId]) {
            state.devicePathTrackers[position.deviceId] = []
            state.devicePathTrackers[position.deviceId].push([])
          } else {
            const devicePaths = [...state.devicePathTrackers[position.deviceId]]
            for (let i = 0; i < devicePaths.length - 1; i++) {
              const deviceTime = devicePaths[i][devicePaths[i].length - 1].deviceTime
              const deviceTimeMoment = toJalaliMoment(deviceTime)
              const timeDiff = toJalaliMoment(state.timestamp).diff(deviceTimeMoment, 'hour')
              if (timeDiff > deletionThreshold) {
                state.devicePathTrackers[position.deviceId].shift() // Remove the oldest path
              }
            }
          }
          const isOnline = position.deviceStatus === 'online'
          const isValid = position.valid === true
          if (!isOnline) { // || !isValid) {
            if (state.devicePathTrackers[position.deviceId].length > 0) {
              if (state.devicePathTrackers[position.deviceId].length >= routeLinesLength) {
                state.devicePathTrackers[position.deviceId].shift() // Remove the oldest path
              }
            }
            if (state.devicePathTrackers[position.deviceId][state.devicePathTrackers[position.deviceId].length - 1].length > 0) {
              state.devicePathTrackers[position.deviceId].push([])
            }
          } else {
            if (state.devicePathTrackers[position.deviceId][state.devicePathTrackers[position.deviceId].length - 1].length >= routeLocationsLength) {
              state.devicePathTrackers[position.deviceId][state.devicePathTrackers[position.deviceId].length - 1] = [
                ...state.devicePathTrackers[position.deviceId][state.devicePathTrackers[position.deviceId].length - 1].slice(1 - routeLocationsLength),
                {
                  latitude: position.latitude,
                  longitude: position.longitude,
                  status: position.deviceStatus,
                  deviceTime: position.deviceTime,
                },
              ]
            } else {
              state.devicePathTrackers[position.deviceId][state.devicePathTrackers[position.deviceId].length - 1] = [...state.devicePathTrackers[position.deviceId][state.devicePathTrackers[position.deviceId].length - 1], {
                latitude: position.latitude,
                longitude: position.longitude,
                status: position.deviceStatus,
                deviceTime: position.deviceTime,
              }]
            }
          }
        }
      })
      saveDevicesRoutesState(state.devicePathTrackers)
    },

    updatePositions(state, action) {
      const liveRoutes =
        state?.user?.attributes?.mapLiveRoutes ||
        state.server?.attributes?.mapLiveRoutes ||
        'none'
      const liveRoutesLimit = state.user?.attributes?.web?.liveRouteLength || 30 // state.server?.attributes['web.liveRouteLength']
      const fixTimeLimit = 30 // minutes
      action.payload.forEach((position) => {

        if (state.historyFlag[position.deviceId]) {
          // remove flags with diff fixTime
          const fixTimeDay = toJalaliMoment(position.fixTime)
          state.historyFlag[position.deviceId] = state.historyFlag[position.deviceId].filter((flag) => {
            const flagDay = toJalaliMoment(flag.fixTime).diff(fixTimeDay, 'minute')
            return flagDay <= fixTimeLimit
          })
        }

        if (!position?.attributes?.motion) {
          if (state.historyFlag[position.deviceId]) {
            const longitudeFlag = position.longitude
            const latitudeFlag = position.latitude
            if (state.historyFlag[position.deviceId].length > (liveRoutesLimit)) {
              const route = state.historyFlag[position.deviceId] || []
              state.historyFlag[position.deviceId] = [
                ...route.slice(1 - liveRoutesLimit),
                {longitude: longitudeFlag, latitude: latitudeFlag, counter: 2, fixTime: position.fixTime},
              ]
            } else {
              state.historyFlag[position.deviceId].push({
                longitude: longitudeFlag,
                latitude: latitudeFlag,
                counter: 2,
                fixTime: position.fixTime,
              })
            }
          } else {
            state.historyFlag[position.deviceId] = []
            state.historyFlag[position.deviceId].push({
              longitude: position.longitude,
              latitude: position.latitude,
              counter: 2,
              fixTime: position.fixTime,
            })
          }
        }

        if (state.positionsOld[position.deviceId]) {
          const longitudeFlag = state.positionsOld[position.deviceId].longitude
          const latitudeFlag = state.positionsOld[position.deviceId].latitude
          if (parseFloat(longitudeFlag) === parseFloat(position.longitude) && parseFloat(latitudeFlag) === parseFloat(position.latitude)) {
            if (state.historyFlag[position.deviceId]) {
              const devicePosition = state.historyFlag[position.deviceId][state.historyFlag[position.deviceId].length - 1]
              if (devicePosition.longitude !== longitudeFlag && devicePosition.latitude !== latitudeFlag) {
                if (state.historyFlag[position.deviceId].length > liveRoutesLimit) {
                  const route = state.historyFlag[position.deviceId] || []
                  state.historyFlag[position.deviceId] = [
                    ...route.slice(1 - liveRoutesLimit),
                    {longitude: longitudeFlag, latitude: latitudeFlag, counter: 1, fixTime: position.fixTime},
                  ]
                } else {
                  state.historyFlag[position.deviceId].push({
                    longitude: longitudeFlag,
                    latitude: latitudeFlag,
                    counter: 1,
                    fixTime: position.fixTime,
                  })
                }
              } else {
                devicePosition.counter++
              }
            } else {
              state.historyFlag[position.deviceId] = []
              state.historyFlag[position.deviceId].push({
                longitude: position.longitude,
                latitude: position.latitude,
                counter: 1,
                fixTime: position.fixTime,
              })
            }
          }
        }

        // if (position?.deviceStatus !== 'online') {
        //   if (!state.positions[position.deviceId]) {
        //     state.positions[position.deviceId] = {...position}
        //   }
        //   state.positions[position.deviceId].deviceStatus = position?.deviceStatus
        // } else {
        //   state.positions[position.deviceId] = {...position}
        // }
        const preBattery = state.positions[position.deviceId]?.attributes?.battery ?? undefined
        const preBatteryLevel = state.positions[position.deviceId]?.attributes?.batteryLevel ?? undefined
        const preRssi = state.positions[position.deviceId]?.attributes?.rssi ?? undefined
        const battery = position?.attributes?.battery
        const batteryLevel = position?.attributes?.batteryLevel
        const rssi = position?.attributes?.rssi
        const attributes = {...position?.attributes}
        if (!battery && preBattery) {
          attributes.battery = preBattery
        }
        if (!batteryLevel && preBatteryLevel) {
          attributes.batteryLevel = preBatteryLevel
        }
        if (!rssi && preRssi) {
          attributes.rssi = preRssi
        }
        state.positions[position.deviceId] = {...position, attributes}
        // JSON.parse(JSON.stringify({...position, attributes}, null, 2))
        if (true || liveRoutes !== 'none') {
          const route = state.history[position.deviceId] || []
          const last = route.at(-1)
          if (
            !last ||
            (last[0] !== position.longitude && last[1] !== position.latitude)
          ) {
            state.history[position.deviceId] = [
              ...route.slice(1 - liveRoutesLimit),
              [position.longitude, position.latitude],
            ]
          }
        } else {
          state.history = {}
        }
      })
      state.positionsOld = state.positions
    },
    updateDevicePathTrackers(state, action) {
      state.devicePathTrackers = action.payload
    },
  },
})

export {actions as sessionActions}
export {reducer as sessionReducer}
