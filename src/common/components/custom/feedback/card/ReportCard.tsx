import React, {useEffect, useState} from 'react'
import styles from './ReportCard.module.css'
import cls from 'classnames'

interface ReportCardProps {
  tableContent?: React.ReactNode;
  mapContent?: React.ReactNode;
  showMap?: boolean
  onHideMap?: () => void
  chartContent?: React.ReactNode;
  isLoading?: boolean
  className?: string;
  containerId?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
                                                 isLoading,
                                                 chartContent,
                                                 tableContent,
                                                 mapContent,
                                                 showMap = false,
                                                 onHideMap,
                                                 className,
                                                 containerId,
                                               }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(showMap)
  const [containerHeight, setContainerHeight] = useState('100dvh')

  useEffect(() => {
    if (containerId) {
      const updateHeight = () => {
        const element = document.getElementById(containerId)
        if (element) {
          setContainerHeight(`${element.offsetHeight}`)
        }
      }

      updateHeight()
      window.addEventListener('resize', updateHeight)
      return () => window.removeEventListener('resize', updateHeight)
    }
  }, [containerId])

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      if (onHideMap) {
        onHideMap()
      }
    }
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    setIsSidebarOpen(showMap)
  }, [showMap])


  return (
    <div className={cls(styles.card, className)} style={{height: `${containerHeight}px`}}>
      <div className={cls(styles.cardContent)}>
        <div className={styles.cardContentWrapper}>
          {mapContent && (
            <div
              className={cls(styles.sidebar, isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed)}
              role="complementary"
              aria-label="نقشه"
            >
              {(tableContent || chartContent) && <button
                disabled={isLoading}
                className={styles.toggleButton}
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? 'بستن نقشه' : 'باز کردن نقشه'}
                aria-expanded={isSidebarOpen}
                title={isSidebarOpen ? 'بستن نقشه' : 'باز کردن نقشه'}
              >
                <i
                  className={cls('fas fa-chevron-left', 'transition-transform duration-200 hover:text-primary-hover disabled:text-primary-disable', isSidebarOpen ? 'rotate-180 text-primary-active' : 'text-gray-600', isLoading && 'text-primary-disable')} />
              </button>}
              <div className={styles.mapSection}>
                {mapContent}
              </div>
            </div>
          )}
          {tableContent && (
            <div className={cls(styles.tableSection, (!mapContent && !chartContent) && styles.mapSectionFullWidth)}>
              {tableContent}
            </div>
          )}
          {chartContent && (
            <div className={cls(styles.chartSection, (!mapContent && !tableContent) && styles.mapSectionFullWidth)}>
              {chartContent}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportCard
