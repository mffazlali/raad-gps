import {Input} from 'antd'
import {KitTextAreaType} from './KitTextAreaType.ts'

const {TextArea} = Input
const KitTextArea = (props: KitTextAreaType) => {
  return <TextArea name={props.name} value={props.value} size={props.size} placeholder={props.placeholder}
                   status={props.status}
                   style={props.style}
                   rootClassName={props.classname}
                   disabled={props.disabled}
                   onChange={props.onChange}
                   onBlur={props.onBlur}
                   onInput={props.onInput}
                   rows={props.rows} maxLength={props.maxLength} minLength={props.minLength} />
}

export default KitTextArea
