import packageJson from '../../../package.json'

export const getAppVersion = (): string => {
  const isVersion = import.meta.env.VITE_APP_IS_VERSION ? import.meta.env.VITE_APP_IS_VERSION?.toLowerCase?.() === 'true' : false
  const version = import.meta.env.VITE_APP_VERSION
  return isVersion ? version : packageJson.version
}
