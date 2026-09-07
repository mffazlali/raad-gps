import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import deviceCategories from '../../../../common/util/deviceCategories'
import {useCatch, useEffectAsync} from '../../../../common/util/reactHelper'
import {useDispatch} from 'react-redux'
import {devicesActions} from '../../../../common/clientStore'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {FormikHelpers} from 'formik'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import KitCheckbox from '../../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox.tsx'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitInputNumber from '../../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber.tsx'
import KitDatePicker from '../../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import useCommonDeviceAttributes from '../../../../common/attributes/useCommonDeviceAttributes'
import useDeviceAttributes from '../../../../common/attributes/useDeviceAttributes'
import {useAdministrator, useRestriction} from '../../../../common/util/permissions'
import KitImageUploader from '../../../../common/components/uiKits/dataEntry/kitImageUploader/KitImageUploader.tsx'
import SelectField from '../../../../common/components/SelectField.tsx'
import BaseCommandView from '../../../components/baseCommandView/BaseCommandView.tsx'
import axios from 'axios'
import axiosInstance from '../../../../common/util/axiosConfig.ts'

const CommandDevice = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(false)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const [item, setItem] = useState({})
  const limitCommands = useRestriction('limitCommands')

  const handleSend = useCatch(async (values: any) => {
    setDisableForm(true)
    let command
    try {
      if (values.savedId) {
        const response = await axiosInstance.get(`/api/commands/${values.savedId}`)
        if (response.status === 200) {
          command = response.data
        } else {
          showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
          throw Error(response.data)
        }
      } else {
        command = item
      }
    } catch (e) {
      setDisableForm(false)
      showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
    if (id)
      command.deviceId = parseInt(id, 10)
    try {
      const response = await axiosInstance.post('/api/commands/send', command)
      if (response.status === 200) {
        navigate(-1)
        setDisableForm(false)
      } else {
        showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
        setDisableForm(false)
        throw Error(response.data)
      }
    } catch (e) {
      setDisableForm(false)
      showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  const {form} = useForm({
    formGroup: {
      'savedId': {
        value: '',
        validations: [{required: 'وارد کردن نام الزامی است'}],
      },
    },
    handleSubmit: handleSend,
  })

  const setForm = (values: any) => {
    form.setValues(values)
    // form.setFieldValue('name', values!['name'])
    // form.setFieldValue('uniqueId', values!['uniqueId'])
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
                <KitInputWrapper label="دستور ذخیره شده" required={false} name="savedId" direction={'col'}>
                  <SelectField
                    value={form.values.savedId}
                    emptyValue={limitCommands ? null : 0}
                    emptyTitle={t('sharedNew')}
                    onChange={(e: any) => form.setFieldValue('savedId', e)}
                    endpoint={`/api/commands/send?deviceId=${id}`}
                    titleGetter={'description'}
                    label={'دستور ذخیره شده'}
                    status={form.errors.groupId ? 'error' : ''}
                  />
                </KitInputWrapper>
                <KitInputError label={form.errors.savedId} />
              </div>
              {!limitCommands && !form.values.savedId && (
                <BaseCommandView deviceId={id} item={item} setItem={setItem} />
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
                disabled={!form.isValid || disableForm || loadingForm || (form.values && form.values.type)}
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

export default CommandDevice
