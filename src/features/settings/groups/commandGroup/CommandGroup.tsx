import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import {useCatch} from '../../../../common/util/reactHelper'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import {useRestriction} from '../../../../common/util/permissions'
import SelectField from '../../../../common/components/SelectField.tsx'
import {useSelector} from 'react-redux'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitCheckbox from '../../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox.tsx'
import axios from 'axios'
import axiosInstance from '../../../../common/util/axiosConfig.ts'

const CommandGroup = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(false)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const limitCommands = useRestriction('limitCommands')
  const textEnabled = useSelector((state: any) => state?.session?.server?.textEnabled)

  const handleSend = useCatch(async (values: any) => {
    const tmpValues = {...values}
    tmpValues.attributes = {...tmpValues.attributes, data: tmpValues.data}
    delete tmpValues.data
    if (!textEnabled) {
      delete tmpValues.textChannel
    }
    setDisableForm(true)
    try {
      const query = new URLSearchParams({groupId: id ?? ''})
      const response = await axiosInstance.post(`/api/commands/send?${query.toString()}`, tmpValues)
      if (response.status === 200) {
        navigate(-1)
      } else {
        showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
        throw Error(response.data)
      }
      setDisableForm(false)
    } catch (e) {
      setDisableForm(false)
      showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  const {form} = useForm({
    formGroup: {
      'type': {
        value: 'custom',
        validations: [],
      },
      'attributes': {
        value: {},
        validations: [],
      },
      'data': {
        value: null,
        validations: [{required: 'وارد کردن دیتا الزامی است'}],
      },
      'textChannel': {
        value: false,
        validations: [],
      },
    },
    handleSubmit: handleSend,
  })

  const setForm = (values: any) => {
    form.setValues(values)
    // form.setFieldValue('name', values!['name'])
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
          <div className={cls(styles.inputsWrapper)}>
            <Card title={'ضروری'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="نوع خط" required={false} name="type" direction={'col'}>
                  <KitSelect placeholder={'نوع خط'} name="type"
                             optionLabel={'label'}
                             optionValue={'value'}
                             options={[{label: 'دستور سفارشی', value: 'custom'}]}
                             allowClear={true}
                             showSearch={true}
                             onChange={(e) => form.setFieldValue('type', e)}
                             onBlur={(e) => form.handleBlur(e)}
                             onSelect={(e) => {
                               form.handleChange(e)
                             }}
                             value={form.values.type} status={form.errors.type ? 'error' : ''} disabled={true} />
                </KitInputWrapper>
                <KitInputError label={form.errors.type} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="دیتا" required={true} name="data" direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="دیتا" name="data"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => {
                                  form.handleBlur(e)
                                }}
                                value={form.values?.data}
                                status={form.errors?.data ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.data} />
              </div>
              {textEnabled && (
                <div className={styles.input}>
                  <KitCheckbox name="textChannel"
                               label={'ارسال پیام کوتاه'}
                               value={form.values.textChannel}
                               onChange={(e) => form.handleChange(e)}
                               disabled={false} />
                  {/*<KitInputError label={form.errors.textChannel} />*/}
                </div>
              )}
            </Card>
          </div>
          <div className={styles.actionsWrapper}>
            <div className={styles.actions}>
              <Button
                type="button"
                title={'لغو'}
                onClick={handleCancelClick}
                className={cls(styles.button, styles.cancelButton, 'btn-primary-outline')}
                titleClassName={cls(styles.label, styles.cancelLabel)} />
              <Button
                type="button"
                title={'ارسال'}
                onClick={() => handleSend(form.values)}
                disabled={!form.isValid}
                className={cls(
                  styles.button,
                  styles.registerButton,
                  'btn-primary',
                )}
                titleClassName={cls(styles.label, styles.registerLabel)}
                loading={disableForm} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommandGroup
