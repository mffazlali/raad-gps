import styles from './MobileFooter.module.css'
import cls from 'classnames'
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {
  commandsActions,
  devicesActions, driversActions,
  eventsActions,
  geofencesActions, groupsActions,
  rolesActions,
  sessionActions, usersActions,
} from '../../../clientStore/index.js'
import {nativePostMessage} from '../../../components/NativeInterface.js'
import {useState} from 'react'
import usePersistedCheckInOutTime from '../../../util/usePersistedCheckInOutTime.js'
import axios from 'axios'
import axiosInstance from '../../../util/axiosConfig'
import LazyImage from '../../../components/custom/dataDisplay/lazyImage.jsx'

// Lazy loaded image imports
const mapPointWaveIcon = () => import('../../../../resources/images/medias/mapPointWaveSmOutline.svg')
const mapPointWaveActiveIcon = () => import('../../../../resources/images/medias/mapPointWaveActiveSmOutline.svg')
const documentTextIcon = () => import('../../../../resources/images/medias/documentTextSmOutline.svg')
const documentTextActiveIcon = () => import('../../../../resources/images/medias/documentTextActiveSmOutline.svg')
const settingsIcon = () => import('../../../../resources/images/medias/settingsSmOutline.svg')
const settingsActiveIcon = () => import('../../../../resources/images/medias/settingsActiveSmOutline.svg')
const replayIcon = () => import('../../../../resources/images/medias/otherOutline.svg')
const replayActiveIcon = () => import('../../../../resources/images/medias/otherOutlineActive.svg')
const logout = () => import('../../../../resources/images/medias/logout2Outline.svg')

