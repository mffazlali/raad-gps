import {useSelector} from 'react-redux'

export const useAdministrator = () =>
  useSelector((state) => {
    const admin = state.session.user.administrator
    return admin
  })

export const useManager = () =>
  useSelector((state) => {
    const admin = state?.session?.user?.administrator
    const manager = (state?.session?.user?.userLimit || 0) !== 0
    return admin || manager
  })

export const useDeviceReadonly = () =>
  useSelector((state) => {
    const admin = state.session?.user?.administrator ?? ''
    const serverReadonly = state.session?.server?.readonly ?? ''
    const userReadonly = state.session?.user?.readonly ?? ''
    const serverDeviceReadonly = state.session?.server?.deviceReadonly ?? ''
    const userDeviceReadonly = state.session?.user?.deviceReadonly ?? ''
    return (
      !admin &&
      (serverReadonly ||
        userReadonly ||
        serverDeviceReadonly ||
        userDeviceReadonly)
    )
  })

export const useRestriction = (key) =>
  useSelector((state) => {
    const admin = state.session?.user?.administrator ?? ''
    let userValue = true
    let serverValue = true
    if (state.session?.user && Object.keys(state.session?.user).includes(key)) {
      userValue = state.session?.user[key] ?? ''
    }
    if (state.session?.server && Object.keys(state.session?.server).includes(key)) {
      serverValue = state.session?.server[key] ?? ''
    }
    return !admin && (serverValue || userValue)
  })
