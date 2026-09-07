import React from 'react'
import styles from './ActionsButton.module.css'
import cls from 'classnames'
import Button from '../button/Button'

interface ActionsWrapperProps {
  onCancel: () => void
  isSubmitDisabled?: boolean
  isSubmitHide?: boolean
  isLoading?: boolean
  cancelText?: string
  submitText?: string
}

const ActionsButton: React.FC<ActionsWrapperProps> = ({
                                                        onCancel,
                                                        isSubmitDisabled = false,
                                                        isLoading = false,
                                                        cancelText = 'لغو',
                                                        submitText = 'ثبت',
                                                        isSubmitHide = false,
                                                      }) => {
  return (
    <div className={styles.actionsWrapper}>
      <div className={styles.actions}>
        <Button
          type="button"
          title={cancelText}
          onClick={onCancel}
          className={cls(styles.button, styles.cancelButton, 'btn-primary-outline')}
          titleClassName={cls(styles.label, styles.cancelLabel)}
          fontClassName={'fa fa-close'}
        />
        {!isSubmitHide && <Button
          type="submit"
          title={submitText}
          disabled={isSubmitDisabled}
          className={cls(
            styles.button,
            styles.registerButton,
            'btn-primary',
          )}
          titleClassName={cls(styles.label, styles.registerLabel)}
          fontClassName={'fa fa-check'}
          loading={isLoading}
        />}
      </div>
    </div>
  )
}

export default ActionsButton
