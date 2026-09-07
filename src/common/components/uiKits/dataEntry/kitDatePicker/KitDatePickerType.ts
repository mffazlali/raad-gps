import {addon, InputType} from '../InputType.ts'
import React from 'react'
import {Locale} from 'react-date-object'
import {CustomComponentProps} from 'react-multi-date-picker'

export type KitDatePickerType = InputType<HTMLInputElement, string> & addon & {
  id?: any;
  onSelect?: (value: any) => void;
  // onChange?: (value: any | null) => void;
  shamsiDefaultValue?: boolean
  dateMode?: 'date' | 'datetime'
  picker?: 'week' | 'month' | 'quarter' | 'year'
  range?: boolean
  inputType?: 'button' | 'icon' | 'inputIcon' | 'custom'
  inputRender?: | React.ReactElement<CustomComponentProps>
    | ((
    value: string,
    openCalendar: () => void,
    handleValueChange: (e: React.ChangeEvent) => void,
    locale: Locale,
    separator: string,
  ) => React.ReactNode)
}

