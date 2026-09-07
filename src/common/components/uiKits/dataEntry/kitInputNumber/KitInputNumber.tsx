import {InputNumber as InputNumberAnt} from 'antd'
import {KitInputNumberType} from './KitInputNumberType.ts'
import cls from 'classnames'
import {ChangeEvent} from 'react'


const KitInputNumber = (props: KitInputNumberType) => {
  return <InputNumberAnt name={props.name} value={props.value} size={props.size}
                         minLength={props.minLength}
                         maxLength={props.maxLength}
                         placeholder={props.placeholder}
                         addonBefore={props.addonBefore} addonAfter={props.addonAfter} status={props.status}
                         min={props.min} max={props.max}
                         style={{...props.style, width: '100%'}}
                         rootClassName={props.classname}
                         disabled={props.disabled}
                         onChange={(e) => {
                           let result: any = {target: {type: '', name: props.name, value: e, id: props.name}}
                           if (props.onChange)
                             props.onChange(result)
                         }}
                         onBlur={props.onBlur}
                         onInput={props.onInput} />
}

export default KitInputNumber
