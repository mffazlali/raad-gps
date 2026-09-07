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
import KitInputNumber from '../../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber.tsx'
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import BaseCommandView from '../../../components/baseCommandView/BaseCommandView.tsx'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useCommand, useCreateCommand, useUpdateCommand} from '../../../../common/serverStore/useCommand.ts'

const CommandRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const t = useTranslation()
  const [labels, setLabels] = useState<{start: string | null, period: string | null}>({start: '', period: ''})
  const positionAttributes: any = usePositionAttributes(t)

  const { data: command, isLoading: isLoadingCommand } = useCommand(id ? parseInt(id) : undefined)
  const createCommand = useCreateCommand()
  const updateCommand = useUpdateCommand()

  useEffectAsync(async () => {
    if (command) {
      setForm(command)
      setLoadingForm(false)
    }
  }, [command])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      setDisableForm(true)
      if (id) {
        await updateCommand.mutateAsync({ id: parseInt(id), command: values })
      } else {
        await createCommand.mutateAsync(values)
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
        validations: [],
      },
      'type': {
        value: '',
        validations: [{required: 'وارد کردن نوع خط الزامی است'}],
      },
    },
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
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
          <div className={cls(styles.inputsWrapper)}>
            <Card title={'ضروری'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="توضیحات" required={false} name="description" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputText placeholder="توضیحات" name="description"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.description} status={form.errors.description ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.description} />
              </div>
              <BaseCommandView item={form.values} setItem={form.setValues} errors={form.errors} />
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

export default CommandRegister
