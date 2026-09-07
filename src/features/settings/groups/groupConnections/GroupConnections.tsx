import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import React from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import LinkField from '../../../../common/components/LinkField.tsx'
import useFeatures from '../../../../common/util/useFeatures'
import {formatNotificationTitle} from '../../../../common/util/formatter'
import {
  useAttributes, useAttributesByGroupId,
  useCalendars,
  useCommands, useCommandsByGroupId, useComputedAttributes,
  useDevices,
  useDrivers, useDriversByGroupId,
  useGeofences, useGeofencesByGroupId, useGroups,
  useMaintenances, useMaintenancesByGroupId, useNotifications, useNotificationsByGroupId, useUsers,
} from '../../../../common/serverStore'
import {useSelector} from 'react-redux'

const GroupConnections = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const features = useFeatures()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: drivers} = useDrivers(currentUser.id)
  const {data: maintenances} = useMaintenances(currentUser.id)
  const {data: geofences} = useGeofences(currentUser.id)
  const {data: commands} = useCommands(currentUser.id)
  const {data: notifications} = useNotifications(currentUser.id)
  const {data: attributes} = useAttributes(currentUser.id)
  const {data: driversGroup} = useDriversByGroupId(+id)
  const {data: maintenancesGroup} = useMaintenancesByGroupId(+id)
  const {data: geofencesGroup} = useGeofencesByGroupId(+id)
  const {data: commandsGroup} = useCommandsByGroupId(+id)
  const {data: notificationsGroup} = useNotificationsByGroupId(+id)
  const {data: attributesGroup} = useAttributesByGroupId(+id)
  const handleCancelClick = () => {
    navigate(-1)
  }

  return (
    <div className={styles.settingsRegister}>
      <div className={styles.settingsRegisterContainer}>
        {contextHolder}
        <div className={styles.form}>
          <div className={cls(styles.inputsWrapper)}>
            <Card title={'اتصالات'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="حصارهای جغرافیایی" required={false} name="geofence" direction={'col'}>
                  <LinkField
                    options={geofences}
                    optionsLinked={geofencesGroup}
                    // endpointAll="/api/geofences"
                    // endpointLinked={`/api/geofences?groupId=${id}`}
                    baseId={id}
                    keyBase="groupId"
                    keyLink="geofenceId"
                    label={'حصارهای جغرافیایی'} />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="رویدادها" required={false} name="geofence" direction={'col'}>
                  <LinkField
                    options={notifications}
                    optionsLinked={notificationsGroup}
                    // endpointAll="/api/notifications"
                    //          endpointLinked={`/api/notifications?groupId=${id}`}
                    baseId={id}
                    keyBase="groupId"
                    keyLink="notificationId"
                    mapItems={(it: any) => formatNotificationTitle(t, it)}
                    label={'رویدادها'}
                  />
                </KitInputWrapper>
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="رانندگان" required={false} name="geofence" direction={'col'}>
                  <LinkField
                    options={drivers}
                    optionsLinked={driversGroup}
                    // endpointAll="/api/drivers"
                    //          endpointLinked={`/api/drivers?groupId=${id}`}
                    baseId={id}
                    keyBase="groupId"
                    keyLink="driverId"
                    label={'رانندگان'} />
                </KitInputWrapper>
              </div>
              {!features.disableComputedAttributes && (
                <div className={styles.input}>
                  <KitInputWrapper label="ویژگیهای محاسبه شده" required={false} name="geofence" direction={'col'}>
                    <LinkField
                      options={attributes}
                      optionsLinked={attributesGroup}
                      // endpointAll="/api/attributes/computed"
                      //          endpointLinked={`/api/attributes/computed?groupId=${id}`}
                      baseId={id}
                      keyBase="groupId"
                      keyLink="attributeId"
                      titleGetter={'description'}
                      label={'ویژگیهای محاسبه شده'}
                    />
                  </KitInputWrapper>
                </div>
              )}
              <div className={styles.input}>
                <KitInputWrapper label="دستورات ذخیره شده" required={false} name="geofence" direction={'col'}>
                  <LinkField
                    options={commands}
                    optionsLinked={commandsGroup}
                    // endpointAll="/api/commands"
                    //          endpointLinked={`/api/commands?groupId=${id}`}
                    baseId={id}
                    keyBase="groupId"
                    keyLink="commandId"
                    titleGetter={'description'}
                    label={'دستورات ذخیره شده'} />
                </KitInputWrapper>
              </div>
              {!features.disableMaintenance && (
                <div className={styles.input}>
                  <KitInputWrapper label="تعمیر و نگهداری" required={false} name="geofence" direction={'col'}>
                    <LinkField
                      options={maintenances}
                      optionsLinked={maintenancesGroup}
                      // endpointAll="/api/maintenance"
                      //          endpointLinked={`/api/maintenance?groupId=${id}`}
                      baseId={id}
                      keyBase="groupId"
                      keyLink="maintenanceId"
                      label={'تعمیر و نگهداری'}
                    />
                  </KitInputWrapper>
                </div>
              )}
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

export default GroupConnections
