import styles from './DeviceTabs.module.css'
import cls from 'classnames'

const DeviceTabs = ({tabsActive, setTabsActive}) => {

  const tabEnable = (tab) => {
    setTabsActive((tabs) => {
      const tmpTabs = {...tabs}
      Object.entries(tmpTabs).forEach(([key]) => {
        tmpTabs[key] = false
      })
      tmpTabs[tab] = true
      return tmpTabs
    })
  }
  return (<div className={styles.deviceListTabsWrapper}>
      <div className={styles.deviceListTabs}>
        <button className={cls(styles.tab, tabsActive.all ? styles.tabActive : styles.tabInactive)}
                onClick={() => tabEnable('all')}>
                    <span
                      className={cls(styles.tabLabel, tabsActive.all ? styles.tabLabelActive : styles.tabLabelInactive)}>همه</span>
        </button>
        <button className={cls(styles.tab, tabsActive.online ? styles.tabActive : styles.tabInactive)}
                onClick={() => tabEnable('online')}>
                    <span
                      className={cls(styles.tabLabel, tabsActive.online ? styles.tabLabelActive : styles.tabLabelInactive)}>آنلاین</span>
        </button>
        <button className={cls(styles.tab, tabsActive.offline ? styles.tabActive : styles.tabInactive)}
                onClick={() => tabEnable('offline')}>
                    <span
                      className={cls(styles.tabLabel, tabsActive.offline ? styles.tabLabelActive : styles.tabLabelInactive)}>آفلاین</span>
        </button>
      </div>
    </div>)
}

export default DeviceTabs
