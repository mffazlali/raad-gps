import styles from './MainContent.module.css'
import {Outlet, useLocation} from 'react-router-dom'
import MainPage from '../../../../features/main/MainPage.jsx'
import {useLayoutEffect, useState} from 'react'
import cls from 'classnames'

const MainContent = () => {
  const location = useLocation()
  const [mainMapHide, setMainMapHide] = useState(true)

  useLayoutEffect(() => {
    setMainMapHide(location.pathname.includes('/replay') || location.pathname.includes('/report') || location.pathname.includes('/settings') || location.pathname.includes('/users'))
  }, [location])

  return (
    <article className={cls(styles.content, !mainMapHide ? styles.contentMain : styles.contentOther)}>
      <div className={styles.contentContainer}>
        <Outlet />
        {!mainMapHide && <MainPage />}
      </div>
    </article>
  )
}

export default MainContent
