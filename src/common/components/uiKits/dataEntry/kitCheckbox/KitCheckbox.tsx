import {Checkbox} from 'antd'
import {KitCheckboxType} from './KitCheckboxType.ts'
import {useEffect, useState} from 'react'

const KitCheckbox = (props: KitCheckboxType) => {
  const [checkValue, setCheckValue] = useState<boolean>(false)

  useEffect(() => {
    if (props.value != null)
      setCheckValue(props.value)
  }, [props.value])

  return <Checkbox id={props.name} name={props.name}
                   style={props.style}
                   value={checkValue}
                   checked={checkValue}
                   rootClassName={props.classname}
                   disabled={props.disabled}
                   onChange={props.onChange}
  >{props.label}</Checkbox>
}

export default KitCheckbox
