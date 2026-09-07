import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'computedAttributes',
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

export {actions as computedAttributesActions}
export {reducer as computedAttributesReducer}
