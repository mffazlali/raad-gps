import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffectAsync} from '../util/reactHelper.js'
import {errorsActions, sessionActions} from '../clientStore'
import useNotification from '../util/useNotification'
import Progress from '../components/custom/feedback/progress/Progress.jsx'
import axios from 'axios'
import axiosInstance from '../util/axiosConfig'

const ERROR_MESSAGE = 'ارتباط با سرور برقرار نیست'

const ServerProvider = ({
                          children,
                        }) => {
  const dispatch = useDispatch()

  const initialized = useSelector((state) => !!state.session.server)
  const [error, setError] = useState(null)
  const {contextHolder, showNotification, closeNotification} = useNotification()

  // useEffectAsync(async () => {
  //   if (!error) {
  //     try {
  //       const response = await axiosInstance.get('/api/server')
  //       if (response.status === 200) {
  //         dispatch(sessionActions.updateServer(response.data))
  //         dispatch(errorsActions.updateErrorMessage(''))
  //       } else {
  //         setError(error.message)
  //         dispatch(errorsActions.updateErrorMessage(ERROR_MESSAGE))
  //       }
  //     } catch (error) {
  //       if (initialized) {
  //         showNotification({
  //           message: ERROR_MESSAGE, type: 'error', duration: 0, key: 'internetNetwork',
  //         })
  //       } else {
  //         dispatch(errorsActions.updateErrorMessage(ERROR_MESSAGE))
  //       }
  //       setError(error.message)
  //     }
  //   }
  // }, [error])

  return (
    <>
      {contextHolder}
      {!initialized ? <Progress reload={() => setError('')} /> : error ?
        <Progress reload={() => setError('')} /> : children}

    </>
  )
}

export default ServerProvider
