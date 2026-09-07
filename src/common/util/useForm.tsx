import {FormikErrors, FormikHelpers, useFormik} from 'formik'
import {useState} from 'react'


type ValidationType = 'required' | 'email' | 'password' | 'custom'

type PasswordValidationConfig = {
  english?: boolean
  uppercase?: boolean
  lowercase?: boolean
  text?: boolean
  special?: boolean
  length?: boolean
}

type ValidationValue = string | {validator: (value: any, values: any) => string} | PasswordValidationConfig

type FormGroup = Record<string, {value?: any, validations: Partial<Record<ValidationType, ValidationValue>>[]}>
type FormType = {
  formGroup: FormGroup,
  handleSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void
  handelErrors?: () => void,
  isInitialValid?: boolean,
  scrollId?: string,
}

const validate = (values: any, formGroup: FormGroup, valueWhere: any) => {
  const errors: Record<string, any> = {}
  Object.entries(formGroup).forEach(([key, value]) => {
    let nameItem = key
    const valueItem = (values[nameItem])
    const validationList = value.validations
    validationList.forEach(valids => {
      Object.entries(valids).forEach(([key, value]) => {
        if (valueItem !== null) {
          if (valueItem == '' || valueItem === undefined || (Array.isArray(valueItem) && [...valueItem].length == 0)) {
            if (key == 'required') {
              errors[nameItem] = value
            }
          } else {
            if (key === 'password') {
              const enabledAll = typeof value === 'string'
              const cfg: any = typeof value === 'object' ? value : {}
              const getSetting = (rule: string) => cfg[rule]
              const shouldCheck = (rule: string) => enabledAll || getSetting(rule) === true || typeof getSetting(rule) === 'string'
              const pushError = (rule: string, defaultKey: string) => {
                const setting = getSetting(rule)
                if (typeof setting === 'string') {
                  errorKeys.push(setting)
                } else {
                  errorKeys.push(defaultKey)
                }
              }

              const errorKeys: string[] = []

              if (shouldCheck('english')) {
                // Disallow non-ASCII characters (only English letters, numbers, and ASCII symbols allowed)
                if (/[^\x20-\x7E]/.test(valueItem)) {
                  pushError('english', 'english')
                }
              }

              if (shouldCheck('uppercase')) {
                if (!/[A-Z]/.test(valueItem)) {
                  pushError('uppercase', 'uppercase')
                }
              }

              if (shouldCheck('lowercase')) {
                if (!/[a-z]/.test(valueItem)) {
                  pushError('lowercase', 'lowercase')
                }
              }

              if (shouldCheck('text')) {
                const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/
                if (!strongPattern.test(valueItem)) {
                  pushError('text', 'text')
                }
              }

              if (shouldCheck('special')) {
                if (!/(?=.*[-!$%^&*()_+|~=`{}\[\]:\/<>,.@#])/.test(valueItem)) {
                  pushError('special', 'special')
                }
              }

              if (shouldCheck('length')) {
                if (valueItem.length < 8) {
                  pushError('length', 'length')
                }
              }

              if (errorKeys.length > 0) {
                errors[nameItem] = errorKeys
              }
            }
            if (key === 'email') {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valueItem)
              ) {
                errors[nameItem] = value
              }
            }
            if (key === 'custom' && typeof value === 'object' && 'validator' in value) {
              const errorMessage = value.validator(valueItem, values)
              if (errorMessage) {
                errors[nameItem] = errorMessage
              }
            }
          }
        }
      })
    })
  })
  return errors
}

const useForm = ({formGroup, handleSubmit, isInitialValid = true, handelErrors, scrollId}: FormType) => {

  const [formGroupState, setFormGroupState] = useState(formGroup)

  const getInitValues = () => {
    return Object.entries(formGroupState).map(([key, value]) => {
      let result: any = {}
      if (value.value == '') {
        result[key] = null
        // } else if (Array.isArray(value.value) && Array(value.value).length === 0) {
        //   result[key] = []
      } else if (!!(value.value)) {
        result[key] = (value.value)
      } else {
        result[key] = (value.value)
      }
      return result
    }).reduce((a, c) => {
      return {...a, ...c}
    })
  }

  const initForm = () => {
    return useFormik({
      // children: undefined,
      // component: undefined,
      // initialErrors: undefined,
      // initialTouched: undefined,
      // innerRef: undefined,
      // isInitialValid,
      enableReinitialize: true,
      validateOnChange: true,
      validateOnMount: true,
      validateOnBlur: false,
      onSubmit(values: any, formikHelpers: FormikHelpers<any>): void | Promise<any> {
        const tempValues: any = {}
        Object.entries(values).forEach(async ([key, value]) => {
          if (value == null) {
            tempValues[key] = ''
          } else {
            tempValues[key] = (value)
          }
        })
        formikHelpers.setValues(tempValues)
        const errors = validate(tempValues, formGroup, undefined)
        if (Object.entries(errors).length > 0) {
          if (scrollId != null) {
            document.getElementById(scrollId).scrollTop = (document.getElementById(Object.entries(errors)[0][0]).offsetTop) - 20
          }
          formikHelpers.setErrors(errors)
          // if (handelErrors) {
          //   handelErrors()
          // }
        } else {
          handleSubmit(values, formikHelpers)
          formikHelpers.setSubmitting(true)
        }
      },
      // render(values: FormikProps<any>): React.ReactNode {
      //   return undefined
      // },

      validate(values: any): void | object | Promise<FormikErrors<any>> {
        return validate(values, formGroupState, null)
      },
      initialValues: {
        ...getInitValues(),
      },
      onReset: (values: any, formikHelpers: FormikHelpers<any>) => {
        formikHelpers.resetForm()
      },
    })
  }

  const form = initForm()

  const setFieldError = (field: string, message?: string) => {

    setFormGroupState((prevState) => {
      let newError: any = {}
      newError[field as any] = {value: '', validations: message ? [{required: message}] : []}
      return {...prevState, ...newError}
    })
    form.validateField(field)

  }

  return {form, setFieldError}
}

export default useForm


