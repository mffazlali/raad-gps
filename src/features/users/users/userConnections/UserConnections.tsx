import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../UsersCommon.module.css'
import cls from 'classnames'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import React from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import LinkField from '../../../../common/components/LinkField.tsx'
import {formatNotificationTitle} from '../../../../common/util/formatter'
import {useSelector} from 'react-redux'
import {
  useCalendars,
  useCommands, useComputedAttributes, useDevices,
  useDrivers,
  useDriversByDeviceId, useGeofences, useGeofencesByDeviceId, useGroups,
  useMaintenances,
  useMaintenancesByDeviceId, useNotifications, useUsers,
} from '../../../../common/serverStore'

const UserConnections = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: drivers} = useDrivers(currentUser.id)
  const {data: maintenances} = useMaintenances(currentUser.id)
  const {data: geofences} = useGeofences(currentUser.id)
  const {data: commands} = useCommands(currentUser.id)
  const {data: calendars} = useCalendars(currentUser.id)
  const {data: devices} = useDevices(currentUser.id)
  const {data: notifications} = useNotifications(currentUser.id)
  const {data: groups} = useGroups(currentUser.id)
  const {data: users} = useUsers(currentUser.id)
  const {data: computedAttributes} = useComputedAttributes(currentUser.id)
  const handleCancelClick = () => {
    navigate(-1)
  }

  return (
    <div className={styles.usersRegister}>
      <div className={styles.usersRegisterContainer}>
        {contextHolder}
        <div className={styles.form}>
          <div className={cls(styles.inputsWrapper)}>
            <Card title={'اتصالات'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="دستگاه ها" required={false} name="deviceTitle" direction={'col'}>
                  <LinkField
                    options={devices}
                    optionsLinked={devices}
                    // endpointAll="/api/devices?all=true"
                    //          endpointLinked={`/api/devices?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="deviceId"
                    label={'دستگاه ها'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="گروه ها" required={false} name="usersGroups" direction={'col'}>
                  <LinkField
                    options={groups}
                    optionsLinked={groups}
                    // endpointAll="/api/groups?all=true"
                    // endpointLinked={`/api/groups?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="groupId"

                    label={'گروه ها'}
                  />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="حصارهای جغرافیایی" required={false} name="sharedGeofences" direction={'col'}>
                  <LinkField
                    options={geofences}
                    optionsLinked={geofences}
                    // endpointAll="/api/geofences?all=true"
                    // endpointLinked={`/api/geofences?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="geofenceId"
                    label={'حصارهای جغرافیایی'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="رویدادها" required={false} name="sharedNotifications" direction={'col'}>
                  <LinkField
                    options={notifications}
                    optionsLinked={notifications}
                    // endpointAll="/api/notifications?all=true"
                    // endpointLinked={`/api/notifications?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="notificationId"
                    mapItems={(it) => formatNotificationTitle(t, it, true)}
                    label={'رویدادها'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="تقویم ها" required={false} name="sharedGeofences" direction={'col'}>
                  <LinkField
                    options={calendars}
                    optionsLinked={calendars}
                    // endpointAll="/api/calendars?all=true"
                    // endpointLinked={`/api/calendars?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="calendarId"
                    label={'تقویم ها'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="کاربر" required={false} name="usersUsers" direction={'col'}>
                  <LinkField
                    options={users}
                    optionsLinked={users}
                    // endpointAll="/api/users?all=true"
                    // endpointLinked={`/api/users?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="managedUserId"
                    label={'کاربر'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="ویژگیهای محاسبه شده" required={false} name="sharedComputedAttributes"
                                 direction={'col'}>
                  <LinkField
                    options={computedAttributes}
                    optionsLinked={computedAttributes}
                    // endpointAll="/api/attributes/computed?all=true"
                    // endpointLinked={`/api/attributes/computed?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="attributeId"
                    titleGetter={'description'}
                    label={'ویژگیهای محاسبه شده'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="رانندگان" required={false} name="sharedDrivers"
                                 direction={'col'}>
                  <LinkField
                    options={drivers}
                    optionsLinked={drivers}
                    // endpointAll="/api/drivers?all=true"
                    // endpointLinked={`/api/drivers?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="driverId"
                    label={'رانندگان'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="دستورات ذخیره شده" required={false} name="sharedSavedCommands"
                                 direction={'col'}>
                  <LinkField
                    options={commands}
                    optionsLinked={commands}
                    // endpointAll="/api/commands?all=true"
                    // endpointLinked={`/api/commands?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="commandId"
                    titleGetter={'description'}
                    label={'دستورات ذخیره شده'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="تعمیر و نگهداری" required={false} name="sharedMaintenance"
                                 direction={'col'}>
                  <LinkField
                    options={maintenances}
                    optionsLinked={maintenances}
                    // endpointAll="/api/maintenance?all=true"
                    // endpointLinked={`/api/maintenance?userId=${id}`}
                    baseId={id}
                    keyBase="userId"
                    keyLink="maintenanceId"
                    label={'تعمیر و نگهداری'} />
                </KitInputWrapper>
              </div>
            </Card>
          </div>
          <div className={styles.actionWrapper}>
            <div className={styles.action}>
              <Button
                type="button"
                title={'لغو'}
                onClick={handleCancelClick}
                className={cls(styles.button, styles.cancelButton, 'btn-primary-outline')}
                titleClassName={cls(styles.label, styles.cancelLabel)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserConnections
