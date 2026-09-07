import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import {useCatch, useEffectAsync} from '../../../../common/util/reactHelper'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {FormikHelpers} from 'formik'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import usePositionAttributes from '../../../../common/attributes/usePositionAttributes'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitTextArea from '../../../../common/components/uiKits/dataEntry/kitTextArea/KitTextArea.tsx'
import SelectField from '../../../../common/components/SelectField.tsx'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useComputedAttribute, useCreateComputedAttribute, useUpdateComputedAttribute} from '../../../../common/serverStore/useComputedAttribute.ts'
import axiosInstance from '../../../../common/util/axiosConfig.ts'

const allowedProperties = ['valid', 'latitude', 'longitude', 'altitude', 'speed', 'course', 'address', 'accuracy']

const ComputedAttributeRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const [deviceId, setDeviceId] = useState<any>()
  const [result, setResult] = useState<any>()
  const t = useTranslation()
  const positionAttributes = usePositionAttributes(t)
  const options = Object.entries(positionAttributes).filter(([key, value]: any) => !value.property || allowedProperties.includes(key)).map(([key, value]: any) => ({
    key,
    name: value.name,
    type: value.type,
  }))

  const { data: computedAttribute, isLoading: isLoadingComputedAttribute } = useComputedAttribute(id ? parseInt(id) : undefined)
  const createComputedAttribute = useCreateComputedAttribute()
  const updateComputedAttribute = useUpdateComputedAttribute()

  useEffectAsync(async () => {
    if (computedAttribute) {
      setForm(computedAttribute)
      setLoadingForm(false)
    }
  }, [computedAttribute])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      setDisableForm(true)
      if (id) {
        await updateComputedAttribute.mutateAsync({ id: parseInt(id), computedAttribute: values })
      } else {
        await createComputedAttribute.mutateAsync(values)
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
      'description': {
        value: '',
        validations: [{required: 'وارد کردن توضیحات الزامی است'}],
      },
      'type': {
        value: '',
        validations: [],
      },
      'expression': {
        value: '',
        validations: [{required: 'وارد کردن اصطلاح الزامی است'}],
      },
      'attribute': {
        value: '',
        validations: [],
      },
    },
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
      deviceId: values.deviceId || '0',
      type: (values.type != null!=undefined && values.type != null && values.type != '') ? values.type : 'string',
    }
    form.setValues(tmpValues)
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  const testAttribute = useCatch(async (values: any) => {
    try {
      const query = new URLSearchParams({deviceId})
      const url = `/api/attributes/computed/test?${query.toString()}`
      const response = await axiosInstance({
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/json'},
        data: values
      })
      if (response.status === 200) {
        const resMessage = response.data
        setResult(resMessage)
        showMessage({message: resMessage, type: 'success', duration: 2, key: 'save'})
      }
    } catch (error) {
      console.error('Error testing attribute:', error)
      showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <div className={styles.settingsRegister}>
      <div className={styles.settingsRegisterContainer}>
        {contextHolder}
        <form
          onSubmit={(e) => form.handleSubmit(e)}
          onChange={(e) => form.handleChange(e)}
          className={styles.form}
        >
          <div className={cls(styles.inputsWrapper)}>
            <Card title={'ضروری'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="توضیحات" required={true} name="description" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputText placeholder="توضیحات" name="description"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.description} status={form.errors.description ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.description} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="ویژگی ها" required={false} name="attribute" direction={'col'}>
                  <KitSelect placeholder="ویژگی ها" name="attribute"
                             optionLabel={'name'}
                             optionValue={'key'}
                             isDefaultOption={false}
                             options={options}
                             allowClear={true}
                             showSearch={true}
                             onChange={(e) => {
                               form.setFieldValue('attribute', e)
                               const optionsFilter = options.filter(option => option.key == e as any)
                               if (optionsFilter.length > 0) {
                                 form.setFieldValue('type', optionsFilter[0]?.type)
                               }
                             }}
                             onBlur={(e) => form.handleBlur(e)}
                             onSelect={(e) => {
                               form.handleChange(e)
                             }}
                             value={form.values.attribute} status={form.errors.attribute ? 'error' : ''}
                             disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.attribute} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="اصطلاح" required={true} name="expression" direction={'col'}>
                  <KitTextArea placeholder="اصطلاح" name="expression" value={form.values.expression}
                               onChange={(e) => form.handleChange(e)}
                               status={form.errors.expression ? 'error' : ''} disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.expression} />
              </div>
              {/*<div className={styles.input}>*/}
              {/*  <KitInputWrapper label="نوع خط" required={false} name="type" direction={'col'}>*/}
              {/*    <KitSelect placeholder="نوع خط" name="type"*/}
              {/*               optionLabel={'label'}*/}
              {/*               optionValue={'value'}*/}
              {/*               isDefaultOption={true}*/}
              {/*               options={[{label: 'رشته', value: 'string'}, {*/}
              {/*                 label: 'عدد',*/}
              {/*                 value: 'number',*/}
              {/*               }, {label: 'True/False', value: 'boolean'}]}*/}
              {/*               allowClear={true}*/}
              {/*               showSearch={true}*/}
              {/*               onChange={(e) => {*/}
              {/*                 form.setFieldValue('type', e)*/}
              {/*               }}*/}
              {/*               onBlur={(e) => form.handleBlur(e)}*/}
              {/*               onSelect={(e) => {*/}
              {/*                 form.handleChange(e)*/}
              {/*               }}*/}
              {/*               value={form.values.type} status={form.errors.type ? 'error' : ''}*/}
              {/*               disabled={disableForm} />*/}
              {/*  </KitInputWrapper>*/}
              {/*  <KitInputError label={form.errors.type} />*/}
              {/*</div>*/}
            </Card>
            {/*<Card title={'آزمایش'} contentClassName={styles.inputs}>*/}
            {/*  <div className={styles.input}>*/}
            {/*    <KitInputWrapper label="دستگاه" required={false} name="calendarId" direction={'col'}*/}
            {/*                     loading={loadingForm}>*/}
            {/*      <SelectField*/}
            {/*        value={deviceId}*/}
            {/*        onChange={(e: any) => setDeviceId(e)}*/}
            {/*        endpoint={`/api/devices`}*/}
            {/*        label={'دستگاه'}*/}
            {/*        // status={form.errors.deviceId ? 'error' : ''}*/}
            {/*        disabled={disableForm}*/}
            {/*      />*/}
            {/*    </KitInputWrapper>*/}
            {/*    /!*<KitInputError label={form.errors.deviceId} />*!/*/}
            {/*  </div>*/}
            {/*  <div className={styles.input}>*/}
            {/*    <Button*/}
            {/*      type="button"*/}
            {/*      onClick={() => {*/}
            {/*        testAttribute()*/}
            {/*      }}*/}
            {/*      title={'تست اصطلاح'}*/}
            {/*      className={cls(*/}
            {/*        styles.inputButton,*/}
            {/*        'btn-primary',*/}
            {/*      )}*/}
            {/*      disabled={!deviceId}*/}
            {/*      titleClassName={cls(styles.label)}*/}
            {/*      loading={false} />*/}
            {/*  </div>*/}
            {/*</Card>*/}
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

export default ComputedAttributeRegister
