export type KitPopconfirmType = {
  title: string
  description: string
  onConfirm: ((e?: (React.MouseEvent<HTMLElement, MouseEvent> | undefined)) => void)
  onCancel: ((e?: (React.MouseEvent<HTMLElement, MouseEvent> | undefined)) => void)
  okText: string
  cancelText: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

