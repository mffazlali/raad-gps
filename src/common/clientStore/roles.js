import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'roles',
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

export {actions as rolesActions}
export {reducer as rolesReducer}
