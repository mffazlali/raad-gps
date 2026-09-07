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
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useIdentifier, useCreateIdentifier, useUpdateIdentifier} from '../../../../common/serverStore/useIdentifier.ts'

const IdentifierRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()

  const { data: identifier, isLoading: isLoadingIdentifier } = useIdentifier(id ? parseInt(id) : undefined)
  const createIdentifier = useCreateIdentifier()
  const updateIdentifier = useUpdateIdentifier()

  useEffect(() => {
    if (identifier) {
      setForm(identifier)
      setLoadingForm(false)
    }
  }, [identifier, id])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)
    try {
      if (id) {
        await updateIdentifier.mutateAsync({ id: parseInt(id), identifier: values })
      } else {
        await createIdentifier.mutateAsync(values)
      }
      setDisableForm(false)
      setOpen(false)
    } catch (e) {
      setDisableForm(false)
      showMessage({message: e?.response?.data?.message ?? t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  const {form} = useForm({
    formGroup: {
      'company': {
        value: '',
        validations: [{required:'وارد کردن نام الزامی است'}],
      },
      'uniqueId': {
        value: '',
        validations: [{required: 'وارد کردن شناسه دستگاه الزامی است'}],
      },
    },
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    form.setValues(values)
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
                <KitInputWrapper label="نام" required={true} name="company" direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="نام" name="company"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.company} status={form.errors.company ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.company} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="شناسه دستگاه" required={true} name="uniqueId" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputText placeholder="شناسه دستگاه" name="uniqueId"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.uniqueId} status={form.errors.uniqueId ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.uniqueId} />
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

export default IdentifierRegister
