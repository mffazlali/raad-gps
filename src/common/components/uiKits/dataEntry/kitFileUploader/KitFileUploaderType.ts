import {InputBaseType} from '../InputBaseType.ts'
import {RcFile, UploadChangeParam} from 'antd/es/upload'
import {UploadFile} from 'antd/lib'
import {ChangeEvent} from 'react'
import {UploadProps} from 'antd'
import type { RcFile as OriRcFile, UploadRequestOption as RcCustomRequestOptions, UploadProps as RcUploadProps } from 'rc-upload/lib/interface';


export type KitFileUploaderType = InputBaseType & {
  type?: 'simple' | 'dragger'
  value?: any[]
  multiple?: boolean
  title: string
  accept?: string
  maxCount?: number
  action?: string
  showUploadList?: boolean
  onChange?: (info: {target: {type: any, name: any, value: UploadChangeParam<RcFile>, id: any}}) => void
  beforeUpload?: (info: {target: {type: any, name: any, value: RcFile, id: any}}) => void
  customRequest?: (options: RcCustomRequestOptions<any>) => void
}

