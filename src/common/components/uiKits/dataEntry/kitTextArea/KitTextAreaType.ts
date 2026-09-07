import {InputType} from '../InputType.ts'

export type KitTextAreaType = InputType<HTMLTextAreaElement,string> & {
  rows?: number
  minLength?: number
  maxLength?: number
}

