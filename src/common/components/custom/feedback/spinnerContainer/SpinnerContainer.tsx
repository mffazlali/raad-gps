import styles from './SpinnerContainer.module.css'
import cls from 'classnames'
import Spinner from '../spinner/Spinner.jsx'

const SpinnerContainer = ({className}: {className?: string}) => {
  return (
    <div className={cls(styles.spinnerContainer, className ? className : '')}>
      <div className={styles.spinnerContainerBackdrop}></div>
      <div className={styles.spinnerContainerWrapper}>
        {/*<span className={styles.spinner}></span>*/}
        <Spinner />
        <span>لطفا صبر کنید</span>
      </div>
    </div>
  )
}
export default SpinnerContainer
