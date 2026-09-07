import {useNavigate} from 'react-router-dom'
import reportBell from '../../resources/images/medias/reportBell.svg'
import reportDiagramUpLinear from '../../resources/images/medias/reportDiagramUpLinear.svg'
import reportDocumentTextOutline from '../../resources/images/medias/reportDocumentTextOutline.svg'
import reportMapPointLinear from '../../resources/images/medias/reportMapPointLinear.svg'
import reportRepeatOutline from '../../resources/images/medias/reportRepeatOutline.svg'
import reportRoutingLinear from '../../resources/images/medias/reportRoutingLinear.svg'
import reportSignPostLinear from '../../resources/images/medias/reportSignPostLinear.svg'
import heatMap from '../../resources/images/medias/heatMapOutline.svg'
import userLogin from '../../resources/images/medias/userLoginOutline.svg'
import TabLayout from '../../common/layouts/tabLayout/TabLayout.jsx'
import {useMetaTags} from '../../common/util/useMetaTags.js'
import styles from './ReportPage.module.css'
import {useCallback} from 'react'
import {useSelector} from 'react-redux'


const ReportPage = () => {
  const permissions = useSelector((state) => state.session.permissions)
  const [meta, setMeta] = useMetaTags({title: 'راد: گزارش ها', description: 'report'})
  const isAPN = import.meta.env.VITE_APP_APN_ENABLE

  const reportsTabs = useCallback(() => {
    return {
      header: 'گزارش‌ها',
      items: [
        {
          title: 'تجمیعی',
          icon: reportDocumentTextOutline,
          link: 'combined',
          hide: !permissions.includes('getCombined'),
        },
        {
          title: 'مسیر‌ها',
          icon: reportSignPostLinear,
          link: 'route',
          hide: !permissions.includes('getRoute'),
        },
        {
          title: 'اعلان‌ها',
          icon: reportBell,
          link: 'event',
          hide: !permissions.includes('getEvents'),
        },
        // {
        //   title: 'حرکت‌ها',
        //   icon: reportRoutingLinear,
        //   link: 'trip',
        // hide: !permissions.includes(''),
        // },
        {
          title: 'توقف‌ها',
          icon: reportMapPointLinear,
          link: 'stop',
          hide: !permissions.includes('getIgnitionOn'),
        },
        // {
        //   title: 'خلاصه',
        //   icon: reportSidebarLinear,
        //   link: 'summary',
        // hide: !permissions.includes(''),
        // },
        {
          title: 'نمودار',
          icon: reportDiagramUpLinear,
          link: 'chart',
          hide: !permissions.includes('getIgnitionDiagram'),
        },
        {
          title: 'بازپخش',
          icon: reportRepeatOutline,
          link: 'replay',
          hide: !permissions.includes('getStopTime'),
        },
        {
          title: 'حرارتی',
          icon: heatMap,
          link: 'heat',
          hide: !permissions.includes('getHeatCombined') || isAPN?.toLowerCase?.() === 'true',
        },
        // {
        //   title: 'ورود کاربر',
        //   icon: userLogin,
        //   link: 'loginhistory',
        //   hide: !permissions.includes('getLoginHistory'),
        // },
        // {
        //   title: 'زمان‌بندی شده',
        //   icon: reportCalendarOutline,
        //   link: 'scheduled',
        // hide: !permissions.includes(''),
        // },
      ],
    }
  }, [permissions])

  return (
    <div className={styles.reportPage}>
      <TabLayout tabs={reportsTabs()} />
    </div>
  )
}

export default ReportPage
