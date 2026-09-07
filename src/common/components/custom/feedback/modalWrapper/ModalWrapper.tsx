import styles from './ModalWrapper.module.css'
import cls from 'classnames'
import React, {PropsWithChildren, useState} from 'react'
import {Outlet} from 'react-router-dom'
import Modal from '../modal/Modal.tsx'
import GroupRegister from '../../../../../features/settings/groups/groupRegister/GroupRegister.tsx'
import {ModalTypes} from '../modal/Modal.type.ts'

type PageWrapperType = {setOpen: React.Dispatch<React.SetStateAction<boolean>>}
const ModalWrapper = ({typeForm, RegisterComponent, wrapperClassName}: PropsWithChildren<{
  typeForm: ModalTypes,
  RegisterComponent: any
  wrapperClassName?: string
}>) => {
  const [showDeviceRegister, setShowDeviceRegister] = useState(true)

  return (
    <Modal wrapperClassName={cls('max-w-[578px]', wrapperClassName)} type={typeForm} open={showDeviceRegister}
           setOpen={setShowDeviceRegister}
           pageMode={true}>
      <RegisterComponent setOpen={setShowDeviceRegister} />
    </Modal>
  )
}

export default ModalWrapper
