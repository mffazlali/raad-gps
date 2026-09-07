import styles from './AddAttribute.module.css'
import cls from 'classnames'
import {useCatch} from '../../../../common/util/reactHelper'
import {FormikHelpers} from 'formik'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import React, {useState} from 'react'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'

const types = [
  {label: 'رشته', value: 'string'},
  {label: 'عدد', value: 'number'},
  {label: 'True/False', value: 'boolean'},
]
const AddAttribute = ({open, onResult, definitions}: {open: any, onResult: any, definitions: any}) => {
  const {contextHolder, showMessage} = useMessage()
  const t = useTranslation()
  const options = Object.entries(definitions).map(([key, value]) => ({
    key,
    name: Object(value).name,
    type: Object(value).type,
  }))
  const [key, setKey] = useState<any>()
  const [type, setType] = useState<any>('string')
  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
  })

  const {form} = useForm({
    formGroup: {
      'userLimit': {value: '', validations: []},
      'disabled': {value: false, validations: []},
    },
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    // const tmpValues = {
    //   ...values,
    //   expirationTime: values.expirationTime || '2099-01-01',
    //   coordinateFormat: values.coordinateFormat || 'dd',
    //   map: values.map || 'osm',
    //   latitude: values.latitude || 0,
    //   longitude: values.longitude || 0,
    //   zoom: values.zoom || 0,
    //   deviceLimit: values.deviceLimit || 0,
    //   userLimit: values.userLimit || 0,
    //   speedUnit: values?.attributes?.speedUnit || 'kn',
    //   distanceUnit: values?.attributes?.distanceUnit || 'km',
    //   altitudeUnit: values?.attributes?.altitudeUnit || 'm',
    //   volumeUnit: values?.attributes?.volumeUnit || 'ltr',
    //   poiLayer: values?.attributes?.poiLayer,
    //   timezone: values?.attributes?.timezone,
    // }
    // form.setValues(tmpValues)
    // form.setFieldValue('name', values!['name'])
  }
  return <>
    {contextHolder}
    <Card title={'افزودن ویژگی'} contentClassName={styles.inputs}>
      <div className={styles.input}>
        <KitInputWrapper label="ویژگی" required={false} name="attribute" direction={'col'}>
          <KitSelect placeholder="ویژگی" name="attribute"
                     optionLabel={'name'}
                     optionValue={'key'}
                     isDefaultOption={false}
                     options={options}
                     allowClear={true}
                     showSearch={true}
                     onChange={(e) => {
                       const finded = options.filter(option => option.key == e as any)
                       if (finded.length > 0) {
                         setType(finded[0].type)
                       }
                       setKey(e)
                     }}
                     value={key}
                     disabled={false} />
        </KitInputWrapper>
        {/*<KitInputError label={form.errors.map} />*/}
      </div>
      {/*<div className={styles.input}>*/}
      {/*  <KitInputWrapper label="نوع خط" required={false} name="type" direction={'col'}>*/}
      {/*    <KitSelect placeholder="نوع خط" name="type"*/}
      {/*               optionLabel={'label'}*/}
      {/*               optionValue={'value'}*/}
      {/*               isDefaultOption={false}*/}
      {/*               options={types}*/}
      {/*               allowClear={true}*/}
      {/*               showSearch={true}*/}
      {/*               onChange={(e) => setType(e)}*/}
      {/*               value={type}*/}
      {/*               disabled={true} />*/}
      {/*  </KitInputWrapper>*/}
      {/*</div>*/}
      <div className={styles.input}>
        {/*<Button*/}
        {/*  type="button"*/}
        {/*  title={'انصراف'}*/}
        {/*  onClick={() => onResult(null)}*/}
        {/*  className={cls(styles.button, styles.cancelButton, 'btn-primary-outline')}*/}
        {/*  titleClassName={cls(styles.label, styles.cancelLabel)} />*/}
        <Button
          type="button"
          title={''}
          onClick={() => onResult({key, type})}
          disabled={!key}
          className={cls(
            styles.addButton,
            'fa fa-add',
            'btn-primary',
          )}
          loading={false} />
      </div>
    </Card>
  </>
}

export default AddAttribute
