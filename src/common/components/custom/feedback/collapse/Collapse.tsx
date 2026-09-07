import React, { PropsWithChildren, useState } from 'react'
import styles from './Collapse.module.css'
import cls from 'classnames'

interface CollapseProps {
  header: React.ReactNode
  defaultOpen?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  fixedHeader?: boolean,
  id?:string,
  onChange?: (isOpen: boolean) => void
}

const Collapse = ({
  id,
  header,
  defaultOpen = false,
  className,
  headerClassName,
  contentClassName,
  fixedHeader = false,
  onChange,
  children,
}: PropsWithChildren<CollapseProps>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleCollapse = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onChange?.(newState)
  }

  return (
    <div id={id} className={cls(styles.collapse, className)}>
      <div
        className={cls(styles.header, headerClassName, {
          [styles.fixedHeader]: fixedHeader,
        })}
        onClick={toggleCollapse}
      >
        <div className={styles.headerContent}>{header}</div>
        <i className={cls('fas fa-chevron-down', styles.icon, {
          [styles.iconOpen]: isOpen,
        })} />
      </div>
      <div
        className={cls(styles.content, contentClassName, {
          [styles.contentOpen]: isOpen,
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default Collapse 