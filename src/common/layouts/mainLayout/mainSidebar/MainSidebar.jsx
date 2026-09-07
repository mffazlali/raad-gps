import styles from './MainSidebar.module.css'
import {useState} from 'react'
import {nativePostMessage} from '../../../components/NativeInterface.js'
import cls from 'classnames'
import {NavLink, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {
  sessionActions, devicesActions, notificationsActions,
  calendarsActions,
  commandsActions,
  driversActions,
  errorsActions,
  eventsActions,
  computedAttributesActions,
  geofencesActions,
  reportsActions,
  rolesActions,
  usersActions,
  groupsActions,
  maintenancesActions,
} from '../../../clientStore/index.js'
import usePersistedCheckInOutTime from '../../../util/usePersistedCheckInOutTime.js'
import axios from 'axios'
import axiosInstance from '../../../util/axiosConfig'
import LazyImage from '../../../components/custom/dataDisplay/lazyImage.jsx'
import {getAppVersion} from '../../../util/version.js'

const logo = () => import('../../../../resources/images/medias/logoIcon.svg')
const logoRaad = () => import('../../../../resources/images/medias/logoRaad.svg')
const altArrowRight = () => import('../../../../resources/images/medias/altArrowRightOutline.svg')
const altArrowRightA = () => import('../../../../resources/images/medias/altArrowRightActiveOutline.svg')
const mapPointWave = () => import('../../../../resources/images/medias/mapPointWaveOutline.svg')
const mapPointWaveA = () => import('../../../../resources/images/medias/mapPointWaveOutlineActive.svg')
const userRounded = () => import('../../../../resources/images/medias/userRoundedOutline.svg')
const userRoundedA = () => import('../../../../resources/images/medias/userRoundedOutlineActive.svg')
const logout = () => import('../../../../resources/images/medias/logout2Outline.svg')
const documentText = () => import('../../../../resources/images/medias/documentTextOutline.svg')
const documentTextA = () => import('../../../../resources/images/medias/documentTextOutlineActive.svg')
const setting = () => import('../../../../resources/images/medias/settingsOutline.svg')
const settingA = () => import('../../../../resources/images/medias/settingsOutlineActive.svg')
const usersManagement = () => import('../../../../resources/images/medias/usersManagement.svg')
const usersManagementA = () => import('../../../../resources/images/medias/usersManagementActive.svg')


const MainSidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const permissions = useSelector((state) => state.session.permissions)

  const user = useSelector((state) => state.session.user)
  const [sidebarToggle, setSidebarToggle] = useState(false)
  const [sidebarToggleDeley, setSidebarToggleDeley] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const {saveLastTime} = usePersistedCheckInOutTime()

  const handeleToggleClick = () => {
    setSidebarToggle(!sidebarToggle)
    setTimeout(() => {
      setSidebarToggleDeley(!sidebarToggleDeley)
    }, 250)
  }

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
    <aside
      className={cls('sidebar',
        styles.sidebar,
        sidebarToggle ? styles.sidebarLarge : styles.sidebarSmall,
      )}>
      <div className={styles.arrowLeftToggle}>
        <button
          onClick={() => handeleToggleClick()}
          className={styles.arrowLeftWrapper}>
          <LazyImage
            className={styles.arrowLeft}
            src={sidebarToggle ? altArrowRight : altArrowRightA}
            alt=""
          />
        </button>
      </div>
      <div
        className={cls(
          styles.sidebarDetailWrapper,
          sidebarToggle
            ? styles.sidebarDetailWrapperLarge
            : styles.sidebarDetailWrapperSmall,
        )}>
        <div className={styles.sidebarDetail}>
          <div className={styles.logoWrapper}>
            <div className={styles.logo}>
              <div className={styles.logoIconWrapper}>
                <LazyImage className={styles.logoIcon} src={logo} alt="" />
              </div>
              <div
                className={cls(
                  styles.logoIconRaadWrapper,
                  sidebarToggleDeley
                    ? styles.labelWrapperShow
                    : styles.labelWrapperHidden,
                )}>
                <LazyImage
                  className={styles.logoIconRaad}
                  src={logoRaad}
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className={cls(styles.itemsWrapper, styles.topItemsWrapper)}>
            <div className={styles.items}>
              <NavLink
                to="/"
                className={cls(styles.item, ({isActive, isPending}) =>
                  isPending ? '' : isActive ? '' : '',
                )}>
                {({isActive, isPending, isTransitioning}) => (
                  <>
                    <div className={styles.iconWrapper}>
                      <div className={styles.icon}>
                        <LazyImage
                          className={styles.item}
                          src={isActive ? mapPointWaveA : mapPointWave}
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={cls(
                        styles.labelWrapper,
                        sidebarToggleDeley
                          ? styles.labelWrapperShow
                          : styles.labelWrapperHidden,
                      )}>
                      <div
                        className={cls(
                          styles.label,
                          isActive ? 'active' : '',
                        )}>
                        صفحه اصلی
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
              {(permissions.includes('getCombined') || permissions.includes('getRoute') || permissions.includes('getEvents') || permissions.includes('getIgnitionOn') || permissions.includes('getIgnitionDiagram') || permissions.includes('getStopTime') || permissions.includes('getHeatCombined')) &&
                <NavLink to="/report" onClick={handleLink} className={styles.item}>
                  {({isActive, isPending, isTransitioning}) => (
                    <>
                      <div className={styles.iconWrapper}>
                        <div className={styles.icon}>
                          <LazyImage
                            className={styles.item}
                            src={isActive ? documentTextA : documentText}
                            alt=""
                          />
                        </div>
                      </div>
                      <div
                        className={cls(
                          styles.labelWrapper,
                          sidebarToggleDeley
                            ? styles.labelWrapperShow
                            : styles.labelWrapperHidden,
                        )}>
                        <div
                          className={cls(
                            styles.label,
                            isActive ? 'active' : '',
                          )}>
                          گزارش‌ها
                        </div>
                      </div>
                    </>
                  )}
                </NavLink>}
              {(permissions.includes('User-read') || permissions.includes('Event-read') || permissions.includes('Device-read') || permissions.includes('Event-read') || permissions.includes('Geofence-read') || permissions.includes('Driver-read') || permissions.includes('Maintenance-read') || permissions.includes('Imei-read')) &&
                <NavLink to="/settings" onClick={handleLink} className={styles.item}>
                  {({isActive, isPending, isTransitioning}) => (
                    <>
                      <div className={styles.iconWrapper}>
                        <div className={styles.icon}>
                          <LazyImage
                            className={styles.item}
                            src={isActive ? settingA : setting}
                            alt=""
                          />
                        </div>
                      </div>
                      <div
                        className={cls(
                          styles.labelWrapper,
                          sidebarToggleDeley
                            ? styles.labelWrapperShow
                            : styles.labelWrapperHidden,
                        )}>
                        <div
                          className={cls(
                            styles.label,
                            isActive ? 'active' : '',
                          )}>
                          تنظیمات
                        </div>
                      </div>
                    </>
                  )}
                </NavLink>}
              {(permissions.includes('User-read') || permissions.includes('Role-read')) &&
                <NavLink to="/users" onClick={handleLink} className={styles.item}>
                  {({isActive, isPending, isTransitioning}) => (
                    <>
                      <div className={styles.iconWrapper}>
                        <div className={styles.icon}>
                          <LazyImage
                            className={styles.item}
                            src={isActive ? usersManagementA : usersManagement}
                            alt=""
                          />
                        </div>
                      </div>
                      <div
                        className={cls(
                          styles.labelWrapper,
                          sidebarToggleDeley
                            ? styles.labelWrapperShow
                            : styles.labelWrapperHidden,
                        )}>
                        <div
                          className={cls(
                            styles.label,
                            isActive ? 'active' : '',
                          )}>
                          مدیریت کاربران
                        </div>
                      </div>
                    </>
                  )}
                </NavLink>}
            </div>
          </div>
          <div
            className={cls(styles.itemsWrapper, styles.bottomItemsWrapper)}>
            <div className={styles.items}>
              <NavLink to={`/user/${user.id}`} className={styles.item}>
                {({isActive, isPending, isTransitioning}) => (
                  <>
                    <div className={styles.iconWrapper}>
                      <div className={styles.icon}>
                        <LazyImage
                          className={styles.item}
                          src={isActive ? userRoundedA : userRounded}
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={cls(
                        styles.labelWrapper,
                        sidebarToggleDeley
                          ? styles.labelWrapperShow
                          : styles.labelWrapperHidden,
                      )}>
                      <div
                        className={cls(
                          styles.label,
                          isActive ? 'active' : '',
                        )}>
                        حساب کاربری
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
              <button
                type="button"
                className={styles.item}
                onClick={handleLogout}>
                <div className={styles.iconWrapper}>
                  <div className={styles.icon}>
                    <LazyImage className={cls(styles.item, '!text-primary')} src={logout} alt="" />
                  </div>
                </div>
                <div
                  className={cls(
                    styles.labelWrapper,
                    sidebarToggleDeley
                      ? styles.labelWrapperShow
                      : styles.labelWrapperHidden,
                  )}>
                  <div className={styles.label}>خروج از حساب</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-2 right-2 text-xs text-gray-500">
        v{getAppVersion()}
      </div>
    </aside>
  )
}

export default MainSidebar
