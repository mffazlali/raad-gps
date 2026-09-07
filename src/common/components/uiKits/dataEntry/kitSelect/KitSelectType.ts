import {DefaultOptionType} from 'antd/es/select/index'
import {addon, InputType} from '../InputType.ts'
import React, {ChangeEvent, FocusEventHandler, KeyboardEventHandler} from 'react'
import {SelectHandler} from 'rc-select/lib/Select'

export type KitSelectType = InputType<HTMLElement, string> & addon & {
  mode?: 'multiple' | 'tags' | undefined
  allowClear?: boolean
  showSearch?: boolean
  isDefaultOption?: boolean
  options?: any[]
  isGroup?: boolean
  defaultValue?: ChangeEvent<HTMLElement>
  value?: React.ChangeEvent<HTMLElement> | null | undefined
  endpoint?: string
  optionLabel?: string
  optionValue?: string
  groupLabel?: string
  noOption?: boolean
  onSearch?: ((value: string) => void) | undefined
  filterOption?: (inputValue: string, option?: DefaultOptionType) => boolean
  onBlur?: (event: FocusEventHandler<HTMLElement>) => void
  onSelect?: SelectHandler<React.ChangeEvent<HTMLElement>, DefaultOptionType> | undefined
  onClear?: () => void
  onInputKeyDown?: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

