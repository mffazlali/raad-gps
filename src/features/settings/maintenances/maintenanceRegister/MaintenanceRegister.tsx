import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import {useCatch} from '../../../../common/util/reactHelper'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useEffect, useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {FormikHelpers} from 'formik'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import usePositionAttributes from '../../../../common/attributes/usePositionAttributes'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitTextArea from '../../../../common/components/uiKits/dataEntry/kitTextArea/KitTextArea.tsx'
import SelectField from '../../../../common/components/SelectField.tsx'
import {useAttributePreference} from '../../../../common/util/preferences'
import {prefixString} from '../../../../common/util/stringUtils'
import {distanceFromMeters, distanceToMeters, speedFromKnots, speedToKnots} from '../../../../common/util/converter'
import KitInputNumber from '../../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber.tsx'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useMaintenance, useCreateMaintenance, useUpdateMaintenance} from '../../../../common/serverStore/useMaintenance.ts'

const MaintenanceRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const t = useTranslation()
  const [labels, setLabels] = useState<{start: string | null, period: string | null}>({start: '', period: ''})
  const positionAttributes: any = usePositionAttributes(t)
  const speedUnit = 'km'
  const distanceUnit = useAttributePreference('distanceUnit', 'km')

  const { data: maintenance, isLoading: isLoadingMaintenance } = useMaintenance(id ? parseInt(id) : undefined)
  const createMaintenance = useCreateMaintenance()
  const updateMaintenance = useUpdateMaintenance()

  useEffect(() => {
    if (maintenance) {
      setForm(maintenance)
      setLoadingForm(false)
      onMaintenanceTypeChange(maintenance['type'] as any)
    }
  }, [maintenance])

  const convertToList = (attributes: any) => {
    const otherList: any[] = []
    Object.keys(attributes).forEach((key) => {
      const value = attributes[key]
      if (value.type === 'number') {
        otherList.push({key, name: value.name, type: value.type})
      }
    })
    return otherList
  }

  const onMaintenanceTypeChange = (event: any) => {
    form.setFieldValue('type', event)

    const attribute = positionAttributes[event]
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'distance':
          setLabels({
            ...labels,
            start: t(prefixString('shared', distanceUnit)),
            period: t(prefixString('shared', distanceUnit)),
          })
          break
        case 'speed':
          setLabels({
            ...labels,
            start: t(prefixString('shared', speedUnit)),
            period: t(prefixString('shared', speedUnit)),
          })
          break
        default:
          setLabels({...labels, start: null, period: null})
          break
      }
    } else {
      setLabels({...labels, start: null, period: null})
    }
  }

  const rawToValue = (value: any, values: any) => {
    const attribute = positionAttributes[values.type]
    if (attribute && attribute?.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedFromKnots(value, speedUnit)
        case 'distance':
          return distanceFromMeters(value, distanceUnit)
        default:
          return value
      }
    }
    return value
  }

  const valueToRaw = (value: any, values: any) => {
    const attribute = positionAttributes[values.type]
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedToKnots(value, speedUnit)
        case 'distance':
          return distanceToMeters(value, distanceUnit)
        default:
          return value
      }
    }
    return value
  }

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      setDisableForm(true)
      if (id) {
        await updateMaintenance.mutateAsync({ id: parseInt(id), maintenance: values })
      } else {
        await createMaintenance.mutateAsync(values)
      }
      setDisableForm(false)
      setOpen(false)
    } catch (e) {
      setDisableForm(false)
      showMessage({message: e?.response?.data?.message || t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  const {form} = useForm({
    formGroup: {
      'name': {
        value: '',
        validations: [{required: 'وارد کردن نام الزامی است'}],
      },
      'type': {
        value: '',
        validations: [{required: 'وارد کردن نوع خط الزامی است'}],
      },
      'start': {
        value: '',
        validations: [],
      },
      'period': {
        value: '',
        validations: [{required: 'وارد کردن بازه الزامی است'}],
      },
    },
    scrollId:'inputsWrapper',
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
      start: rawToValue(values?.start, values) || 0,
      period: rawToValue(values?.period, values) || 0,
    }
    form.setValues(tmpValues)
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  return (
    <div className={styles.settingsRegister}>
      <div className={styles.settingsRegisterContainer}>
        {contextHolder}
        <form
          onSubmit={(e) => form.handleSubmit(e)}
          onChange={(e) => form.handleChange(e)}
          className={styles.form}
        >
          <div id={'inputsWrapper'} className={cls(styles.inputsWrapper)}>
            <Card title={'ضروری'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="نام" required={true} name="name" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputText placeholder="نام" name="name"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.name} status={form.errors.name ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.name} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="نوع خط" required={true} name="type" direction={'col'} loading={loadingForm}>
                  <KitSelect placeholder="نوع خط" name="type"
                             optionLabel={'name'}
                             optionValue={'key'}
                             isDefaultOption={false}
                             options={convertToList(positionAttributes)}
                             allowClear={true}
                             showSearch={true}
                             onChange={(e) => {
                               onMaintenanceTypeChange(e)
                             }}
                             onBlur={(e) => form.handleBlur(e)}
                             onSelect={(e) => {
                               form.handleChange(e)
                             }}
                             value={form.values.type} status={form.errors.type ? 'error' : ''}
                             disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.type} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label={labels.start ? ` شروع (${labels.start})` : 'شروع'}
                                 required={true} name="start" direction={'col'} loading={loadingForm}>
                  <KitInputNumber
                    placeholder={labels.start ? ` شروع (${labels.start})` : 'شروع'}
                    name="start"
                    onChange={(e) => form.setFieldValue('start', valueToRaw(Object(e).target.value, form.values))
                    }
                    onBlur={(e) => form.handleBlur(e)}
                    value={form.values.start} status={form.errors.start ? 'error' : ''}
                    disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.start} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label={labels.period ? ` بازه (${labels.period})` : 'بازه'}
                                 required={true} name="period" direction={'col'} loading={loadingForm}>
                  <KitInputNumber
                    placeholder={labels.period ? ` بازه (${labels.period})` : 'بازه'}
                    name="period"
                    onChange={(e) => form.setFieldValue('period', valueToRaw(Object(e).target.value, form.values))
                    }
                    onBlur={(e) => form.handleBlur(e)}
                    value={form.values.period} status={form.errors.period ? 'error' : ''}
                    disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.period} />
              </div>
            </Card>
          </div>
          <ActionsButton
            onCancel={handleCancelClick}
            isSubmitDisabled={!form.isValid || disableForm || loadingForm}
            isLoading={disableForm}
            cancelText="لغو"
            submitText="ثبت"
          />
        </form>
      </div>
    </div>
  )
}

export default MaintenanceRegister
