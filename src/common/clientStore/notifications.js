import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'notifications',
  initialState: {
    items: {},
    flags: {},
  },
  reducers: {
    reset(state) {
      state.items = {}
      state.flags = {}
    },
    setItems(state, action) {
      state.items = action.payload
    },
    add(state, action) {
      // state.items = Array(state.items).unshift(...action.payload)
      // state.items = [...state.items, ...action.payload]
      // state.items = Array(state.items).splice(50)
      action.payload.forEach((event) => {
        if (state.items[event.deviceId]) {
          state.items[event.deviceId] = [...state.items[event.deviceId], event]
        } else {
          state.items[event.deviceId] = [event]
        }
        state.flags[event.deviceId] = true
        state.flags = {...state.flags}
      })
    },
    setNotificationFlag(state, action) {
      state.flags = action.payload
    },
    resetNotificationFlag(state, action) {
      state.flags[action.payload] = false
      // state.flags={...state.flags}
    },
    delete(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id)
    },
    deleteAll(state) {
      state.items = []
    },
  },
})

export {actions as notificationsActions}
export {reducer as notificationsReducer}
