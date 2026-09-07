import styles from './Progress.module.css'
import LogoImage from '../../../../../features/auth/logoImage/LogoImage.jsx'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {errorsActions} from '../../../../clientStore/index.js'

const Progress = ({reload}) => {
  const dispatch = useDispatch()
  const errorMessage = useSelector((state) => state.errors.errorMessage)
  return (
    <>
      {errorMessage === '' ? <span className={styles.loader}></span> :
        <div className={'bg-theme-light flex justify-center py-3'}><span
          className={'text-gray-900 font-bold leading-5 text-medium'}>{errorMessage}</span></div>
      }
      <div className={'fixed w-screen h-[100dvh] top-0 right-0 flex flex-col justify-center items-center'}>
        <LogoImage />
        {errorMessage !== '' &&
          <button onClick={() => {
            dispatch(errorsActions.updateErrorMessage(''))
            reload()
          }}
                  className={'transition-all flex py-[0.375rem] px-3 justify-center items-center gap-2 rounded-[4px] text-green-700 hover:text-primary'}>
            <span className={'text-center text-sm font-normal leading-5'}>تلاش مجدد</span>
          </button>}
      </div>
    </>)
}
export default Progress
