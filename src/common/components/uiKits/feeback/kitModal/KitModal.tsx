import type {KitModalType} from './KitModalType.ts'
import React, {useState, PropsWithChildren} from 'react'
import {Button, Modal} from 'antd'

const KitModal = (props: PropsWithChildren<KitModalType>) => {

  const handleCancel = () => {
    props.setClose()
  }

  return (
    <Modal okText={props.okText} cancelText={props.cancelText} closeIcon={false} title={props.title} open={props.isOpen}
           onOk={props.onOk} onCancel={props.onCancel ? props.onCancel : handleCancel} mask={props.isMask} maskClosable={false}>
      {props.children}
    </Modal>

  )
}

export default KitModal
