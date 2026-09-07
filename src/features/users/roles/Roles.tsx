import {useNavigate} from 'react-router-dom'
import styles from '../UsersCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {formatBoolean, formatTime} from '../../../common/util/formatter'
import {usePreference} from '../../../common/util/preferences'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {useRoles, useDeleteRole} from '../../../common/serverStore/useRole.ts'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'
import {useAccessibility} from '../../../common/serverStore/useAccessibility.ts'

const readonly = false

const Roles = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const [items, setItems] = useState<any[]>([])
  const t = useTranslation()
  const hours12 = usePreference('twelveHourFormat')
  const {data: accessibilitiesData} = useAccessibility()
  const {data: roles = [], isLoading, isFetching} = useRoles()
  const deleteRole = useDeleteRole()

  useEffect(() => {
    if (roles) {
      let rolesMap = roles.filter(item => item.id != '1')
      setItems(rolesMap)
    }
  }, [roles])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {permissions.includes('Role-update') && <button
        onClick={() => {
          navigate(`/users/roles/role/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {permissions.includes('Role-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف نقش انتخاب شده اطمینان دارید؟"
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
      headerName: 'نام نقش',
      field: 'name',
    },
    {
      headerName: 'عملیات',
      field: 'button',
      // pinned: 'left',
      cellRenderer: cellRender,
      hide: !(permissions.includes('Role-update')) && !(permissions.includes('Role-delete')),
      // suppressToolPanel: !administrator,
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteRole.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.users}>
          <div id="rolesContainer" className={styles.usersContainer}>
            <Toolbar>
              {permissions.includes('Role-persist') && <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/users/roles/role')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                fontClassName={'fa fa-add'}
                titleClassName={styles.text} />}
            </Toolbar>
            <ReportCard
              containerId="rolesContainer"
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

export default Roles
