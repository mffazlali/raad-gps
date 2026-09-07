import styles from './Spinner.module.css'
import cls from 'classnames'

const Spinner = ({className = ''}) => {
  return (
    <span className={cls(styles.spinner, className)}></span>
  )
}
export default Spinner
