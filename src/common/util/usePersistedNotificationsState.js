const saveNotifications = (value) => {
  window.localStorage.setItem('notifications', JSON.stringify(value))
}

const getNotifications = () => {
  return JSON.parse(window.localStorage.getItem('notifications'))
}

export const removeStorageNotifications = () => {
  window.localStorage.removeItem('notifications')
}

const saveNotificationsFlag = (value) => {
  window.localStorage.setItem('notificationsFlag', JSON.stringify(value))
}

const getNotificationsFlag = () => {
  return JSON.parse(window.localStorage.getItem('notificationsFlag'))
}

export const removeStorageNotificationsFlag = () => {
  window.localStorage.removeItem('notificationsFlag')
}


export default () => {
  return {saveNotifications, getNotifications, saveNotificationsFlag, getNotificationsFlag}
}
