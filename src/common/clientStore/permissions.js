import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'permissions',
  initialState: {
    items: {},
  },
  reducers: {
    reset(state) {
      state.items = {}
    },
    refresh(state, action) {
      state.items = {}
      action.payload.forEach((item) => (state.items[item.id] = item))
    },
    update(state, action) {
      action.payload.forEach((item) => (state.items[item.id] = item))
    },
  },
})

export {actions as permissionsActions}
export {reducer as permissionsReducer}
