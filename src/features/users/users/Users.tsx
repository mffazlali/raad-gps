import {useNavigate} from 'react-router-dom'
import styles from '../UsersCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {formatState, formatTime} from '../../../common/util/formatter'
import {usePreference} from '../../../common/util/preferences'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {isExpired} from '../../../common/util/DateTimeUtil'
import {useUsers, useDeleteUser} from '../../../common/serverStore'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'
import store from '../../../common/clientStore/index' // مسیر صحیح رو طبق پروژه‌ات تنظیم کن

const readonly = false

const Users = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const currentUser = useSelector((state: any) => state?.session?.user)
  const [items, setItems] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const t = useTranslation()
  const hours12 = usePreference('twelveHourFormat')

  const {data: users = [], isLoading, isFetching} = useUsers(currentUser.id)
  const deleteUser = useDeleteUser()


  useEffect(() => {
    if (users) {
      let usersMap: any[] = users.map((value) => {
        return {
          ...(value as any),
          status: getStatus((value as any).expirationTime, (value as any).disabled, (value as any).deleted),
        }
      })
      setItems(usersMap)
    }
  }, [users])

  const getStatus = (expirationTime: string, disabled: boolean, deleted: boolean) => {
    const timestamp = store.getState().session.timestamp // این باعث ری‌ رندر نمی‌شه
    if (deleted) {
      return 'حذف شده'
    }
    if (isExpired(expirationTime, timestamp)) {
      return 'منقضی شده'
    }
    return formatState(disabled, t)
  }

  const handleLogin = useCatch(async (userId: any) => {
    try {
      const response = await axiosInstance.get(`/api/session/${userId}`)
      if (response.status === 200) {
        window.location.replace('/')
      } else {
        showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
        throw Error(response.data)
      }
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    handleLogin(params.data.id)*/}
      {/*  }}*/}
      {/*  type="button"*/}
      {/*  className={cls(styles.connectionsAction, 'fa fa-right-to-bracket')}*/}
      {/*  title={'ورود'}>*/}
      {/*</button>*/}
      {permissions.includes('User-update') && <button
        onClick={() => {
          navigate(`/users/users/user/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {permissions.includes('Password-update') && <button
        onClick={() => {
          navigate(`/users/users/user/${params.data.id}/change-password`)
        }}
        type="button"
        className={cls(styles.changePasswordAction, 'fa fa-key')}
        title={'تغییر رمز عبور'}>
      </button>}
      {/*{!readonly && <button*/}
      {/*  onClick={() => {*/}
      {/*    navigate(`/users/users/user/${params.data.id}/connections`)*/}
      {/*  }}*/}
      {/*  type="button"*/}
      {/*  className={cls(styles.connectionsAction, 'fa fa-link')}*/}
      {/*  title={'اتصالات'}>*/}
      {/*</button>}*/}
      {permissions.includes('User-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف کاربر انتخاب شده اطمینان دارید؟"
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
          className={cls(styles.deleteAction, 'fa fa-trash', params.data.deleted && '!text-red-300')}
          title={'حذف'}
          disabled={params.data.deleted}
        >
        </button>
      </KitPopconfirm>}
    </div>
  }

  const columns: ColumnsKitGridType = [
    {
      headerName: 'نام و نام خانوادگی',
      field: 'name',
      // tooltipValueGetter:(tooltip)=>tooltip.value
    },
    {
      headerName: 'ایمیل',
      field: 'email',
    },
    // {
    //   headerName: 'مدیر',
    //   field: 'expression',
    //   valueFormatter: (p) => formatBoolean(p.value, t),
    // },
    {
      headerName: 'نقش',
      field: 'roles',
      valueFormatter: (p) => (p.value && [...p.value].length > 0) ? [...p.value].map(item => item.name).join('، ') : '',
      tooltipValueGetter: (p) => (p.value && [...p.value].length > 0) ? [...p.value].map(item => item.name).join('، ') : '',
    },
    {
      headerName: 'وضعیت',
      field: 'status',
      cellRenderer: (params) => {
        const isDeleted = params.value === 'حذف شده'
        return (
          <span className={isDeleted && 'text-gray-500 opacity-50'}>
        {params.value}
      </span>
        )
      },
    },
    {
      headerName: 'تاریخ انقضاء',
      field: 'expirationTime',
      valueFormatter: (p) => formatTime(p.value, '', hours12),
    },
    {
      headerName: 'عملیات',
      field: 'button',
      pinned: 'left',
      cellRenderer: cellRender,
      hide: !(permissions.includes('User-update')) && !(permissions.includes('User-delete')) && !(permissions.includes('Password-update')),
      // suppressToolPanel: !administrator,
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteUser.mutateAsync(itemId)
      const responseRols = await axiosInstance.delete(`/api/accesslevel/${itemId}`)
      if (responseRols.status === 204) {
        // Success
      } else {
        showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    } catch (e) {
      showMessage({message: e.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.users}>
          <div id="usersContainer" className={styles.usersContainer}>
            <Toolbar>
              {permissions.includes('User-persist') && <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/users/users/user')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                fontClassName={'fa fa-add'}
                titleClassName={styles.text} />}
            </Toolbar>
            <ReportCard
              containerId="usersContainer"
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

export default Users
