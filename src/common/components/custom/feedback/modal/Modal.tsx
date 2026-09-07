import React, {PropsWithChildren, useCallback, useEffect, useState} from 'react'
import styles from './Modal.module.css'
import cls from 'classnames'
import {useNavigate} from 'react-router-dom'
import {ModalType} from './Modal.type.ts'


export function Modal({
                        open,
                        setOpen,
                        children,
                        pageMode,
                        type,
                        wrapperClassName,
                        backdropClassName,
                        dependency,
                      }: PropsWithChildren<ModalType>) {
  const navigate = useNavigate()
  const [show, setShow] = useState(open)
  const closeModal = () => {
    setOpen(false)
  }

  const handleKeyboardEvent = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvent)
    return () => {
      window.removeEventListener('resize', handleKeyboardEvent)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setShow(open)
      if (!open && pageMode) {
        navigate(-1)
      }
    }, 150)
  }, [open])

  const backHandle = (event: any) => {
    if (type.includes('mobile')) {
      if (event.target.id === 'iconsModalContainer') closeModal()
    }
  }

  const getStyleModal = () => {
    let result = null
    switch (type) {
      case 'tab':
        result = styles.modalTab
        break
      case 'page':
        result = styles.modalPage
        break
      case 'mobileContentPopup':
        result = styles.modalMobileContentPopup
        break
      case 'mobileContent':
        result = styles.modalMobileContent
        break
      case  'mobileTab':
        result = styles.modalMobileTab
        break
      default:
        result = styles.modalPage
    }
    return result
  }

  const getStyleContianerModal = () => {
    let result = null
    switch (type) {
      case 'tab':
        result = styles.modalContainerTab
        break
      case 'page':
        result = styles.modalContainerPage
        break
      case 'mobileContentPopup':
        result = styles.modalContainerMobilePopup
        break
      case 'mobileContent':
        result = styles.modalContainerMobileContent
        break
      case 'mobileTab':
        result = styles.modalContainerMobileTab
        break

      default:
        result = styles.modalContainer
    }
    return result
  }

  const getStyleWrapperModal = () => {
    let result = null
    switch (type) {
      case 'tab':
        result = styles.modalWrapperTab
        break
      case 'page':
        result = styles.modalWrapper
        break
      case 'mobileContentPopup':
        result = styles.modalWrapperMobile
        break
      case 'mobileContent':
        result = styles.modalWrapperMobile
        break
      case 'mobileTab':
        result = styles.modalWrapperMobile
        break

      default:
        result = styles.modalWrapper
    }
    return result
  }

  const getStyleBackDrop = () => {
    let result = null
    switch (type) {
      case 'tab':
        result = styles.backdrop
        break
      case 'page':
        result = styles.backdrop
        break
      case 'mobileContentPopup':
        result = styles.backdropMobileContentPopup
        break
      case 'mobileContent':
        result = styles.backdropMobileContent
        break
      case  'mobileTab':
        result = styles.backdropMobileTab
        break
      default:
        result = styles.backdrop
    }
    return result
  }

  const getStyleModalShowAnimation = () => {
    let result = null
    switch (type) {
      case 'tab':
        result = styles.modalShow
        break
      case 'page':
        result = styles.modalShow
        break
      case 'mobileContentPopup':
        result = styles.modalShowMobileContent
        break
      case 'mobileContent':
        result = styles.modalShowMobileContent
        break
      case  'mobileTab':
        result = styles.modalShowMobileTab
        break
      default:
        result = styles.modalShow
    }
    return result
  }

  const getStyleModalHideAnimation = () => {
    let result = null
    switch (type) {
      case 'tab':
        result = styles.modalHide
        break
      case 'page':
        result = styles.modalHide
        break
      case 'mobileContentPopup':
        result = styles.modalHideMobileContent
        break
      case 'mobileContent':
        result = styles.modalHideMobileContent
        break
      case  'mobileTab':
        result = styles.modalHideMobileTab
        break
      default:
        result = styles.modalHide
    }
    return result
  }

  const renderModal = useCallback(() => {
    return (
      <>
        <div
          className={cls(styles.modal, !type.includes('mobile') ? 'z-[9000]' : 'z-[4000]', getStyleModal())}>
          <div
            id="iconsModalContainer"
            onClick={(event) => backHandle(event)}
            className={cls(styles.modalContainer, getStyleContianerModal())}>
            <div
              className={cls(
                getStyleWrapperModal(), wrapperClassName,
                open
                  ? `opacity-100 ${getStyleModalShowAnimation()}`
                  : `opacity-0 ${getStyleModalHideAnimation()}`,
              )}>
              {children}
            </div>
          </div>
        </div>
        <div onClick={closeModal}
             className={cls(backdropClassName, getStyleBackDrop(), open
               ? `opacity-100 ${getStyleModalShowAnimation()}`
               : `opacity-0 ${getStyleModalHideAnimation()}`)}></div>
      </>
    )
  }, [open, show, setShow, {...dependency}])
  return show && renderModal()
}

export default Modal
