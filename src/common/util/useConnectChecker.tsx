import {useEffect, useState} from 'react'

const useConnectChecker = () => {
  const [online, setOnline] = useState(navigator.onLine)
  // const [onlineConnection, setOnlineConnection] = useState(null)

  useEffect(() => {
    window.addEventListener('online', (e) => {
      setOnline(true)
      // setOnlineConnection(true)
    })

    window.addEventListener('offline', (e) => {
      setOnline(false)
      // setOnlineConnection(false)
    })
  }, [])

  // useEffect(() => {
  //   if (navigator['connection']) {
  //     const connection = navigator['connection']
  //     connection.addEventListener('change', (event) => {
  //       if (onlineConnection == null) {
  //         setOnline((value) => !value)
  //       } else {
  //         setOnlineConnection(null)
  //       }
  //     })
  //   } else {
  //     console.log('Network Information API is not supported in this browser.')
  //   }
  // }, [])

  return online
}

export default useConnectChecker
