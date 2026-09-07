import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
// import {useDispatch, useSelector} from 'react-redux'
import {useCatch, useEffectAsync} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
// import {commandsActions} from '../../../common/clientStore'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {formatBoolean} from '../../../common/util/formatter'
import {useRestriction} from '../../../common/util/permissions'
import {prefixString} from '../../../common/util/stringUtils'
import {useCommands, useDeleteCommand} from '../../../common/serverStore/useCommand.ts'
import {useSelector} from 'react-redux'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const readonly = false

const Commands = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const [searchKeyword, setSearchKeyword] = useState('')
  const t = useTranslation()
  const limitCommands = useRestriction('limitCommands')
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: commands = [], isLoading, isFetching} = useCommands(currentUser.id)
  const deleteCommand = useDeleteCommand()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (commands) {
      let commandsMap = commands.map((value: any) => {
        return {
          ...value,
          type: t(prefixString('command', value.type)),
          textChannel: formatBoolean(value.textChannel, t),
        }
      })
      setItems(commandsMap)
    }
  }, [commands])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {!readonly && <button
        onClick={() => {
          navigate(`/settings/commands/command/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {!readonly && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف دستور انتخاب شده اطمینان دارید؟"
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
      headerName: 'نوع خط',
      field: 'type',
    },
    {
      headerName: 'ارسال پیام کوتاه',
      field: 'textChannel',
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
      await deleteCommand.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="commandsContainer" className={styles.settingsContainer}>
            <Toolbar>
              <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/settings/commands/command')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                titleClassName={styles.text} />
            </Toolbar>
            <ReportCard
              containerId="commandsContainer"
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

export default Commands