const MobileFooter = () => {
  const permissions = useSelector((state) => state.session.permissions)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const {saveLastTime} = usePersistedCheckInOutTime()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const user = useSelector((state) => state.session.user)

  const handleLink = () => {
    // dispatch(devicesActions.selectId(undefined))
  }

  const handleLogout = async () => {
    setAnchorEl(null)

    const notificationToken = window.localStorage.getItem('notificationToken')
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken')
      const tokens = user.attributes.notificationTokens?.split(',') || []
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens:
              tokens.length > 1
                ? tokens.filter((it) => it !== notificationToken).join(',')
                : undefined,
          },
        }
        try {
          await axiosInstance.put(`/api/users/${user.id}`, updatedUser)
        } catch (error) {
          // Handle error if needed
        }
      }
    } else {
      window.localStorage.removeItem('notificationToken')
    }

    try {
      await axiosInstance.delete('/api/session')
      nativePostMessage('logout')
      saveLastTime()

      dispatch(sessionActions.reset())
      dispatch(geofencesActions.reset())
      dispatch(commandsActions.reset())
      dispatch(eventsActions.reset())
      dispatch(devicesActions.reset())
      dispatch(rolesActions.reset())
      dispatch(usersActions.reset())
      dispatch(driversActions.reset())
      dispatch(groupsActions.reset())

      navigate('/')
    } catch (error) {
      // Handle error if needed
    }
  }

  return (
    <footer className={cls('footer', styles.mobileFooter)}>
      <div className={styles.mobileFooterContainer}>
        <div className={styles.mobileFooterItems}>
          <NavLink
            to="/"
            onClick={handleLink}
            className={cls(styles.iconItemWrapper, ({isActive, isPending}) =>
              isPending ? '' : isActive ? '' : '',
            )}>
            {({isActive, isPending, isTransitioning}) => (
              <div className={styles.iconItem}>
                <div>
                  <LazyImage
                    className={styles.icon}
                    src={(pathname === '/' || pathname === '/replay') ? mapPointWaveActiveIcon : mapPointWaveIcon}
                    alt=""
                  />
                </div>
                <div
                  className={cls(
                    styles.labelWrapper,
                  )}>
                  <span
                    className={cls(
                      styles.label,
                      (pathname === '/' || pathname === '/replay') ? 'active' : '',
                    )}>
                    صفحه اصلی
                  </span>
                </div>
              </div>
            )}
          </NavLink>
          {/*{permissions.includes('getStopTime') &&*/}
          {/*  <NavLink*/}
          {/*    to="/replay"*/}
          {/*    onClick={handleLink}*/}
          {/*    className={cls(styles.iconItemWrapper, ({isActive, isPending}) =>*/}
          {/*      isPending ? '' : isActive ? '' : '',*/}
          {/*    )}>*/}
          {/*    {({isActive, isPending, isTransitioning}) => (*/}
          {/*      <div className={styles.iconItem}>*/}
          {/*        <div>*/}
          {/*          <LazyImage*/}
          {/*            className={styles.icon}*/}
          {/*            src={isActive ? replayActiveIcon : replayIcon}*/}
          {/*            alt=""*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*        <div*/}
          {/*          className={cls(*/}
          {/*            styles.labelWrapper,*/}
          {/*          )}>*/}
          {/*        <span*/}
          {/*          className={cls(*/}
          {/*            styles.label,*/}
          {/*            isActive ? 'active' : '',*/}
          {/*          )}>*/}
          {/*          بازپخش*/}
          {/*        </span>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  </NavLink>*/}
          {/*}*/}
          {/*{(permissions.includes('getCombined') || permissions.includes('getRoute') || permissions.includes('getEvents') || permissions.includes('getIgnitionOn') || permissions.includes('getIgnitionDiagram') || permissions.includes('getStopTime') || permissions.includes('getHeatCombined') || permissions.includes('getLoginHistory')) &&*/}
          {/*  <NavLink*/}
          {/*    to="/report"*/}
          {/*    onClick={handleLink}*/}
          {/*    className={cls(styles.iconItemWrapper, ({isActive, isPending}) =>*/}
          {/*      isPending ? '' : isActive ? '' : '',*/}
          {/*    )}>*/}
          {/*    {({isActive, isPending, isTransitioning}) => (*/}
          {/*      <div className={styles.iconItem}>*/}
          {/*        <div>*/}
          {/*          <LazyImage*/}
          {/*            className={styles.icon}*/}
          {/*            src={isActive ? documentTextActiveIcon : documentTextIcon}*/}
          {/*            alt=""*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*        <div*/}
          {/*          className={cls(*/}
          {/*            styles.labelWrapper,*/}
          {/*          )}>*/}
          {/*        <span*/}
          {/*          className={cls(*/}
          {/*            styles.label,*/}
          {/*            isActive ? 'active' : '',*/}
          {/*          )}>*/}
          {/*          گزارش‌ها*/}
          {/*        </span>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  </NavLink>*/}
          {/*}*/}
          {/*{(permissions.includes('User-read') || permissions.includes('Event-read') || permissions.includes('Device-read') || permissions.includes('Event-read') || permissions.includes('Geofence-read') || permissions.includes('Driver-read') || permissions.includes('Maintenance-read')) &&*/}
          {/*  <NavLink*/}
          {/*    to="/settings"*/}
          {/*    onClick={handleLink}*/}
          {/*    className={cls(styles.iconItemWrapper, ({isActive, isPending}) =>*/}
          {/*      isPending ? '' : isActive ? '' : '',*/}
          {/*    )}>*/}
          {/*    {({isActive, isPending, isTransitioning}) => (*/}
          {/*      <div className={styles.iconItem}>*/}
          {/*        <div>*/}
          {/*          <LazyImage*/}
          {/*            className={styles.icon}*/}
          {/*            src={isActive ? settingsActiveIcon : settingsIcon}*/}
          {/*            alt=""*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*        <div*/}
          {/*          className={cls(*/}
          {/*            styles.labelWrapper,*/}
          {/*          )}>*/}
          {/*        <span*/}
          {/*          className={cls(*/}
          {/*            styles.label,*/}
          {/*            isActive ? 'active' : '',*/}
          {/*          )}>*/}
          {/*          تنظیمات*/}
          {/*        </span>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  </NavLink>*/}
          {/*}*/}
          <button className={styles.iconItemWrapper} onClick={() => {
            handleLogout()
          }}>
            <div className={styles.iconItem}>
              <div>
                <LazyImage src={logout} alt="" className={cls(styles.icon, '!text-primary')} />
              </div>
              <div
                className={cls(
                  styles.labelWrapper,
                )}>
                  <span
                    className={cls(
                      styles.label,
                    )}>
                    خروج
                  </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default MobileFooter
