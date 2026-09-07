const saveDevicesRoutesState = (value) => {
  window.localStorage.setItem('devicesRoutes', JSON.stringify(value))
}

const getDevicesRoutesState = () => {
  return JSON.parse(window.localStorage.getItem('devicesRoutes'))
}

const removeStorageDevicesRoutesState = () => {
  window.localStorage.removeItem('devicesRoutes')
}


export {getDevicesRoutesState, saveDevicesRoutesState, removeStorageDevicesRoutesState}
