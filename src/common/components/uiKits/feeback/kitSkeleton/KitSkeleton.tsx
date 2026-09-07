import {Skeleton} from 'antd'
import {KitSkeletonType} from './KitSkeletonType.ts'
import React, {PropsWithChildren} from 'react'

const KitSkeleton = (props: PropsWithChildren<KitSkeletonType>) => {
  return <Skeleton style={props.style} className={props.className} round={true} paragraph={{rows: 1}} title={true}
                   loading={props.loading} active={props.active}
                   avatar={props.avatar}>{props.children}</Skeleton>
}

export default KitSkeleton
