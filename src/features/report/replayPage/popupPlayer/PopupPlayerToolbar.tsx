import React from 'react'
import cls from 'classnames'
import styles from './PopupPlayerToolbar.module.css'
import Button from '../../../../common/components/custom/general/button/Button'
import {formatTime} from '../../../../common/util/formatter'

interface PopupPlayerToolbarProps {
  device: any
  positions: any[]
  index: number
  hours12: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
  children?: React.ReactNode
  className?: string,
}

const PopupPlayerToolbar: React.FC<PopupPlayerToolbarProps> = ({
                                                                 device,
                                                                 positions,
                                                                 index,
                                                                 hours12,
                                                                 onClose,
                                                                 onMinimize,
                                                                 isMinimized,
                                                                 className,
                                                                 children,
                                                               }) => {
  return (
    <div className={cls(styles.toolbar, className as any, isMinimized && styles.minimized)}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.time}>
            {positions.length > 0 ? formatTime(positions[index]?.['deviceTime'], 'seconds', hours12) : ''}
          </span>
          <span className={styles.deviceName} title={device?.name}>{device?.name}</span>
        </div>
        <div className={styles.actions}>
          <Button
            onClick={onMinimize}
            className={cls(styles.actionButton, 'fa', isMinimized ? 'fa-chevron-up' : 'fa-chevron-down')}
          />
          {/*<Button*/}
          {/*  onClick={onClose}*/}
          {/*  className={cls(styles.actionButton, 'fa fa-close')}*/}
          {/*/>*/}
        </div>
      </div>
      {!isMinimized && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  )
}

export default PopupPlayerToolbar
