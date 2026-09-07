import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'events',
  initialState: {
    items: [],
  },
  reducers: {
    reset(state) {
      state.items = {}
    },
    add(state, action) {
      state.items = Array(state.items).unshift(...action.payload)
      state.items = Array(state.items).splice(50)
    },
    refresh(state, action) {
      state.items = {}
      action.payload.forEach((item) => (state.items[item.id] = item))
    },
    delete(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id)
    },
    deleteAll(state) {
      state.items = []
    },
  },
})

export {actions as eventsActions}
export {reducer as eventsReducer}
