import {addon, InputType} from '../InputType.ts'

export type KitInputTextType = InputType<HTMLInputElement,string> & addon & {
  minLength?:number
  maxLength?:number
}

