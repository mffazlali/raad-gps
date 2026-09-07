import {CardType} from './CardType.ts'
import {PropsWithChildren} from 'react'
import styles from './Card.module.css'
import cls from 'classnames'

const Card = (props: PropsWithChildren<CardType>) => {
  return <div key={props.id ? props.id : ''} className={cls(styles.card, props.className as any)}>
    <div className={styles.cardContainer}>
      <div className={styles.headerWrapper}>
        <div className={styles.header}>
          {props.title}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={cls(styles.content, props.contentClassName as any)}>
          {props.children}
        </div>
      </div>
    </div>
  </div>
}

export default Card
