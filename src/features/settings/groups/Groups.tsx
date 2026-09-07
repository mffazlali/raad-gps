import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDeviceReadonly, useRestriction} from '../../../common/util/permissions'
import {useDispatch, useSelector} from 'react-redux'
import {usePreference} from '../../../common/util/preferences'
import {useCatch} from '../../../common/util/reactHelper'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {useGroups, useDeleteGroup} from '../../../common/serverStore/useGroup.ts'
import {groupsActions} from '../../../common/clientStore'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const Groups = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const hours12 = usePreference('twelveHourFormat')
  const deviceReadonly = useDeviceReadonly()
  const [items, setItems] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const limitCommands = useRestriction('limitCommands')
  const readonly = false
  const t = useTranslation()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: groups = [], isLoading, isFetching} = useGroups(currentUser.id)
  const deleteGroup = useDeleteGroup()
  const dispatch = useDispatch()

  useEffect(() => {
    if (groups) {
      setItems(groups)
      dispatch(groupsActions.refresh(groups))
    }
  }, [groups])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {!readonly && <button
        onClick={() => {
          navigate(`/settings/groups/group/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    navigate(`/settings/groups/group/${params.data.id}/command`)*/}
      {/*  }}*/}
      {/*  type="button"*/}
      {/*  className={cls(styles.commandAction, 'fa fa-check-double')}*/}
      {/*  title={'فرمان'}>*/}
      {/*</button>*/}
      {/*{limitCommands && <button*/}
      {/*  onClick={() => {*/}
      {/*    navigate(`/settings/groups/group/${params.data.id}/connections`)*/}
      {/*  }}*/}
      {/*  type="button"*/}
      {/*  className={cls(styles.connectionsAction, 'fa fa-link')}*/}
      {/*  title={'اتصالات'}>*/}
      {/*</button>*/}
      {/*}*/}
      {!readonly && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف گروه انتخاب شده اطمینان دارید؟"
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
      await deleteGroup.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="groupsContainer" className={styles.settingsContainer}>
            <Toolbar>
              {permissions.includes('Group-persist') && <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/settings/groups/group')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                fontClassName={'fa fa-add'}
                titleClassName={styles.text} />}
            </Toolbar>
            <ReportCard
              containerId="groupsContainer"
              isLoading={isFetching}
              tableContent={
                <KitGrid containerClassName={'h-[100%] relative'} dataSource={items} columns={columns}
                         loading={isFetching} />
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Groups
