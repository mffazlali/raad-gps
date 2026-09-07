import {ColorPicker} from 'antd'
import {KitInputTextType} from '../kitInputText/KitInputTextType.ts'


const KitInputColorPicker = (props: KitInputTextType) => {
  return <ColorPicker value={props.value} size={props.size}
                      style={props.style}
                      rootClassName={props.classname}
                      disabled={props.disabled}
                      onChange={(e,value) => {
                        let result: any = {
                          target: {
                            type: '',
                            name: props.name,
                            value: value,
                            id: props.name,
                          },
                        }
                        if (props.onChange)
                          props.onChange(result)
                      }} />
}

export default KitInputColorPicker
