import styles from './InputSearch.module.css'
import menuDotsLinear from '../../../../../resources/images/medias/menuDotsLinear.svg'
import magniferLinear from '../../../../../resources/images/medias/magniferLinear.svg'

const InputSearch = (props) => {
  const handleChangeInput = (event) => {
    if (props.change) {
      props.change(event.currentTarget.value)
    }
  }

  const handleClickInput = () => {
    if (props.click) {
      props.click()
    }
  }
  return (
    <div className={styles.inputSearch}>
      <div className={styles.inputSearchContainer}>
        <div className={styles.dotsIconWrapper}>
          <img src={menuDotsLinear} alt="" className={styles.dotsIcon} />
        </div>
        <div className={styles.inputTextWrapper}>
          <input
            type="text"
            placeholder="جستجو دستگاه...."
            onChange={handleChangeInput}
            className={styles.inputText}
            onClick={handleClickInput}
          />
        </div>
        <div className={styles.searchIconWrapper}>
          <img src={magniferLinear} alt="" className={styles.searchIcon} />
        </div>
      </div>
    </div>
  )
}

export default InputSearch
