import React, {useEffect} from 'react'
import useForm from '../../../../common/util/useForm'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect'
import KitDatePicker from '../../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker'
import Button from '../../../../common/components/custom/general/button/Button'
import {preoids} from '../../../../common/util/constants'
import cls from 'classnames'
import styles from '../../ReportsCommon.module.css'
import {reportsActions} from '../../../../common/clientStore'
import replaystyles from '../ReplayPage.module.css'

interface ReplayFilterProps {
  deviceId: string | null
  periodState: string
  form: any
  onPeriodChange: (period: string) => void
  onSubmit: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>, child?: any) => void
  onChangeInvalid: (event: React.ChangeEvent<HTMLInputElement>, child?: any) => void
  onDeviceChange: (value: string) => void
  onDeviceClear: () => void
  onFromChange: (e: React.ChangeEvent) => void
  onToChange: (e: React.ChangeEvent) => void
  devices: []
}

const ReplayFilter: React.FC<ReplayFilterProps> = ({
                                                     deviceId,
                                                     periodState,
                                                     form,
                                                     onPeriodChange,
                                                     onSubmit,
                                                     onChange,
                                                     onChangeInvalid,
                                                     onDeviceChange,
                                                     onDeviceClear,
                                                     onToChange,
                                                     devices,
                                                   }) => {
  return (
    <form
      onChange={onChange as any}
      className={cls(styles.form, 'h-[20%] !w-full')}
    >
      <div className={cls(styles.inputsWrapper, '!flex-nowrap')}>
        <div className={cls(styles.input, 'md:!w-3/12')}>
          <KitInputWrapper
            label="دستگاه ها"
            required={true}
            name="deviceId"
            direction={'col'}
          >
            <KitSelect
              placeholder="دستگاه ها"
              name="deviceId"
              optionLabel={'name'}
              optionValue={'id'}
              options={devices}
              // endpoint={`/api/devices?userId=${currentUser.id}`}
              allowClear={false}
              showSearch={true}
              onChange={onDeviceChange as any}
              onClear={onDeviceClear}
              value={form.values.deviceId}
              classname={'w-[90%]'}
              status={form.errors.deviceId ? 'error' : ''}
            />
          </KitInputWrapper>
          {/*<KitInputError label={form.errors.deviceId} />*/}
        </div>
        <div className={styles.input}>
          <KitInputWrapper
            label="بازه"
            required={false}
            name="period"
            direction={'col'}
          >
            <KitSelect
              placeholder="بازه"
              name="period"
              options={preoids}
              allowClear={false}
              showSearch={true}
              onChange={(e) => onPeriodChange(String(e))}
              value={periodState as any}
              classname={'w-[90%]'}
            />
          </KitInputWrapper>
        </div>
        {periodState === '7' && (
          <>
            <div className={cls(styles.input, 'flex items-end')}>
              <KitDatePicker
                range={true}
                placeholder="سفارشی"
                name="custom"
                onChange={(e) => onChange(e)}
                onChangeInValid={(e) => onChangeInvalid(e)}
                classname={cls(replaystyles.typeButton,'text-primary hover:text-primary-hover active:!text-primary-active')}
                dateMode={'datetime'}
                inputType={'icon'}
                inputRender={(value, openCalendar) => {
                  return (
                    <Button
                      type="button"
                      onClick={() => {
                        openCalendar()
                      }}
                      title={'سفارشی'}
                      className={cls(
                        replaystyles.typeButton,
                        'btn-primary-outline',
                      )}
                      titleClassName={cls(styles.label, styles.registerLabel)}
                      disabled={deviceId == null || deviceId == 'undefined' || deviceId == undefined} />
                  )
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className={cls(styles.actions, 'z-50 !w-auto')}>
        <Button
          type="button"
          title={'نمایش'}
          className={cls(
            styles.button,
            styles.registerButton,
            'btn-primary',
          )}
          titleClassName={cls(styles.label, styles.registerLabel)}
          fontClassName={'fa fa-magnifying-glass'}
          disabled={!form.isValid}
          onClick={onSubmit}
        />
      </div>
    </form>
  )
}

export default ReplayFilter
