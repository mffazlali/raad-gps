import React, {useEffect, useState} from 'react'
import useNotification from '../util/useNotification'


const PWAController = () => {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const {contextHolder, showNotification, closeNotification} = useNotification()

  useEffect(() => {
    const handler = e => {
      e.preventDefault()
      console.log('we are being triggered :D')
      setSupportsPWA(true)
      setPromptInstall(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('transitionend', handler)
  }, [])

  useEffect(() => {
    if(promptInstall){
      showPWANotif()
    }
  }, [promptInstall])

  const showPWANotif=()=>{
    showNotification({
      message: 'نسخه راد آماده نصب است',
      type: 'info',
      duration: 0,
      key: 'PWAController',
      onClick: () => showPrompt(),
    })
  }

  const showPrompt = () => {
    if (!promptInstall) {
      return
    }
    promptInstall.prompt().then((choiceResult) => {
      if (choiceResult.outcome === 'dismissed') {
      } else {
        console.log('User added to home screen')
        setSupportsPWA(false)
      }
    })
  }
  if (!supportsPWA) {
    return null
  }

  return <>{contextHolder}</>
}

export default PWAController
