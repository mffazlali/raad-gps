import {Button, message as messageAntd, notification, Space} from 'antd'
import {CSSProperties} from 'react'

type MessageMode = 'info' | 'warning' | 'error' | 'success' | 'loading'
type NotificationType = {
  message: string,
  type: MessageMode,
  duration?: number,
  key?: string,
  style?: CSSProperties,
  onClick?: () => any,
  onClose?: () => any,
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottom' | 'top' | 'bottomRight'
}

const useNotification = () => {
  const [api, contextHolder] = notification.useNotification()

  const btn = (key: String, click?: () => any, close?: () => any) => (
    <Space>
      {close && <Button type="link" size="small" onClick={() => {
        close()
        api.destroy(key as any)
      }}>
        لغو
      </Button>}
      {click && <Button type="default" size="small" onClick={() => {
        click()
        api.destroy(key as any)
      }}>
        تایید
      </Button>}
    </Space>
  )

  const closeNotification = (key: any) => {
    api.destroy(key)
  }

  const showNotification = ({
                              message,
                              type,
                              duration,
                              key,
                              onClick,
                              onClose,
                              placement = 'topLeft',
                            }: NotificationType) => {
    switch (type) {
      case 'info':
        api.info({
            message: message, duration, key, placement, btn: (onClick || onClose) && btn(key, onClick, onClose)
            , onClick, onClose,
          },
        )
        break
      case
      'warning'
      :
        api.warning({
            message: message, duration, key, placement,
            btn: (onClick || onClose) && btn(key, onClick, onClose)
            , onClick, onClose,
          },
        )
        break
      case
      'error'
      :
        api.error({
          message: message,
          duration,
          key,
          placement,
          btn: (onClick || onClose) && btn(key, onClick, onClose),
          onClick,
          onClose,
        })
        break
      case
      'success'
      :
        api.success({
            message: message, duration, key, placement, btn: (onClick || onClose) && btn(key, onClick, onClose)
            , onClick, onClose,
          },
        )
        break
    }
  }

  return {contextHolder, showNotification, closeNotification}
}

export default useNotification
