import React, {CSSProperties, ImgHTMLAttributes} from 'react'

export type ButtonType = {
  id?: any
  title?: string | undefined
  titleClassName?: string
  icon?: string | undefined
  iconHover?: string | undefined
  iconDisable?: string | undefined
  type?: 'submit' | 'button'
  mode?: 'primary' | 'outline' | 'text'
  disabled?: boolean
  style?: CSSProperties
  className?: string
  iconClassName?: string
  fontClassName?: string
  spinClassName?: string
  loading?: boolean
  onClick?: () => void
}

