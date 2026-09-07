import {Input} from 'antd'
import {KitInputTextType} from './KitInputTextType.ts'

const KitInputText = (props: KitInputTextType) => {
  return <Input id={props.name} name={props.name} value={props.value} size={props.size}
                placeholder={props.placeholder}
                style={props.style}
                rootClassName={props.classname}
                disabled={props.disabled}
                minLength={props.minLength}
                maxLength={props.maxLength}
                addonBefore={props.addonBefore} addonAfter={props.addonAfter} status={props.status}
                onChange={props.onChange}
                onBlur={props.onBlur}
                onInput={props.onInput} />
}

export default KitInputText
