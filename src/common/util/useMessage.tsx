import {message as messageAntd} from 'antd'
import {CSSProperties} from 'react'

type MessageMode = 'info' | 'warning' | 'error' | 'success' | 'loading'
type MessageType = {
  message: string,
  type: MessageMode,
  duration?: number,
  key?: string,
  style?: CSSProperties,
  onClick?: () => void
}

const useMessage = () => {
  const [messageApi, contextHolder] = messageAntd.useMessage()

  const showMessage = ({message, type, duration, key, onClick}: MessageType) => {
    switch (type) {
      case 'info':
        messageApi.open({
          type: 'info', content: message, duration, key, onClick,
        })
        break
      case 'warning':
        messageApi.open({
          type: 'warning', content: message, duration, key,onClick,
        })
        break
      case 'error':
        messageApi.open({
          type: 'error', content: message, duration, key,onClick,
        })
        break
      case 'success':
        messageApi.open({
          type: 'success', content: <span>{message}</span>, duration, key,onClick,
        })
        break
      case 'loading':
        messageApi.open({
          type: 'loading',
          content: message,
          duration,
          onClick,
          key,
          icon: <span className={'relative w-4 h-4 px-3'}><span
            className="absolute right-0 rounded-full w-4 h-4 border-[3px] border-solid border-primary border-t-transparent animate-spin"></span></span>,

        })
        break
    }
  }
  return {contextHolder, showMessage}
}

export default useMessage
