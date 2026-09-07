import styles from './TabSidebarItem.module.css'
import cls from 'classnames'
import {memo} from 'react'
import arrowIconRight from '../../../../../../resources/images/medias/arrowRightOutline.svg'
import mapPointWaveA from '../../../../../../resources/images/medias/mapPointWaveOutlineActive.svg'
import mapPointWave from '../../../../../../resources/images/medias/mapPointWaveOutline.svg'
import {NavLink} from 'react-router-dom'
import LazyImage from '../../../../../../common/components/custom/dataDisplay/lazyImage'

const TabSidebarItem = memo(({item, index, itemIsLast}) => {
  return (<div className={cls('tabSidebar', styles.tabSidebarItem)}>
    <NavLink
      to={item.link}
      state={{item, index}}
      className={cls(styles.tabSidebarItemContainer, ({
                                                        isActive,
                                                        isPending,
                                                      }) =>
        isPending ? '' : isActive ? 'active' : '')}
    >
      {({isActive, isPending, isTransitioning}) => (
        <>
          <div className={styles.tabSidebarItemContent}>
            <div className={styles.iconWrapper}>
              <img src={item.icon} alt={item.title} className={styles.icon} />
            </div>
            <div className={styles.title}>{item.title}</div>
          </div>
          <div className={styles.arrowIconWrapper}>
            {!isActive && <img src={arrowIconRight} alt="" className={styles.arrowIcon} />}
            {isActive && <span className={styles.arrowIcon} />}
          </div>
        </>
      )}
    </NavLink>
    {!itemIsLast && <div className={styles.tabSidebarItemLine}></div>}
  </div>)
}, arePropsEqual)

function arePropsEqual(oldProps, newProps) {
  return oldProps.item === newProps.item
}

export default TabSidebarItem

