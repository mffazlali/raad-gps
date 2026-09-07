import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'users',
  initialState: {
    items: {},
    loginHistoryItems: {},
  },
  reducers: {
    reset(state) {
      state.items = {}
      state.loginHistoryItems = {}
    },
    refresh(state, action) {
      state.items = {}
      action.payload.forEach((item) => (state.items[item.id] = item))
    },
    update(state, action) {
      action.payload.forEach((item) => (state.items[item.id] = item))
    },
    refreshLoginHistory(state, action) {
      state.items = {}
      action.payload.forEach((item) => (state.loginHistoryItems[item.id] = item))
    },
  },
})

export {actions as usersActions}
export {reducer as usersReducer}
