import styles from './TabSidebar.module.css'
import cls from 'classnames'
import TabSidebarItems from './tabSidebarItems/TabSidebarItems.jsx'

const TabSidebar = ({ header, items }) => {
  return (<div className={styles.tabSidebar}>
    <div className={styles.tabSidebarContainer}>
      <div className={styles.tabSidebarWrapper}>
        <h1 className={styles.tabSidebarHeader}>{header}</h1>
        <TabSidebarItems items={items} />
      </div>
    </div>
  </div>)
}
export default TabSidebar

