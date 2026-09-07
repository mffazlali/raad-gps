import {addon, InputType} from '../InputType.ts'

export type KitInputNumberType = InputType<HTMLInputElement,string> & addon & {
  min?: string
  max?: string
  minLength?:number
  maxLength?:number
  onChange?: (value: string | null) => void;
  onInput?: (value: string | null) => void;
}

