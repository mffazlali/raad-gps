import {CheckboxChangeEvent} from 'antd/es/checkbox'
import {InputBaseType} from '../InputBaseType.ts'

export type KitCheckboxType = InputBaseType & {
  label?: string
  value: boolean
  onChange?: (event: CheckboxChangeEvent) => void
}

