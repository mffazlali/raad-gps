import styles from './KitInputError.module.css'
import {KitInputErrorType} from './KitInputErrorType.ts'
import cls from 'classnames'

const KitInputError = (props: KitInputErrorType) => {
  return props.label &&
    <span className={cls(styles.inputError, props.className)}>{props.label ? props.label : <>&nbsp;</>}</span>
}

export default KitInputError
