import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'layout',
  initialState: {
    filteredDevices: [],
  },
  reducers: {
    reset(state) {
      state = {
        filteredDevices: [],
      }
    },
    setFilteredDevices(state, action) {
      state.filteredDevices = action.payload
    },
  },
})

export {actions as layoutActions}
export {reducer as layoutReducer}
