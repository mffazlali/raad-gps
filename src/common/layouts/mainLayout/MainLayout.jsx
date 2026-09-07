import styles from './MainLayout.module.css'
import cls from 'classnames'
import MainSidebar from './mainSidebar/MainSidebar.jsx'
import MainContent from './mainContent/MainContent.jsx'

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.layoutContainer}>
        <MainSidebar />
        <MainContent />
      </div>
    </div>
  )
}

export default MainLayout
