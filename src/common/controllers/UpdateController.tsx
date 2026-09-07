import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from '../components/LocalizationProvider'
import {useRegisterSW} from 'virtual:pwa-register/react'
import useNotification from '../util/useNotification.tsx'
import useMessage from '../util/useMessage.tsx'
import axios from 'axios'
import axiosInstance from '../util/axiosConfig'

// Based on https://vite-pwa-org.netlify.app/frameworks/react.html
function UpdateController() {
  // const {contextHolder, showNotification} = useNotification()
  const {contextHolder, showNotification, closeNotification} = useNotification()

  const t = useTranslation()

  const swUpdateInterval = useSelector((state: any) => state.session.server.attributes['serviceWorkerUpdateInterval'] || 3600000)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: any, swRegistration: any) {
      if (swUpdateInterval > 0 && swRegistration) {
        setInterval(async () => {
          if (!(!swRegistration.installing && navigator)) {
            return
          }

          if (('connection' in navigator) && !navigator.onLine) {
            return
          }

          const newSW = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
              'cache': 'no-clientStore',
              'cache-control': 'no-cache',
            },
          })
          if (newSW?.status === 200) {
            await swRegistration.update()
          }
        }, swUpdateInterval)
      }
    },
  })

  useEffect(() => {
    // const pwaEnableDevelop = import.meta.env.VITE_ENABLE_PWA_DEVELOPMENT
    // const mode = import.meta.env.MODE
    // if (mode !== 'development' || (mode === 'development' && pwaEnableDevelop.toLowerCase?.() === 'true')) {
    if (needRefresh) {
      showNotification({
        message: 'یک به روز رسانی در دسترس است.',
        type: 'info',
        duration: 0,
        key: 'updateController',
        onClick: () => updateServiceWorker(true),
      })
    }
    // }
  }, [needRefresh])

  return (
    <>
      {contextHolder}
    </>
  )

}

export default UpdateController
