import styles from './MainMobileHeader.module.css'
import cls from 'classnames'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {layoutActions} from '../../../common/clientStore/layout.js'
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {nativePostMessage} from '../../../common/components/NativeInterface.js'
import {
  commandsActions,
  devicesActions, driversActions,
  eventsActions,
  geofencesActions, groupsActions, rolesActions,
  sessionActions, usersActions,
} from '../../../common/clientStore/index.js'
import usePersistedCheckInOutTime from '../../../common/util/usePersistedCheckInOutTime.js'
import axios from 'axios'
import axiosInstance from '../../../common/util/axiosConfig'
import LazyImage from '../../../common/components/custom/dataDisplay/lazyImage.jsx'

// Lazy loaded image imports
const screenIcon = () => import('../../../resources/images/medias/screenCastOutline.svg')
const screenIconActive = () => import('../../../resources/images/medias/screenCastOutlineActive.svg')
const userIcon = () => import('../../../resources/images/medias/userRoundedSMOutline.svg')
const userIconActive = () => import('../../../resources/images/medias/userRoundedOutlineActive.svg')
const logout = () => import('../../../resources/images/medias/logout2Outline.svg')
const replayIcon = () => import('../../../resources/images/medias/otherOutline.svg')
const replayActiveIcon = () => import('../../../resources/images/medias/otherOutlineActive.svg')

import InputSearch from '../../../common/components/custom/dataEntry/inputSearch/InputSearch.jsx'
import mapPointWaveActiveIcon from '../../../resources/images/medias/mapPointWaveActiveSmOutline.svg'
import mapPointWaveIcon from '../../../resources/images/medias/mapPointWaveSmOutline.svg'

const MainMobileHeader = ({devices, setKeyword, showDevices, setShowDevices,disable=false}) => {
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.session.user)
  const [isScreenActive, setIsScreenActive] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const {saveLastTime} = usePersistedCheckInOutTime()

  const setFilteredDevices = (devices) => {
    dispatch(layoutActions.setFilteredDevices(devices))
  }

  const handleClickSearch = () => {
    if (setShowDevices && showDevices == false) {
      setShowDevices(true)
    }
  }

  const handleSearch = (keyword) => {
    setKeyword(keyword)
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
          const response = await axiosInstance.put(`/api/users/${user.id}`, updatedUser)
          if (response.status === 200) {
            // User updated successfully
          }
        } catch (error) {
          console.error('Error updating user:', error)
        }
      }
    } else {
      window.localStorage.removeItem('notificationToken')
    }

    try {
      const response = await axiosInstance.delete('/api/session')
      if (response.status === 204) {
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
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <header className={styles.mobileHeader}>
      <div className={styles.mobileHeaderContainer}>
        {disable && <div className="absolute w-full h-full bg-[rgba(0,0,0,0.45)]"></div>}
        <div className={styles.mobileHeaderItems}>
          <button className={styles.screenItemWrapper} onClick={() => {
            if (isScreenActive) {
              setIsScreenActive(false)
            }
            if (pathname === `/user/${user.id}`) {
              navigate(-1)
            }
            setShowDevices(!showDevices)
          }}>
            <LazyImage src={showDevices ? screenIconActive : screenIcon} alt="" className={styles.screenItem} />
          </button>
          <div className={styles.searchItemWrapper}>
            <InputSearch click={handleClickSearch} change={handleSearch} />
          </div>
          <NavLink
            to={pathname === `/user/${user.id}` ? '/' : `/user/${user.id}`}
            onClick={() => {
              setShowDevices(false)
            }}
            className={cls(styles.userItemWrapper, ({isActive, isPending}) =>
              isPending ? '' : isActive ? '' : '',
            )}>
            {({isActive, isPending, isTransitioning}) => (
              <LazyImage src={pathname === `/user/${user.id}` ? userIconActive : userIcon} alt="" className={styles.userItem} />
            )}
          </NavLink>
          <NavLink
            to={pathname === `/replay` ? '/' : `/replay`}
            onClick={() => {
              setShowDevices(false)
            }}
            className={cls(styles.userItemWrapper, ({isActive, isPending}) =>
              isPending ? '' : isActive ? '' : '',
            )}>
            {({isActive, isPending, isTransitioning}) => (
              <LazyImage src={pathname === `/replay` ? replayActiveIcon : replayIcon} alt="" className={styles.userItem} />
            )}
          </NavLink>
          {/*<button className={styles.logoutItemWrapper} onClick={() => {*/}
          {/*  handleLogout()*/}
          {/*}}>*/}
          {/*  <img src={logout} alt="" className={cls(styles.logoutItem, '!text-primary')}></img>*/}
          {/*</button>*/}
        </div>
      </div>
    </header>
  )
}

export default MainMobileHeader
