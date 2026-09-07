import reportBell from '../../resources/images/medias/reportBell.svg'
import settingsMinimalistic from '../../resources/images/medias/settingsMinimalistic.svg'
import settingsScreenCast from '../../resources/images/medias/settingsScreenCast.svg'
import settingsWidget from '../../resources/images/medias/settingsWidget.svg'
import imei from '../../resources/images/medias/imeiOutline.svg'
import geofance from '../../resources/images/medias/geofanceOutline.svg'
import users from '../../resources/images/medias/usersOutline.svg'
import maintenance from '../../resources/images/medias/maintenanceOutline.svg'
import drivers from '../../resources/images/medias/driversOutline.svg'
import TabLayout from '../../common/layouts/tabLayout/TabLayout.jsx'
import {useRestriction} from '../../common/util/permissions.js'
import {useMetaTags} from '../../common/util/useMetaTags.js'
import styles from './SettingsPage.module.css'
import {useSelector} from 'react-redux'
import {useCallback, useEffect} from 'react'


const SettingsPage = () => {
  const readonly = useRestriction('readonly')
  const permissions = useSelector((state) => state.session.permissions)
  const currentUser = useSelector((state) => state?.session?.user)

  const settingsTabs = useCallback(() => {
    return {
      header: 'تنظیمات',
      items: [
        {
          title: 'اصلی',
          icon: settingsMinimalistic,
          link: 'preferences',
          hide: !permissions.includes('User-update'),
        },
        {
          title: 'اعلان‌ها',
          icon: reportBell,
          link: 'notifications',
          hide: !permissions.includes('Event-read'),
        },
        {
          title: 'شناسه ها',
          icon: imei,
          link: 'identifiers',
          hide: !permissions.includes('Imei-read'),
        },
        {
          title: 'دستگاه‌ها',
          icon: settingsScreenCast,
          link: 'devices',
          hide: !permissions.includes('Device-read'),
        },
        {
          title: 'حصارهای جغرافیایی',
          icon: geofance,
          link: 'geofences',
          hide: !permissions.includes('Geofence-read'),
        },
        // {
        //   title: 'گروه‌ها',
        //   icon: settingsWidget,
        //   link: 'groups',
        //   hide: false,
        // },
        {
          title: 'راننده‌ها',
          icon: drivers,
          link: 'drivers',
          hide: !permissions.includes('Driver-read'),
        },
        // {
        //   title: 'تقویم ها',
        //   icon: reportCalendarOutline,
        //   link: 'calendars',
        //   hide: false,
        // },
        // {
        //   title: 'ویژگی های محاسبه شده',
        //   icon: settingsWidget,
        //   link: 'attributes',
        // },
        {
          title: 'تعمیر و نگهداری',
          icon: maintenance,
          link: 'maintenances',
          hide: !permissions.includes('Maintenance-read'),
        },
        // {
        //   title: 'دستورات ذخیره شده',
        //   icon: settingsWidget,
        //   link: 'commands',
        // },
      ],
    }
  }, [permissions])

  const [meta, setMeta] = useMetaTags({title: 'راد: تنظیمات', description: 'settings'})
  return (
    <div className={styles.settingsPage}>
      <TabLayout tabs={settingsTabs()} />
    </div>
  )
}

export default SettingsPage
