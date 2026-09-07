import {Autocomplete, TextField} from '@mui/material'
import React, {useState} from 'react'
import {useEffectAsync} from '../util/reactHelper.js'
import axios from 'axios'
import axiosInstance from '../util/axiosConfig.ts'
import KitSelect from './uiKits/dataEntry/kitSelect/KitSelect.tsx'
import useMessage from '../util/useMessage.tsx'
import {useTranslation} from './LocalizationProvider'

const LinkField = ({
                     label,
                     options,
                     optionsLinked,
                     baseId,
                     keyBase,
                     keyLink,
                     keyGetter = 'id',
                     titleGetter = 'name',
                     mapItems = undefined,
                   }: {
  label: string,
  options?: any[],
  optionsLinked?: any[],
  baseId: any,
  keyBase: string,
  keyLink: string,
  keyGetter?: string,
  titleGetter?: string,
  mapItems?: (it: any) => string
}) => {
  const [active, setActive] = useState(true)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [linked, setLinked] = useState<any[]>([])
  const {contextHolder, showMessage} = useMessage()
  const t = useTranslation()

  useEffectAsync(async () => {
    if (active) {
      if (options) {
        if (mapItems) {
          const mapResult = options.map((it: any) => {
            let result = {...it}
            result[titleGetter] = mapItems(it)
            return result
          })
          setItems(mapResult)
        } else {
          setItems(options)
        }
      }
    }
  }, [active, options])

  useEffectAsync(async () => {
    if (active) {
      if (optionsLinked) {
        setLinked(optionsLinked.map((it: any) => it[keyGetter]))
      }
    }
  }, [active, optionsLinked])

  const createBody = (linkId: any) => {
    const body: any = {}
    body[keyBase] = baseId
    body[keyLink] = linkId
    return body
  }

  const onChange = async (value: any) => {
    const oldValue = linked
    const newValue = value
    if (!newValue.find((it: any) => it < 0)) {
      const results: any[] = []
      newValue
        .filter((it: any) => !oldValue.includes(it))
        .forEach((added: any) => {
          results.push(
            axiosInstance.post('/api/permissions', createBody(added)),
          )
        })
      oldValue
        .filter((it) => !newValue.includes(it))
        .forEach((removed) => {
          results.push(
            axiosInstance.delete('/api/permissions', {data: createBody(removed)}),
          )
        })
      try {
        const responses = await Promise.all(results)
        const responseError = responses.find(response => response.status !== 200)
        if (responseError) {
          // showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
        }
        setLinked(value)
      } catch (error) {
        // Handle error
      }
    }
  }

  return (
    <>
      {contextHolder}
      <KitSelect placeholder={label} name="coordinateFormat"
                 optionLabel={titleGetter}
                 optionValue={keyGetter}
                 isDefaultOption={false}
                 options={items || []}
                 allowClear={true}
                 showSearch={true}
                 onChange={(e) => onChange(e)}
                 value={linked as any}
                 disabled={false}
                 mode={'multiple'} />
    </>
  )
}

export default LinkField
