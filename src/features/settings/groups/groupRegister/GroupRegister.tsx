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
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import useCommonDeviceAttributes from '../../../../common/attributes/useCommonDeviceAttributes'
import useGroupAttributes from '../../../../common/attributes/useGroupAttributes'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useGroup, useCreateGroup, useUpdateGroup} from '../../../../common/serverStore/useGroup.ts'

const GroupRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const commonDeviceAttributes = useCommonDeviceAttributes(t)
  const groupAttributes = useGroupAttributes(t)

  const { data: group, isLoading: isLoadingGroup } = useGroup(id ? parseInt(id) : undefined)
  const createGroup = useCreateGroup()
  const updateGroup = useUpdateGroup()

  useEffect(() => {
    if (group) {
      setForm(group)
      setLoadingForm(false)
    }
  }, [group])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)
    try {
      if (id) {
        await updateGroup.mutateAsync({ id: parseInt(id), group: values })
      } else {
        await createGroup.mutateAsync(values)
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
    },
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    form.setValues({...values, groupId: values.groupId || 0})
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
                <KitInputWrapper label="نام" required={true} name="name" direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="نام" name="name"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.name} status={form.errors.name ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.name} />
              </div>
            </Card>
            <Card title={'بیشتر'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="گروه" required={false} name="groupId" direction={'col'} loading={loadingForm}>
                  <KitSelect placeholder="گروه" name="groupId"
                             optionLabel={'name'}
                             optionValue={'id'}
                             isDefaultOption={true}
                             endpoint={'/api/groups'}
                             allowClear={true}
                             showSearch={true}
                             onChange={(e) => form.setFieldValue('groupId', e)}
                             onBlur={(e) => form.handleBlur(e)}
                             onSelect={(e) => {
                               form.handleChange(e)
                             }}
                             value={form.values.groupId} status={form.errors.groupId ? 'error' : ''}
                             disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.groupId} />
              </div>
            </Card>
            {/*<EditAttributes loading={loadingForm} attributes={form?.values?.attributes ?? null}*/}
            {/*                setAttributes={(attributes: any) => {*/}
            {/*                  form.setValues({...form.values, attributes})*/}
            {/*                }} definitions={{...commonDeviceAttributes, ...groupAttributes}} />*/}
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

export default GroupRegister
