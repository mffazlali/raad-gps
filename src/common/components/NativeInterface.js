import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectAsync } from '../util/reactHelper.js'
import { sessionActions } from '../clientStore'
import axios from 'axios'
import axiosInstance from '../util/axiosConfig.ts'
import {removeStorageSelectedMapStyle} from '../map/core/MapView.jsx'

export const removeStorageNotificationToken = () => {
  window.localStorage.removeItem('notificationToken')
}

export const nativeEnvironment =
  window.appInterface ||
  (window.webkit && window.webkit.messageHandlers.appInterface)

export const nativePostMessage = (message) => {
  if (window.webkit && window.webkit.messageHandlers.appInterface) {
    window.webkit.messageHandlers.appInterface.postMessage(message)
  }
  if (window.appInterface) {
    window.appInterface.postMessage(message)
  }
}

export const handleLoginTokenListeners = new Set()
window.handleLoginToken = (token) => {
  handleLoginTokenListeners.forEach((listener) => listener(token))
}

const updateNotificationTokenListeners = new Set()
window.updateNotificationToken = (token) => {
  updateNotificationTokenListeners.forEach((listener) => listener(token))
}

const NativeInterface = () => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.session.user)
  const [notificationToken, setNotificationToken] = useState(null)

  useEffect(() => {
    const listener = (token) => setNotificationToken(token)
    updateNotificationTokenListeners.add(listener)
    return () => updateNotificationTokenListeners.delete(listener)
  }, [setNotificationToken])

  useEffectAsync(async () => {
    if (user && !user.readonly && notificationToken) {
      window.localStorage.setItem('notificationToken', notificationToken)
      setNotificationToken(null)

      const tokens = user.attributes.notificationTokens?.split(',') || []
      if (!tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens: [...tokens.slice(-2), notificationToken].join(
              ','
            ),
          },
        }

        try {
          const response = await axiosInstance.put(`/api/users/${user.id}`, updatedUser)
          if (response.status === 200) {
            dispatch(sessionActions.updateUser(response.data))
          }
        } catch (error) {
          throw Error(error.response?.data || error.message)
        }
      }
    }
  }, [user, notificationToken, setNotificationToken])

  return null
}

export default NativeInterface
