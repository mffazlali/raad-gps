import {Outlet, useLocation, useNavigate, useParams} from 'react-router-dom'
import styles from '../../UsersCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useCatch, useEffectAsync} from '../../../../common/util/reactHelper'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {rolesActions} from '../../../../common/clientStore'
import PageWrapper from '../../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {formatBoolean, formatTime} from '../../../../common/util/formatter'
import {usePreference} from '../../../../common/util/preferences'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import axios from 'axios'
import axiosInstance from '../../../../common/util/axiosConfig.ts'

const readonly = false

const UserRoles = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const roles = useSelector((state: any) => state.roles.items)
  const [timestamp, setTimestamp] = useState(Date.now())
  const [items, setItems] = useState<any[]>([])
  const [itemId, setItemId] = useState()
  const [loading, setLoading] = useState(false)
  const t = useTranslation()
  const hours12 = usePreference('twelveHourFormat')
  const {id} = useParams()
  const {state} = useLocation()

  // useEffect(() => {
  //   let rolesMap = Object.entries(roles).map((value) => {
  //     return value[1]
  //   })
  //   setItems(rolesMap)
  // }, [roles])

  useEffectAsync(async () => {
    if(state){
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/api/accesslevel/${id}`)
        if (response.status === 200) {
          const res = response.data
          dispatch(rolesActions.refresh(res))
          setItems(res)
          setLoading(false)
        } else {
          setItems([])
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
        setItems([])
      }
    }
  }, [timestamp,state])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {!readonly && <button
        onClick={() => {
          navigate(`/users/users/userroles/${id}/userrole/${params.data.id}`, {state: {userId: id}})
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {!readonly && <KitPopconfirm
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
      // hide: !administrator,
      // suppressToolPanel: !administrator,
    },
  ]

  const handleCancelClick = () => {
    navigate(-1)
  }
  const handleRemove = useCatch(async (itemId) => {
    try {
      setLoading(true)
      const response = await axiosInstance.delete(`/api/accesslevel/${itemId}`)
      if (response.status === 204) {
        setTimestamp(Date.now)
      } else {
        showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
      setLoading(false)
    } catch (error) {
      showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      setLoading(false)
    }
  })

  return (
    <>
      {contextHolder}
      <Outlet />
      <div className={styles.usersRegister}>
        <div className={styles.usersRegisterContainer}>
          <div>
            <Button
              type="button"
              title={'افزودن'}
              onClick={() => navigate(`/users/users/userroles/${id}/userrole`, {state: {userId: id}})}
              className={cls(
                styles.button,
                'btn-primary',
              )}
              fontClassName={'fa fa-add'}
              titleClassName={styles.text} />
          </div>
          <div className={styles.gridWrapper}>
            <KitGrid containerClassName={'h-[100%] relative'} dataSource={items} columns={columns}
                     loading={loading} />
          </div>
          <div className={styles.form}>
            <div className={styles.actionsWrapper}>
              <div className={styles.actions}>
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
    </>
  )
}

export default UserRoles
