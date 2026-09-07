import {Button, Modal, Space} from 'antd'
import {CSSProperties} from 'react'

type MessageMode = 'info' | 'warning' | 'error' | 'success'
type MessageType = {
  message: string,
  title: string,
  type: MessageMode,
  key?: string,
  style?: CSSProperties
}

const useModalMessage = () => {

  const showModalMessage = ({message, title, type, key}: MessageType) => {
    switch (type) {
      case 'info':
        Modal.info({
          title: title, content: message, okText: 'بستن',
        })
        break
      case 'warning':
        Modal.warning({
          title: title, content: message, okText: 'بستن',
        })
        break
      case 'error':
        Modal.error({
          title: title, content: message, okText: 'بستن',
        })
        break
      case 'success':
        Modal.success({
          title: title, content: message, okText: 'بستن',
        })
        break
    }
  }
  return {showModalMessage}
}

export default useModalMessage
