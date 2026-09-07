import React from 'react'
import {InputStatus} from 'antd/es/_util/statusUtils'

export type InputBaseType = {
  name: string
  disabled?: boolean
  style?: React.CSSProperties
  classname?: string | undefined
  status?: InputStatus
}

