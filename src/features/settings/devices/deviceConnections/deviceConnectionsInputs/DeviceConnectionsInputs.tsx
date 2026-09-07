import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../../SettingsCommon.module.css'
import cls from 'classnames'
import KitInputWrapper from '../../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import React from 'react'
import useMessage from '../../../../../common/util/useMessage.tsx'
import Card from '../../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../../common/components/LocalizationProvider'
import LinkField from '../../../../../common/components/LinkField.tsx'
import useFeatures from '../../../../../common/util/useFeatures'
import {formatNotificationTitle} from '../../../../../common/util/formatter'
import {
  useCalendars,
  useCommands,
  useDevices,
  useDrivers, useDriversByDeviceId,
  useGeofences, useGeofencesByDeviceId,
  useMaintenances, useMaintenancesByDeviceId,
} from '../../../../../common/serverStore'
import {useSelector} from 'react-redux'

const DeviceConnectionsInputs = () => {
  const t = useTranslation()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {id} = useParams()
  const {data: drivers} = useDrivers(currentUser.id)
  const {data: driversDevice} = useDriversByDeviceId(+id)
  const {data: maintenances} = useMaintenances(currentUser.id)
  const {data: maintenancesByDeviceId} = useMaintenancesByDeviceId(+id)
  const {data: geofences} = useGeofences(currentUser.id)
  const {data: geofencesDevice} = useGeofencesByDeviceId(+id)
  const {data: commands} = useCommands(currentUser.id)
  const {data: calendars} = useCalendars(currentUser.id)
  const {data: devices} = useDevices(currentUser.id)

  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const features = useFeatures()

  return (
    <Card title={'اتصالات'} contentClassName={styles.inputs}>
      <div className={styles.input}>
        <KitInputWrapper label="حصارهای جغرافیایی" required={false} name="geofence" direction={'col'}>
          <LinkField
            options={geofences}
            optionsLinked={geofencesDevice}
            // endpointAll="/api/geofences"
            // endpointLinked={`/api/geofences?deviceId=${id}`}
            baseId={id}
            keyBase="deviceId"
            keyLink="geofenceId"
            label={'حصارهای جغرافیایی'} />
        </KitInputWrapper>
      </div>
      {/*<div className={styles.input}>*/}
      {/*  <KitInputWrapper label="رویدادها" required={false} name="geofence" direction={'col'}>*/}
      {/*    <LinkField endpointAll="/api/notifications"*/}
      {/*               endpointLinked={`/api/notifications?deviceId=${id}`}*/}
      {/*               baseId={id}*/}
      {/*               keyBase="deviceId"*/}
      {/*               keyLink="notificationId"*/}
      {/*               mapItems={(it: any) => formatNotificationTitle(t, it)}*/}
      {/*               label={'رویدادها'}*/}
      {/*    />*/}
      {/*  </KitInputWrapper>*/}
      {/*</div>*/}
      <div className={styles.input}>
        <KitInputWrapper label="رانندگان" required={false} name="geofence" direction={'col'}>
          <LinkField
            options={drivers}
            optionsLinked={driversDevice}
            // endpointAll="/api/drivers"
            //          endpointLinked={`/api/drivers?deviceId=${id}`}
            baseId={id}
            keyBase="deviceId"
            keyLink="driverId"
            label={'رانندگان'} />
        </KitInputWrapper>
      </div>
      {/*{!features.disableComputedAttributes && (*/}
      {/*  <div className={styles.input}>*/}
      {/*    <KitInputWrapper label="ویژگیهای محاسبه شده" required={false} name="geofence" direction={'col'}>*/}
      {/*      <LinkField*/}
      {/*        endpointAll="/api/attributes/computed"*/}
      {/*        endpointLinked={`/api/attributes/computed?deviceId=${id}`}*/}
      {/*        baseId={id}*/}
      {/*        keyBase="deviceId"*/}
      {/*        keyLink="attributeId"*/}
      {/*        titleGetter={'description'}*/}
      {/*        label={'ویژگیهای محاسبه شده'}*/}
      {/*      />*/}
      {/*    </KitInputWrapper>*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*<div className={styles.input}>*/}
      {/*  <KitInputWrapper label="دستورات ذخیره شده" required={false} name="geofence" direction={'col'}>*/}
      {/*    <LinkField*/}
      {/*      endpointAll="/api/commands"*/}
      {/*      endpointLinked={`/api/commands?deviceId=${id}`}*/}
      {/*      baseId={id}*/}
      {/*      keyBase="deviceId"*/}
      {/*      keyLink="commandId"*/}
      {/*      titleGetter={'description'}*/}
      {/*      label={'دستورات ذخیره شده'} />*/}
      {/*  </KitInputWrapper>*/}
      {/*</div>*/}
      {!features.disableMaintenance && (
        <div className={styles.input}>
          <KitInputWrapper label="تعمیر و نگهداری" required={false} name="geofence" direction={'col'}>
            <LinkField
              options={maintenances}
              optionsLinked={maintenancesByDeviceId}
              // endpointAll="/api/maintenance"
              // endpointLinked={`/api/maintenance?deviceId=${id}`}
              baseId={id}
              keyBase="deviceId"
              keyLink="maintenanceId"
              label={'تعمیر و نگهداری'}
            />
          </KitInputWrapper>
        </div>
      )}
    </Card>
  )
}

export default DeviceConnectionsInputs
