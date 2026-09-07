import {CSSProperties} from 'react'

export type ModalTypes = 'page' | 'tab' | 'mobileContentPopup' | 'mobileContent' | 'mobileTab'

export type ModalType = {
  open: boolean
  setOpen: (open: boolean) => any
  pageMode: boolean
  type?: ModalTypes
  wrapperClassName?: string
  backdropClassName?: string
  dependency?: any[]
}


