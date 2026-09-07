const removeStorageIsTrackingDevice = () => {
  window.localStorage.removeItem('isTrackingDevice')
}

const saveDeviceTrackingState = (deviceId, value) => {
  const key = `isTrackingDevice_${deviceId}`
  window.localStorage.setItem(key, JSON.stringify(value))
}

const getDeviceTrackingState = (deviceId) => {
  const key = `isTrackingDevice_${deviceId}`
  const stored = window.localStorage.getItem(key)
  return stored ? JSON.parse(stored) : false
}

const removeDeviceTrackingState = (deviceId) => {
  const key = `isTrackingDevice_${deviceId}`
  window.localStorage.removeItem(key)
}

// Get all device tracking states
const getAllDeviceTrackingStates = () => {
  const states = {}
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key && key.startsWith('isTrackingDevice_')) {
      const deviceId = key.replace('isTrackingDevice_', '')
      states[deviceId] = getDeviceTrackingState(deviceId)
    }
  }
  return states
}

export {
  removeStorageIsTrackingDevice,
  saveDeviceTrackingState,
  getDeviceTrackingState,
  removeDeviceTrackingState,
  getAllDeviceTrackingStates
}
