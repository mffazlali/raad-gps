import {ChangeEvent, Ref} from 'react'
import {InputBaseType} from './InputBaseType.ts'

type InputSize = 'small' | 'large'
type InputStatus = 'error' | 'warning' | ''

export type addon = {
  addonBefore?: string
  addonAfter?: string
}

export type InputType<T, V> = InputBaseType & {
  value?: V
  placeholder?: string
  size?: InputSize
  onChange?: (event: ChangeEvent<T>, child?: any) => void
  onChangeInValid?: (event: ChangeEvent<T>, child?: any) => void
  onInput?: (event: ChangeEvent<T>) => void
  onBlur?: (event: any) => void
}

