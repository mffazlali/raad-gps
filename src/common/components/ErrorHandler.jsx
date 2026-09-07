import { Snackbar, Alert } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePrevious } from '../util/reactHelper.js'
import { errorsActions } from '../clientStore'

const ErrorHandler = () => {
  const dispatch = useDispatch()

  const error = useSelector((state) => state.errors.errors.find(() => true))
  const previousError = usePrevious(error)

  return (
    <Snackbar open={!!error}>
      <Alert
        elevation={6}
        onClose={() => dispatch(errorsActions.pop())}
        severity="error"
        variant="filled">
        {error || previousError}
      </Alert>
    </Snackbar>
  )
}

export default ErrorHandler
