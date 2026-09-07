import styles from './PageWrapper.module.css'
import cls from 'classnames'
import React, {PropsWithChildren} from 'react'
import {Outlet} from 'react-router-dom'

const PageWrapper = (props: PropsWithChildren<{className?: string, containerClassName?: string}>) => {
  return <>
    <Outlet />
    <div className={cls(styles.pageWrapper, props.className as any)}>
      <div className={cls(styles.pageWrapperContainer, props.containerClassName as any)}>
        {props.children}
      </div>
    </div>
  </>
}

export default PageWrapper
