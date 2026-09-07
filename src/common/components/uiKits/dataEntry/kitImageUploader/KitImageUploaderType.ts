import {InputBaseType} from '../InputBaseType.ts'
import {RcFile, UploadChangeParam} from 'antd/es/upload'
import {UploadFile} from 'antd/lib'
import {ChangeEvent} from 'react'

export type KitImageUploaderType = InputBaseType & {
  type?: 'simple' | 'dragger'
  accept?: string
  maxCount?: number
  value?: any[]
  multiple?: boolean
  title: string
  onChange?: (info:{target: {type: any, name: any, value: UploadFile<any>[], id: any}}) => void
  beforeUpload?: (info:{target: {type: any, name: any, value: RcFile, id: any}}) => boolean
}

