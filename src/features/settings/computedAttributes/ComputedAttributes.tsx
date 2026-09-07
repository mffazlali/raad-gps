import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useAdministrator} from '../../../common/util/permissions'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {useComputedAttributes, useDeleteComputedAttribute} from '../../../common/serverStore/useComputedAttribute.ts'
import {useSelector} from 'react-redux'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const readonly = false

const ComputedAttributes = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const [searchKeyword, setSearchKeyword] = useState('')
  const administrator = useAdministrator()
  const t = useTranslation()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: computedAttributes = [], isLoading, isFetching} = useComputedAttributes(currentUser.id)
  const deleteComputedAttribute = useDeleteComputedAttribute()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (computedAttributes) {
      setItems(computedAttributes)
    }
  }, [computedAttributes])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {!readonly && <button
        onClick={() => {
          navigate(`/settings/attributes/attribute/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {!readonly && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف ویژگی انتخاب شده اطمینان دارید؟"
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
      headerName: 'توضیحات',
      field: 'description',
    },
    {
      headerName: 'ویژگی ها',
      field: 'attribute',
    },
    {
      headerName: 'اصطلاح',
      field: 'expression',
    },
    {
      headerName: 'نوع خط',
      field: 'type',
    },
    {
      headerName: 'عملیات',
      field: 'button',
      pinned: 'left',
      cellRenderer: cellRender,
      // hide: !administrator,
      // suppressToolPanel: !administrator,
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteComputedAttribute.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="computedAttributesContainer" className={styles.settingsContainer}>
            <Toolbar>
              {<Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/settings/attributes/attribute')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                fontClassName={'fa fa-add'}
                titleClassName={styles.text} />}
            </Toolbar>
            <ReportCard
              containerId="computedAttributesContainer"
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

export default ComputedAttributes
