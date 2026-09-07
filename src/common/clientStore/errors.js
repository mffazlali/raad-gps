import {createSlice} from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name: 'errors',
  initialState: {
    errors: [],
    errorMessage: '',
  },
  reducers: {
    reset(state) {
      state.errors = []
      state.errorMessage = ''

    },
    updateErrorMessage(state, action) {
      state.errorMessage = action.payload
    },
    push(state, action) {
      state.errors.push(action.payload)
    },
    pop(state) {
      if (state.errors.length) {
        state.errors.shift()
      }
    },
  },
})

export {actions as errorsActions}
export {reducer as errorsReducer}
