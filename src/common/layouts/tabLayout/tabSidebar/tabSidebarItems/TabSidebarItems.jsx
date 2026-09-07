import styles from './TabSidebarItems.module.css'
import cls from 'classnames'
import TabSidebarItem from './tabSidebarItem/TabSidebarItem.jsx'

const TabSidebarItems = ({items}) => {
  const tabSidebarItem = () =>
    items.filter(item => !item.hide).map((item, index) => <TabSidebarItem key={index} index={index}
                                                                          itemIsLast={index === (items.length - 1)}
                                                                          item={item}
      />,
    )
  return (<div className={styles.tabSidebarItems}>
    <div className={styles.tabSidebarItemsContainer}>
      {tabSidebarItem()}
    </div>
  </div>)
}
export default TabSidebarItems

