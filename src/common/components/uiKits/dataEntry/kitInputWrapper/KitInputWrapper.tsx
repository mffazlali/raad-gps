import {PropsWithChildren} from 'react'
import {KitInputWrapperType} from './KitInputWrapperType.ts'
import styles from './KitInputWrapper.module.css'
import cls from 'classnames'
import KitSkeleton from '../../feeback/kitSkeleton/KitSkeleton.tsx'


const KitInputWrapper = (props: PropsWithChildren<KitInputWrapperType>) => {
  return <>
    {!props.loading &&
      <div id={props.name} className={cls(styles.inputLabel, props.direction === 'col' ? 'flex-col' : 'flex-row flex-wrap')}>
        <label className={cls(styles.label, props.labelClassName, props.direction === 'col' ? '' : 'pe-2')}
               htmlFor={props.name}>{props.label}{props.required &&
          <span className={styles.required}>*</span>}</label>
        {props.children}
      </div>}
    {props.loading && <KitSkeleton loading={true} />}
  </>
}

export default KitInputWrapper
