import React from 'react'
import Button from '../../../../common/components/custom/general/button/Button'
import { preoids } from '../../../../common/util/constants'
import cls from 'classnames'
import styles from '../ReplayPage.module.css'

interface ReplayPeriodSelectorProps {
  periodState: string
  loading: boolean
  deviceId: string | null
  onPeriodChange: (period: string) => void
  isDesktop?: boolean
}

const ReplayPeriodSelector: React.FC<ReplayPeriodSelectorProps> = ({
  periodState,
  loading,
  deviceId,
  onPeriodChange,
  isDesktop = true
}) => {
  return (
    <div className={cls(styles.typesAction)}>
      {[...preoids]
        .filter(item => +item.value < 7)
        .map((item, index) => (
          <Button
            key={index + 1}
            type="button"
            onClick={() => onPeriodChange(item.value)}
            title={item.label}
            className={cls(
              styles.typeButton,
              'btn-primary-outline',
              periodState === item.value && 'btn-primary'
            )}
            loading={loading && periodState === item.value}
            fontClassName={isDesktop ? (periodState === item.value && !loading) ? 'fa fa-check' : '' : ''}
            titleClassName={cls(styles.label, styles.registerLabel)}
            spinClassName={isDesktop ? '' : '!border-[1px] !w-1 !h-1'}
            disabled={deviceId == null || deviceId === 'undefined' || deviceId === undefined}
          />
        ))}
    </div>
  )
}

export default ReplayPeriodSelector 