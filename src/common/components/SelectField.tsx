import {FormControl, InputLabel, MenuItem, Select} from '@mui/material'
import React, {useState} from 'react'
import {useEffectAsync} from '../util/reactHelper.js'
import useMessage from '../util/useMessage.tsx'
import KitSelect from './uiKits/dataEntry/kitSelect/KitSelect.tsx'
import axios from 'axios'
import axiosInstance from '../util/axiosConfig.ts'

const SelectField = ({
                       label,
                       fullWidth,
                       multiple,
                       value,
                       emptyValue = 0,
                       emptyTitle = '\u00a0',
                       onChange,
                       onSelect,
                       endpoint,
                       options,
                       data,
                       keyGetter = 'id',
                       titleGetter = 'name',
                       status,
                       mapItems = undefined,
                       disabled = false,
                     }: {
  label: string,
  fullWidth?: any,
  multiple?: boolean,
  value: any,
  emptyValue?: number | null,
  emptyTitle?: string,
  onChange: any,
  onSelect?: any,
  endpoint?: string,
  options?: any[],
  data?: any,
  keyGetter?: string,
  titleGetter?: string
  status?: any
  mapItems?: (it: any) => string
  disabled?: boolean
}) => {
  const {contextHolder, showMessage} = useMessage()
  const [items, setItems] = useState<any[]>(data)

  useEffectAsync(async () => {
    if (endpoint) {
      try {
        const response = await axiosInstance.get(endpoint)
        if (response.status === 200) {
          const res = response.data
          if (mapItems) {
            const tmpMap = res.map((it: any) => {
              let result = {...it}
              result[titleGetter] = mapItems(it)
              return result
            })
            setItems(tmpMap)
          } else {
            setItems(res)
          }
        }
      } catch (error) {
        throw Error(error.response?.data || error.message)
      }
    } else {
      if(options){
        setItems(options)
      }else{
        setItems(data)
      }
    }
  }, [options,data])

  return (
    <>
      {contextHolder}
      <KitSelect placeholder={label} name="selectField"
                 optionLabel={titleGetter}
                 optionValue={keyGetter}
                 isDefaultOption={!multiple && emptyValue !== null ? true : false}
                 options={items}
                 allowClear={true}
                 showSearch={true}
                 onChange={(e) => onChange(e)}
                 onSelect={(e) => {
                   if (onSelect)
                     onSelect(e)
                 }}
                 value={value} status={status}
                 mode={multiple ? 'multiple' : undefined}
                 disabled={disabled} />
    </>
  )
}

export default SelectField
