import {message as messageAntd, Modal} from 'antd'
import React, {CSSProperties} from 'react'

type ConfirmMode = 'info' | 'warning' | 'error' | 'success' | 'warn' | 'confirm'
type ConfirmType = {
  title: string,
  message: string
  type: ConfirmMode,
  style?: CSSProperties,
  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void
  okText?: string
  cancelText?: string
}

const useConfirm = () => {
  const [modal, contextHolder] = Modal.useModal()

  const showConfirm = ({type, title, message, onOk, onCancel, okText = 'بلی', cancelText = 'خیر'}: ConfirmType) => {
    switch (type) {
      case 'info':
        modal.confirm({
          type: 'info', title, content: message, onOk, onCancel, okText, cancelText,
        })
        break
      case 'warning':
        modal.confirm({
          type: 'warning', title, content: message, onOk, onCancel, okText, cancelText,
        })
        break
      case 'error':
        modal.confirm({
          type: 'error', title, content: message, onOk, onCancel, okText, cancelText,
        })
        break
      case 'success':
        modal.confirm({
          type: 'success', title, content: message, onOk, onCancel, okText, cancelText,
        })
        break
    }
  }
  return {contextConfirmHolder: contextHolder, showConfirm}
}

export default useConfirm
