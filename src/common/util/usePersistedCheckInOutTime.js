import moment from 'moment-jalaali'

const saveFirstTime = () => {
  window.localStorage.setItem('firstTime', JSON.stringify(moment().locale('en').format()))
}

export const removeStorageFirstTime = () => {
  window.localStorage.removeItem('firstTime')
}

const saveLastTime = () => {
  window.localStorage.setItem('lastTime', JSON.stringify(moment().locale('en').format()))
}

export const removeStorageLastTime = () => {
  window.localStorage.removeItem('lastTime')
}

const getFirstTime = () => {
  return JSON.parse(window.localStorage.getItem('firstTime'))
}

const getLastTime = () => {
  return JSON.parse(window.localStorage.getItem('lastTime'))
}

export default () => {
  return {saveFirstTime, saveLastTime, getFirstTime, getLastTime}
}
