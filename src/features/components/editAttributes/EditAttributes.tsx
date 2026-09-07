import styles from './EditAttributes.module.css'
import cls from 'classnames'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputText from '../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import Card from '../../../common/components/custom/dataDisplay/card/Card.tsx'
import React, {useState} from 'react'
import KitInputNumber from '../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import useFeatures from '../../../common/util/useFeatures'
import {useAttributePreference} from '../../../common/util/preferences'
import {
  distanceFromMeters,
  distanceToMeters,
  distanceUnitString, speedFromKnots,
  speedToKnots,
  speedUnitString, volumeFromLiters,
  volumeToLiters, volumeUnitString,
} from '../../../common/util/converter'
import KitCheckbox from '../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox.tsx'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import AddAttribute from './addAttributes/AddAttribute.tsx'


const EditAttributes = ({attributes, setAttributes, definitions, loading = false, disabled = false}: {
  attributes: any,
  setAttributes: any,
  definitions: any,
  loading: boolean,
  disabled?: boolean
}) => {
  const t = useTranslation()
  const features = useFeatures()
  const speedUnit = useAttributePreference('speedUnit')
  const distanceUnit = useAttributePreference('distanceUnit')
  const volumeUnit = useAttributePreference('volumeUnit')
  const [addDialogShown, setAddDialogShown] = useState(false)

  const updateAttribute = (key: any, value: any, type: any = '', subtype: any = '') => {
    const updatedAttributes = {...attributes}
    switch (subtype) {
      case 'speed':
        updatedAttributes[key] = speedToKnots(Number(value), speedUnit)
        break
      case 'distance':
        updatedAttributes[key] = distanceToMeters(Number(value), distanceUnit)
        break
      case 'volume':
        updatedAttributes[key] = volumeToLiters(Number(value), volumeUnit)
        break
      default:
        updatedAttributes[key] = type === 'number' ? Number(value) : value
        break
    }

    setAttributes(updatedAttributes)
  }

  const deleteAttribute = (key: any) => {
    const updatedAttributes = {...attributes}
    delete updatedAttributes[key]
    setAttributes(updatedAttributes)
  }

  const getAttributeName = (key: any, subtype: any) => {
    const definition = definitions[key]
    const name = definition ? definition.name : key
    switch (subtype) {
      case 'speed':
        return `${name} (${speedUnitString(speedUnit, t)})`
      case 'distance':
        return `${name} (${distanceUnitString(distanceUnit, t)})`
      case 'volume':
        return `${name} (${volumeUnitString(volumeUnit, t)})`
      default:
        return name
    }
  }

  const getAttributeType = (value: any) => {
    if (typeof value === 'number') {
      return 'number'
    }
    if (typeof value === 'boolean') {
      return 'boolean'
    }
    return 'string'
  }

  const getAttributeSubtype = (key: any) => {
    const definition = definitions[key]
    return definition && definition.subtype
  }

  const getDisplayValue = (value: any, subtype: any) => {
    if (value) {
      switch (subtype) {
        case 'speed':
          return speedFromKnots(value, speedUnit)
        case 'distance':
          return distanceFromMeters(value, distanceUnit)
        case 'volume':
          return volumeFromLiters(value, volumeUnit)
        default:
          return value
      }
    }
    return ''
  }

  const convertToList = (attributes: any) => {
    const booleanList: any[] = []
    const otherList: any[] = []
    const excludeAttributes = ['speedUnit', 'distanceUnit', 'volumeUnit', 'timezone', 'altitudeUnit', 'poiLayer', 'deviceImage', 'positionItems', 'activeMapStyles', 'mapLiveRoutes', 'mapDirection', 'devicePrimary', 'soundEvents', 'soundAlarms', 'deviceSecondary', 'mapGeofences', 'mapCluster', 'mapOnSelect']
    Object.keys(attributes || []).filter((key) => !excludeAttributes.includes(key)).forEach((key) => {
      const value = attributes[key]
      const type = getAttributeType(value)
      const subtype = getAttributeSubtype(key)
      if (type === 'boolean') {
        booleanList.push({
          key, value, type, subtype,
        })
      } else {
        otherList.push({
          key, value, type, subtype,
        })
      }
    })
    return [...otherList, ...booleanList]
  }

  const handleAddResult = (definition: any) => {
    setAddDialogShown(false)
    if (definition) {
      switch (definition.type) {
        case 'number':
          updateAttribute(definition.key, 0)
          break
        case 'boolean':
          updateAttribute(definition.key, false)
          break
        default:
          updateAttribute(definition.key, '')
          break
      }
    }
  }

  return <>{convertToList(attributes).length > 0 &&
    <Card title={'ویژگی ها'} contentClassName={styles.inputs}>
      {convertToList(attributes).map(({
                                        key, value, type, subtype,
                                      }) => {
        if (type === 'boolean') {
          return (
            <div key={key} className={styles.inputWrapper}>
              <div className={styles.input}>
                <KitCheckbox name="fixedEmail"
                             label={getAttributeName(key, subtype)}
                             onChange={(e) => updateAttribute(key, e.target.checked)}
                             value={value} disabled={disabled} />
                {/*<KitInputError label={form.errors.fixedEmail} />*/}
              </div>
              {!disabled && <div className={styles.input}>
                <Button
                  type="button"
                  onClick={() => {
                    deleteAttribute(key)
                  }}
                  title={''}
                  className={cls(
                    styles.inputDeleteButton,
                    'fa fa-trash',
                    'btn-danger',
                  )}
                  titleClassName={cls(styles.label)}
                  loading={false} />
              </div>}
            </div>
          )
        }
        return (
          <div key={key} className={styles.inputWrapper}>
            <div className={styles.input}>
              <KitInputWrapper label={getAttributeName(key, subtype)} required={false} name="name"
                               direction={'col'} loading={false}>
                {type !== 'number' && <KitInputText placeholder={getAttributeName(key, subtype)} name="name"
                                                    onChange={(e) => updateAttribute(key, e.target.value, type, subtype)}
                                                    value={getDisplayValue(value, subtype)}
                                                    classname={'w-full'}
                                                    disabled={disabled} maxLength={50} />}
                {type === 'number' &&
                  <KitInputNumber placeholder={getAttributeName(key, subtype)} name="userLimit"
                                  onChange={(e) => updateAttribute(key, Object(e).target.value, type, subtype)}
                                  value={getDisplayValue(value, subtype)}
                                  classname={'w-full'}
                                  disabled={disabled} />}
              </KitInputWrapper>
              {/*<KitInputError label={form.errors.name} />*/}
            </div>
            {!disabled && <div className={styles.input}>
              <Button
                type="button"
                onClick={() => {
                  deleteAttribute(key)
                }}
                title={''}
                className={cls(
                  styles.inputDeleteButton,
                  'fa fa-trash',
                  'btn-danger',
                )}
                titleClassName={cls(styles.label)}
                loading={false} />
            </div>}
          </div>
        )
      })}
    </Card>
  }

    {!disabled && <AddAttribute open={addDialogShown}
                                onResult={handleAddResult}
                                definitions={definitions}
    />}
  </>
}

export default EditAttributes
