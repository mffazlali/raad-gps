import styles from './BaseCommandView.module.css'
import cls from 'classnames'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import useCommandAttributes from '../../../common/attributes/useCommandAttributes'
import SelectField from '../../../common/components/SelectField.tsx'
import {prefixString} from '../../../common/util/stringUtils'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitCheckbox from '../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox.tsx'
import KitInputText from '../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitInputNumber from '../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber.tsx'
import KitInputError from '../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'

const BaseCommandView = ({deviceId, item, setItem, errors}: {
  deviceId?: any,
  item: any,
  setItem: any,
  errors?: any,
}) => {
  const t = useTranslation()
  const textEnabled = useSelector((state: any) => state?.session?.server?.textEnabled)
  const availableAttributes: any = useCommandAttributes(t)
  const [attributes, setAttributes] = useState([])

  useEffect(() => {
    if (item && item.type) {
      setAttributes(availableAttributes[item.type] || [])
    } else {
      setAttributes([])
    }
  }, [availableAttributes, item])
  const formatCommandTitle = (t: any, command: any) => {
    return t(prefixString('command', command.type))
  }


  return (
    <>
      <div className={styles.input}>
        <KitInputWrapper label="نوع خط" required={true} name="type" direction={'col'}>
          <SelectField
            value={item.type || ''}
            onChange={(e: any) => setItem({...item, type: e, attributes: {}})}
            endpoint={deviceId ? `/api/commands/types?${new URLSearchParams({deviceId}).toString()}` : '/api/commands/types'}
            keyGetter={'type'}
            mapItems={(it) => formatCommandTitle(t, it)}
            label={'نوع خط'}
            status={errors?.type ? 'error' : ''}
          />
        </KitInputWrapper>
        <KitInputError label={errors?.type} />
      </div>
      {attributes.map(({key, name, type}) => {
        if (type === 'boolean') {
          return (
            <div className={styles.input} key={key}>
              <KitCheckbox name="fixedEmail"
                           label={name}
                           value={item.attributes[key]}
                           onChange={(e) => {
                             const updateItem = {...item, attributes: {...item.attributes}}
                             updateItem.attributes[key] = e.target.checked
                             setItem(updateItem)
                           }}
                           disabled={false} />
              {/*<KitInputError label={form.errors.fixedEmail} />*/}
            </div>
          )
        }
        return (
          <div className={styles.input}>
            <KitInputWrapper label={name} required={false} name="name"
                             direction={'col'} loading={false}>
              {type !== 'number' && <KitInputText placeholder={name} name="name"
                                                  onChange={(e) => {
                                                    const updateItem = {...item, attributes: {...item.attributes}}
                                                    updateItem.attributes[key] = (Object(e).target.value)
                                                    setItem(updateItem)
                                                  }}
                                                  value={item.attributes[key]}
                                                  classname={'w-full'}
                                                  disabled={false} maxLength={50} />}
              {type === 'number' &&
                <KitInputNumber placeholder={name} name="userLimit"
                                onChange={(e) => {
                                  const updateItem = {...item, attributes: {...item.attributes}}
                                  updateItem.attributes[key] = Number(Object(e).target.value)
                                  setItem(updateItem)
                                }}
                                value={item.attributes[key]}
                                classname={'w-full'}
                                disabled={false} />}
            </KitInputWrapper>
            {/*<KitInputError label={form.errors.name} />*/}
          </div>
        )
      })}
      {textEnabled && (
        <div className={styles.input}>
          <KitCheckbox name="fixedEmail"
                       label={'ارسال پیام کوتاه'}
                       value={item.textChannel}
                       onChange={(e) => {
                         setItem({...item, textChannel: e.target.checked})
                       }}
                       disabled={false} />
          {/*<KitInputError label={form.errors.fixedEmail} />*/}
        </div>
      )}
    </>
  )
}

export default BaseCommandView
