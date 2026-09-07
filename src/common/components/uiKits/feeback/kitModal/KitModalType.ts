import React from 'react'

export type KitModalType = {
  title?: string
  isOpen: boolean
  setClose: () => void
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
  isMask?: boolean
}

