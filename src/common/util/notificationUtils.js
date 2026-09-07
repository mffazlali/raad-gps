// Function to request notification permission
export const askForNotificationPermission = async () => {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
        await configurePushSub()
        // await displayConfirmNotification('راد', {
        //   body: 'سرویس اعلان فعال شد',
        //   icon: '/public/logo.png',
        //   image: '/public/logo.png',
        //   dir: 'rtl',
        //   lang: 'fa-IR',
        //   vibrate: [100, 50, 200],
        //   badge: '/public/logo.png',
        //   tag: 'confirm-notification',
        //   renotify: true,
        //   actions: [
        //     {action: 'confirm', title: 'تایید'},
        //     {action: 'cancel', title: 'بستن'},
        //   ],
        // })
        return true
      } else {
        console.log('Notification permission denied')
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  } else {
    return false
  }
}

// Function to configure push subscription
export const configurePushSub = async () => {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications are not supported')
      return null
    }

    const registration = await navigator.serviceWorker.ready
    let convertedVapidPublicKey = urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY)
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidPublicKey, // Make sure to set this in your .env file
    })

    // Send the subscription to your server
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      })
      if (response.ok) {
        await displayConfirmNotification('راد', {
          body: 'سرویس اعلان فعال شد',
          icon: '/public/logo.png',
          image: '/public/logo.png',
          dir: 'rtl',
          lang: 'en-US', // BCP 47,
          vibrate: [100, 50, 200],
          badge: '/public/logo.png',
          tag: 'confirm-notification',
          renotify: true,
          actions: [
            {action: 'confirm', title: 'تایید'},
            {action: 'cancel', title: 'بستن'},
          ],
        })
      }
    } catch (err) {
      console.log(err)
    }


    return subscription
  } catch (error) {
    console.error('Error configuring push subscription:', error)
    return null
  }
}

// Function to display a confirmation notification
export const displayConfirmNotification = async (title, options = {}) => {
  try {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(title, {
      body: options.body || 'سرویس اعلان فعال شد',
      icon: options.icon || '/public/logo.png',
      badge: options.badge || '/public/logo.png',
      data: {
        url: options.url || window.location.origin,
        ...options.data,
      },
      actions: [
        {
          action: 'confirm',
          title: 'تایید',
        },
      ],
      requireInteraction: true,
      ...options,
    })
    console.log('showNotification')
  } catch (error) {
    console.error('Error displaying confirmation notification:', error)
  }
}

const urlBase64ToUint8Array = (base64String) => {
  let padding = '='.repeat((4 - base64String.length % 4) % 4)
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  let rawData = window.atob(base64)
  let outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
