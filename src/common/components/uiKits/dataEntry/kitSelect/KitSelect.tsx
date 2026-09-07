import {Button, Select} from 'antd'
import {KitSelectType} from './KitSelectType.ts'
import {ChangeEvent, PropsWithChildren, useEffect, useLayoutEffect, useState} from 'react'
import {Divider} from '@mui/material'
import axios from 'axios'
import axiosInstance from '../../../../util/axiosConfig.ts'


const KitSelect = (props: PropsWithChildren<KitSelectType>) => {

  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   if (props.onChange) {
  //     props.onChange(props.value as any)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!loading) {
  //     if (props.value != null) {
  //       if (props.mode != undefined) {
  //         if (Array.isArray(props.value) && [...props.value].length) {
  //           setValue(props.value.map(value => String(value) as any))
  //         } else {
  //         }
  //       } else {
  //         setValue(String(props.value))
  //       }
  //     } else {
  //       if (props.isDefaultOption) {
  //         setValue('0')
  //       } else {
  //       }
  //     }
  //
  //   }
  // }, [props.value])

  const getOptionsWithKeys = (options: any[]) => {
    let optionLabel = 'label'
    let optionValue = 'value'
    if (props.optionLabel) {
      optionLabel = props.optionLabel
    }
    if (props.optionValue) {
      optionValue = props.optionValue
    }
    let result = []
    if (props.isGroup) {
      result = getGroupOptions(props.options ?? [], optionLabel, optionValue)
    } else {
      result = options.map(option => {
        if (props.noOption) {
          return {label: option, value: String(option)}
        }
        return {label: option[optionLabel], value: String(option[optionValue])}
      })

      if (props.isDefaultOption) {
        result = [{label: '-', value: '0'}, ...result]
      }
    }
    return result
  }

  const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
      const group = getKey(currentItem)
      if (!previous[group]) previous[group] = []
      previous[group].push(currentItem)
      return previous
    }, {} as Record<K, T[]>)


  const getGroupOptions = (options: any[], optionLabel: String, optionValue: String) => {
    const groupOptions = groupBy(options, (i: any) => i[props.groupLabel])
    return Object.entries(groupOptions).map(([key, value]) => {
      return {
        label: <span>{key}</span>,
        title: key,
        value: [...value].map(item => item[optionLabel as any]).join(','),
        options:
          value.map((sub) => {
            return {label: <span>{sub[optionLabel as any]}</span>, value: String(sub[optionValue as any])}
          }),
      }
    })
  }

  useEffect(() => {
    const getEndpointData = async () => {
      try {
        const response = await axiosInstance.get(props.endpoint!)
        if (response.status === 200) {
          let result = response.data
          result = Object.entries(result).map(([key, value]) => {
            return result[key]
          })
          setOptions(getOptionsWithKeys(result))
          setLoading(false)
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        // Handle error if needed
      }
    }

    if (props.endpoint) {
      getEndpointData()
    } else {
      setOptions(getOptionsWithKeys(props.options ?? []))
      setLoading(false)
    }

  }, [props.options, props.endpoint])

  const handleChange = (event: any, child?: any) => {
    if (props.onChange) {
      if (Array.isArray(event)) {
        props.onChange(event.length > 0 ? event as any : [], child)
      } else {
        props.onChange(event)
      }
    }
  }

  const handleSelectAllClick = () => {
    if (props.isGroup) {
      handleChange(props.options.map((option) => option[props.optionValue ?? 'value']))
    } else {
      handleChange(props.options.map((option) => option[props.optionValue ?? 'value']))

    }
  }

  return <div className={'flex flex-col w-full'}>
    <Select id={props.name} title={props.placeholder} defaultValue={null}
            value={!loading ? (props.value != null && props.value != 'undefined') ? props.mode != undefined ? Array.isArray(props.value) ? [...props.value].length > 0 ? props.value.map(value => String(value) as any) : props.isDefaultOption ? '0' : null : (props.isDefaultOption ? '0' : null) : (String(props.value) as any) : null : (props.isDefaultOption ? null : null)}
            size={props.size}
            placeholder={props.placeholder} status={props.status} options={options}
            style={props.style}
            rootClassName={props.classname}
            disabled={props.disabled}
            mode={props.mode}
            maxTagCount={'responsive'}
            showSearch={true}
            onSearch={props.onSearch}
            filterOption={(input, option) => {
              if (props.isGroup) {
                return (((option[props.optionLabel ?? 'label']) ?? '') as String).toLowerCase().includes(input)
              }
              return ((option?.label ?? '') as String).toLowerCase().includes(input.toLowerCase())
            }
            }
      // filterOption={props.filterOption}
            allowClear={props.allowClear}
            onChange={handleChange}
            onBlur={props.onBlur}
            onSelect={props.onSelect}
            onInputKeyDown={props.onInputKeyDown}
            optionFilterProp="children"
            dropdownRender={(menu) => (
              <>
                {(props.mode && props.options) && <>
                  <Divider />
                  <div className={'w-full'}>
                    <Button
                      type="text"
                      className="w-full text-right rounded flex justify-start"
                      onClick={handleSelectAllClick}
                    >
                      <span className={'text-right'}>انتخاب همه</span>
                    </Button>
                  </div>
                </>}
                {menu}
              </>
            )}
    />
    {props.children}
  </div>
}

export default KitSelect
