import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {useCalendars, useDeleteCalendar} from '../../../common/serverStore/useCalendar.ts'
import {calendarsActions} from '../../../common/clientStore'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const readonly = false

const Calendars = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const [items, setItems] = useState<any[]>([])
  const t = useTranslation()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: calendars = [], isLoading, isFetching} = useCalendars(currentUser.id)
  const deleteCalendar = useDeleteCalendar()
  const dispatch = useDispatch()

  useEffect(() => {
    if (calendars) {
      setItems(calendars)
      dispatch(calendarsActions.refresh(calendars))
    }
  }, [calendars])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {!readonly && <button
        onClick={() => {
          navigate(`/settings/calendars/calendar/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {!readonly && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف تقویم انتخاب شده اطمینان دارید؟"
        onConfirm={(e) => {
          handleRemove(params.data.id)
        }}
        onCancel={(e) => {
        }}
        okText="بلی"
        cancelText="خیر"
        placement={'right'}
      >
        <button
          type="button"
          className={cls(styles.deleteAction, 'fa fa-trash')}
          title={'حذف'}>
        </button>
      </KitPopconfirm>}
    </div>
  }

  const columns: ColumnsKitGridType = [
    {
      headerName: 'نام',
      field: 'name',
    },
    {
      headerName: 'عملیات',
      field: 'button',
      pinned: 'left',
      cellRenderer: cellRender,
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteCalendar.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="calendarsContainer" className={styles.settingsContainer}>
            <Toolbar>
              <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/settings/calendars/calendar')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                titleClassName={styles.text} />
            </Toolbar>
            <ReportCard
              containerId="calendarsContainer"
              isLoading={isFetching}
              tableContent={
                <KitGrid 
                  containerClassName={'h-[100%] relative'} 
                  dataSource={items} 
                  columns={columns}
                  loading={isFetching} 
                />
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Calendars
