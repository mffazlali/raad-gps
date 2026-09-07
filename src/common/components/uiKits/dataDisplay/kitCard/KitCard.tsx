import {Card} from 'antd'
import {KitCardType} from './KitCardType.ts'
import {PropsWithChildren} from 'react'

const KitCard = (props: PropsWithChildren<KitCardType>) => {

  return <Card title={props.title} extra={props.extra} style={{background: 'transparent', ...props.style}}
               className={props.className} size={'default'}
               loading={props.loading} bordered={false}>
    {props.children}
  </Card>
}

export default KitCard
