import React, {CSSProperties, ReactNode} from 'react'

export type CardType = {
  id?: any
  title?: ReactNode
  style?: CSSProperties
  className?: string
  contentClassName?: string
}
