import {Popconfirm as PopconfirmFeedback} from 'antd'
import {KitPopconfirmType} from './KitPopconfirmType.ts'
import React, {PropsWithChildren} from 'react'

const KitPopconfirm = (props: PropsWithChildren<KitPopconfirmType>) => {
  return <PopconfirmFeedback
    title={props.title}
    description={props.description}
    onConfirm={props.onConfirm}
    onCancel={props.onCancel}
    okText={props.okText}
    cancelText={props.cancelText}
    placement={props.placement}
  >
    {props.children}
  </PopconfirmFeedback>
}

export default KitPopconfirm
