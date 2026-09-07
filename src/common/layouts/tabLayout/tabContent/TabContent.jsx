import styles from './TabContent.module.css'
import cls from 'classnames'
import {Outlet, useLocation} from 'react-router-dom'
import {useLayoutEffect, useState} from 'react'

const TabContent = () => {
  const location = useLocation()
  const [replayRouteMode, setReplayRouteMode] = useState(true)

  useLayoutEffect(() => {
    setReplayRouteMode(location.pathname.includes('/report/replay'))
  }, [location])

  return (<div className={styles.tabContent}>
    <div className={cls(styles.tabContentContainer, replayRouteMode ? '!py-0' : '')}><Outlet /></div>
  </div>)
}
export default TabContent

