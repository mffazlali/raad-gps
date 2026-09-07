import React, {CSSProperties, ReactNode} from 'react'

export type KitCardType = {
  title?: ReactNode
  extra?: ReactNode
  style?: CSSProperties
  className?: string
  loading?: boolean
}
