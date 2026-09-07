import styles from './TabLayout.module.css'
import cls from 'classnames'
import TabSidebar from './tabSidebar/TabSidebar.jsx'
import TabContent from './tabContent/TabContent.jsx'
import { useState } from 'react'

const TabLayout = ({ tabs }) => {
  const { header, items } = tabs
  return (<div className={styles.tabLayout}>
    <TabSidebar header={header} items={items} />
    <TabContent/>
  </div>)
}
export default TabLayout

