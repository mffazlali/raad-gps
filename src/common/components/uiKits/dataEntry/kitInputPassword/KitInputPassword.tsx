import {Input} from 'antd'
import {KitInputTextType} from '../kitInputText/KitInputTextType.ts'
import cls from 'classnames'


const KitInputPassword = (props: KitInputTextType) => {
  return <Input.Password name={props.name} value={props.value} size={props.size}
                         placeholder={props.placeholder}
                         addonBefore={props.addonBefore} addonAfter={props.addonAfter} status={props.status}
                         style={{direction:'ltr',...props.style}}
                         rootClassName={cls('text-right',props.classname)}
                         disabled={props.disabled}
                         maxLength={props.maxLength}
                         minLength={props.minLength}
                         onChange={props.onChange}
                         onBlur={props.onBlur}
                         onInput={props.onInput} />
}

export default KitInputPassword
