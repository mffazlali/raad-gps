import styles from './Button.module.css'
import {ButtonType} from './Button.type.ts'
import cls from 'classnames'
import Spinner from '../../feedback/spinner/Spinner'
import {Suspense, useEffect, useState} from 'react'
import LazyImage from '../../dataDisplay/lazyImage.jsx'

const Button = (props: ButtonType) => {
  const [isHover, setIsHover] = useState(false)


  const renderIcon = () => {
    if (props.disabled) {
      if (props.iconDisable) {
        return <LazyImage src={props.iconDisable} alt="" className={cls(styles.icon, props.iconClassName)} title={''} />
      }
    } else {
      if (isHover) {
        if (props.iconHover) {
          return <LazyImage src={props.iconHover} alt="" className={cls(styles.icon, props.iconClassName)} title={''} />
        }
      } else {
        if (props.icon) {
          return <LazyImage src={props.icon} alt="" className={cls(styles.icon, props.iconClassName)} title={''} />
        }
      }
    }
    return <></>
  }
  return <button
    key={props.id}
    type={props.type}
    onMouseMove={() => {
      if (!props.disabled && props.iconHover) setIsHover(true)
    }}
    onMouseLeave={() => {
      if (!props.disabled && props.iconHover) {
        setIsHover(false)
      }
    }}
    onClick={props.onClick}
    disabled={props.disabled || props.loading}
    className={cls(styles.button, props.className as any, 'relative')}>
    {props.title && <div style={{}}
                          className={cls('flex items-center justify-center gap-2 w-full h-full', !props.disabled && !props.loading &&'hover:!text-inherit active:!text-inherit', props.titleClassName as any)}><span>{props.title}</span>{props.fontClassName &&
      <span className={cls(props.fontClassName)}></span>}
</div>}
    {props.icon && renderIcon()}
    {props.loading && <span className={'relative'}><Spinner
      className={cls('!border-t-white/90 !border-r-white/90', props.spinClassName)} /></span>}
  </button>
}

export default Button
