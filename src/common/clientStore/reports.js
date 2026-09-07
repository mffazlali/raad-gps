import {createSlice} from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const {reducer, actions} = createSlice({
  name: 'reports',
  initialState: {
    groupIds: null,
    period: '1',
    from: dayjs().subtract(1, 'hour').locale('en').toISOString(),
    to: dayjs().locale('en').toISOString(),
    eventsType: null,
  },
  reducers: {
    reset(state) {
      state.groupIds = {}
      state.from = dayjs().subtract(1, 'hour').locale('en').toISOString()
      state.to = dayjs().locale('en').toISOString()
      state.eventsType = null
    },
    updateGroupIds(state, action) {
      state.groupIds = action.payload
    },
    updatePeriod(state, action) {
      state.period = action.payload
    },
    updateFrom(state, action) {
      state.from = action.payload
    },
    updateTo(state, action) {
      state.to = action.payload
    },
    updateEventsType(state, action) {
      state.eventsType = action.payload
    },
  },
})

export {actions as reportsActions}
export {reducer as reportsReducer}
