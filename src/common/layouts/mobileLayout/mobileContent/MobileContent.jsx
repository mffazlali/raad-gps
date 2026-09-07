import styles from './MobileContent.module.css'
import cls from 'classnames'
import MainMobilePage from '../../../../features/main/MainMobilePage.jsx'
import {Outlet, useLocation} from 'react-router-dom'
import {useLayoutEffect, useState} from 'react'

const MobileContent = () => {
  const [mainMapHide, setMainMapHide] = useState(true)
  const location = useLocation()

  useLayoutEffect(() => {
    setMainMapHide(location.pathname.includes('/replay') || location.pathname.includes('/report') || location.pathname.includes('/settings') || location.pathname.includes('/users'))
  }, [location])

  return (
    <article className={styles.mobileContent}>
      <section className={styles.mobileContentContainer}>
        <Outlet />
        {!mainMapHide && <MainMobilePage />}
        {/*<MainMobileHeader showDevices={showDevices} setShowDevices={setShowDevices} />*/}
        {/*<div className={'h-[calc(100%-44px)]'}>*/}
        {/*  <MainMobilePage />*/}
        {/*</div>*/}
        {/*<CardDevicesMobile devices={devices} showDevices={showDevices} setShowDevices={setShowDevices} />*/}
        {/*<Outlet/>*/}
      </section>
    </article>
  )
}

export default MobileContent
